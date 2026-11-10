import "server-only";

import { Prisma } from "@prisma/client";

import { weddingTimeZone } from "@/lib/config";
import { getPrisma } from "@/lib/db";
import { effectiveStatus, normalizeRsvp, toPublicInvitation } from "@/lib/invitation-policy";
import type { PublicInvitation } from "@/lib/public-types";
import { hashToken, isWellFormedToken } from "@/lib/tokens";
import { parseRsvpInput } from "@/lib/validators";

const include = {
  eventAccess: { include: { event: true } },
  rsvps: true,
} satisfies Prisma.GuestInclude;

export type InvitationLookup =
  | { state: "ready"; invitation: PublicInvitation }
  | { state: "not_found" }
  | { state: "disabled" }
  | { state: "expired" }
  | { state: "error" };

async function loadGuest(token: string) {
  if (!isWellFormedToken(token)) return null;
  return getPrisma().guest.findUnique({
    where: { tokenHash: hashToken(token) },
    include,
  });
}

export async function resolveInvitation(token: string): Promise<InvitationLookup> {
  try {
    const guest = await loadGuest(token);
    if (!guest) return { state: "not_found" };
    const status = effectiveStatus(guest.status, guest.expiresAt);
    if (status === "DISABLED") return { state: "disabled" };
    if (status === "EXPIRED") return { state: "expired" };
    return { state: "ready", invitation: toPublicInvitation(guest, weddingTimeZone()) };
  } catch (error) {
    console.error("Invitation lookup failed", error instanceof Error ? error.name : "unknown");
    return { state: "error" };
  }
}

export async function submitRsvp(token: string, body: unknown) {
  const parsed = parseRsvpInput(body);
  if (!parsed.ok) return { status: 400 as const, body: { error: parsed.error } };

  let guest: Awaited<ReturnType<typeof loadGuest>>;
  try {
    guest = await loadGuest(token);
  } catch (error) {
    console.error("RSVP lookup failed", error instanceof Error ? error.name : "unknown");
    return { status: 503 as const, body: { error: "Replies cannot be saved just now. Please try again." } };
  }
  if (!guest) return { status: 404 as const, body: { error: "This invitation could not be found." } };

  const availability = effectiveStatus(guest.status, guest.expiresAt);
  if (availability === "DISABLED") {
    return { status: 403 as const, body: { error: "This invitation is no longer available." } };
  }
  if (availability === "EXPIRED") {
    return { status: 403 as const, body: { error: "This invitation has expired." } };
  }

  const access = guest.eventAccess.find((item) => item.event.slug.toLowerCase() === parsed.data.eventSlug);
  if (!access || (guest.invitationType === "RECEPTION_ONLY" && parsed.data.eventSlug === "nikah")) {
    return { status: 403 as const, body: { error: "This event is not on your invitation." } };
  }

  const normalized = normalizeRsvp({
    status: parsed.data.status,
    attendeeCount: parsed.data.attendeeCount,
    maxAttendees: guest.maxAttendees,
  });
  if (!normalized.ok) return { status: 400 as const, body: { error: normalized.error } };

  const saved = {
    status: normalized.status,
    attendeeCount: normalized.attendeeCount,
    message: parsed.data.message,
  };

  try {
    await getPrisma().guestRSVP.upsert({
      where: { guestId_eventId: { guestId: guest.id, eventId: access.eventId } },
      create: { guestId: guest.id, eventId: access.eventId, ...saved },
      update: saved,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      await getPrisma().guestRSVP.update({
        where: { guestId_eventId: { guestId: guest.id, eventId: access.eventId } },
        data: saved,
      });
    } else {
      console.error("RSVP save failed", error instanceof Error ? error.name : "unknown");
      return { status: 500 as const, body: { error: "Your reply could not be saved. Please try again." } };
    }
  }

  return {
    status: 200 as const,
    body: {
      rsvp: {
        status: saved.status,
        attendeeCount: saved.attendeeCount,
        message: saved.message,
      },
    },
  };
}
