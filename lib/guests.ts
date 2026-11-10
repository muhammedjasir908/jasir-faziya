import "server-only";

import { Prisma } from "@prisma/client";

import { weddingTimeZone } from "@/lib/config";
import { getPrisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { toDateTimeLocal } from "@/lib/format";
import { effectiveStatus } from "@/lib/invitation-policy";
import type { InvitationAccess, InvitationState } from "@/lib/public-types";
import { invitationShareText, whatsAppHref } from "@/lib/share-text";
import { decryptToken, encryptToken, generateToken, hashToken } from "@/lib/tokens";
import { invitationUrl } from "@/lib/urls";
import type { GuestInput } from "@/lib/validators";

const guestInclude = {
  eventAccess: true,
  rsvps: { include: { event: true } },
} satisfies Prisma.GuestInclude;

type GuestRecord = Prisma.GuestGetPayload<{ include: typeof guestInclude }>;

export type AdminGuest = {
  id: string;
  name: string;
  phone: string | null;
  invitationType: InvitationAccess;
  maxAttendees: number;
  status: InvitationState;
  effectiveStatus: InvitationState;
  expiresAt: string | null;
  inviteUrl: string | null;
  whatsappUrl: string | null;
  createdAt: string;
  updatedAt: string;
  rsvpSummary: {
    eventTitle: string;
    eventSlug: string;
    status: "ACCEPTED" | "DECLINED";
    attendeeCount: number;
  }[];
};

async function syncAccess(tx: Prisma.TransactionClient, guestId: string, invitationType: InvitationAccess) {
  const events = await tx.event.findMany();
  const nikah = events.find((event) => event.slug === "nikah");
  const reception = events.find((event) => event.slug === "reception");
  if (!nikah || !reception) {
    throw new AppError("Seed the database before adding guests. The two celebrations are not ready yet.", 409);
  }
  await tx.guestEventAccess.deleteMany({ where: { guestId } });
  const eventIds = invitationType === "BOTH_EVENTS" ? [nikah.id, reception.id] : [reception.id];
  await tx.guestEventAccess.createMany({
    data: eventIds.map((eventId) => ({ guestId, eventId })),
  });
  if (invitationType === "RECEPTION_ONLY") {
    await tx.guestRSVP.deleteMany({ where: { guestId, eventId: nikah.id } });
  }
}

function presentGuest(guest: GuestRecord, baseUrl: string): AdminGuest {
  let token: string | null = null;
  try {
    token = decryptToken(guest.tokenCipher);
  } catch {
    token = null;
  }
  const invite = token ? invitationUrl(baseUrl, token) : null;
  const status = effectiveStatus(guest.status, guest.expiresAt);
  return {
    id: guest.id,
    name: guest.name,
    phone: guest.phone,
    invitationType: guest.invitationType,
    maxAttendees: guest.maxAttendees,
    status: guest.status,
    effectiveStatus: status,
    expiresAt: guest.expiresAt ? toDateTimeLocal(guest.expiresAt, weddingTimeZone()) : null,
    inviteUrl: invite,
    whatsappUrl: invite ? whatsAppHref(guest.phone, invitationShareText(guest.name, invite, guest.invitationType)) : null,
    createdAt: guest.createdAt.toISOString(),
    updatedAt: guest.updatedAt.toISOString(),
    rsvpSummary: [...guest.rsvps]
      .sort((a, b) => a.event.sortOrder - b.event.sortOrder)
      .map((rsvp) => ({
        eventTitle: rsvp.event.title,
        eventSlug: rsvp.event.slug,
        status: rsvp.status,
        attendeeCount: rsvp.attendeeCount,
      })),
  };
}

async function reload(id: string) {
  const guest = await getPrisma().guest.findUnique({ where: { id }, include: guestInclude });
  if (!guest) throw new AppError("That guest could not be found.", 404);
  return guest;
}

export async function listGuests(
  filters: { q?: string; category?: string; status?: string },
  baseUrl: string,
) {
  const and: Prisma.GuestWhereInput[] = [];
  const q = filters.q?.trim();
  if (q) {
    and.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (filters.category === "BOTH_EVENTS" || filters.category === "RECEPTION_ONLY") {
    and.push({ invitationType: filters.category });
  }
  const now = new Date();
  if (filters.status === "DISABLED") and.push({ status: "DISABLED" });
  if (filters.status === "EXPIRED") {
    and.push({
      OR: [{ status: "EXPIRED" }, { status: "ACTIVE", expiresAt: { lte: now } }],
    });
  }
  if (filters.status === "ACTIVE") {
    and.push({ status: "ACTIVE" });
    and.push({ OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] });
  }
  const guests = await getPrisma().guest.findMany({
    where: and.length ? { AND: and } : undefined,
    include: guestInclude,
    orderBy: { createdAt: "desc" },
  });
  return guests.map((guest) => presentGuest(guest, baseUrl));
}

export async function getAdminGuest(id: string, baseUrl: string) {
  const guest = await getPrisma().guest.findUnique({ where: { id }, include: guestInclude });
  return guest ? presentGuest(guest, baseUrl) : null;
}

async function guardAttendeeLimit(tx: Prisma.TransactionClient, guestId: string, maxAttendees: number) {
  const overflow = await tx.guestRSVP.findFirst({
    where: { guestId, status: "ACCEPTED", attendeeCount: { gt: maxAttendees } },
  });
  if (overflow) {
    throw new AppError("A saved reply already includes more guests than this limit.", 409);
  }
}

export async function createGuest(input: GuestInput, baseUrl: string) {
  const token = generateToken();
  const created = await getPrisma().$transaction(async (tx) => {
    const guest = await tx.guest.create({
      data: {
        name: input.name,
        phone: input.phone,
        invitationType: input.invitationType,
        maxAttendees: input.maxAttendees,
        status: input.status,
        expiresAt: input.expiresAt,
        tokenHash: hashToken(token),
        tokenCipher: encryptToken(token),
      },
    });
    await syncAccess(tx, guest.id, input.invitationType);
    return guest;
  });
  return presentGuest(await reload(created.id), baseUrl);
}

export async function updateGuest(id: string, input: GuestInput, baseUrl: string) {
  await getPrisma().$transaction(async (tx) => {
    const existing = await tx.guest.findUnique({ where: { id } });
    if (!existing) throw new AppError("That guest could not be found.", 404);
    await guardAttendeeLimit(tx, id, input.maxAttendees);
    await tx.guest.update({
      where: { id },
      data: {
        name: input.name,
        phone: input.phone,
        invitationType: input.invitationType,
        maxAttendees: input.maxAttendees,
        status: input.status,
        expiresAt: input.expiresAt,
      },
    });
    await syncAccess(tx, id, input.invitationType);
  });
  return presentGuest(await reload(id), baseUrl);
}

export async function deleteGuest(id: string) {
  const existing = await getPrisma().guest.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError("That guest could not be found.", 404);
  await getPrisma().guest.delete({ where: { id } });
}

export async function setGuestStatus(id: string, status: "ACTIVE" | "DISABLED", baseUrl: string) {
  const existing = await getPrisma().guest.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError("That guest could not be found.", 404);
  await getPrisma().guest.update({ where: { id }, data: { status } });
  return presentGuest(await reload(id), baseUrl);
}

export async function regenerateInvitation(id: string, baseUrl: string) {
  const token = generateToken();
  const existing = await getPrisma().guest.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError("That guest could not be found.", 404);
  await getPrisma().guest.update({
    where: { id },
    data: { tokenHash: hashToken(token), tokenCipher: encryptToken(token) },
  });
  return presentGuest(await reload(id), baseUrl);
}
