import "server-only";

import { weddingTimeZone } from "@/lib/config";
import { getPrisma } from "@/lib/db";
import { formatStamp } from "@/lib/format";
import { effectiveStatus, selectVisibleEvents } from "@/lib/invitation-policy";
import type { InvitationAccess, InvitationState } from "@/lib/public-types";

export type RsvpFilters = {
  q: string;
  category: "ALL" | InvitationAccess;
  status: "ALL" | "ACCEPTED" | "DECLINED" | "PENDING";
  event: "ALL" | "nikah" | "reception";
};

export type RsvpRow = {
  guestId: string;
  guestName: string;
  phone: string | null;
  invitationType: InvitationAccess;
  maxAttendees: number;
  invitationStatus: InvitationState;
  eventTitle: string;
  eventSlug: string;
  response: "ACCEPTED" | "DECLINED" | "PENDING";
  attendeeCount: number | null;
  message: string | null;
  updatedAt: string | null;
};

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function parseRsvpFilters(params: Record<string, string | string[] | undefined>): RsvpFilters {
  const category = readParam(params, "category");
  const status = readParam(params, "status");
  const event = readParam(params, "event");
  return {
    q: readParam(params, "q"),
    category: category === "BOTH_EVENTS" || category === "RECEPTION_ONLY" ? category : "ALL",
    status: status === "ACCEPTED" || status === "DECLINED" || status === "PENDING" ? status : "ALL",
    event: event === "nikah" || event === "reception" ? event : "ALL",
  };
}

export function filterQuery(filters: RsvpFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category !== "ALL") params.set("category", filters.category);
  if (filters.status !== "ALL") params.set("status", filters.status);
  if (filters.event !== "ALL") params.set("event", filters.event);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function listRsvpRows(filters: RsvpFilters): Promise<RsvpRow[]> {
  const guests = await getPrisma().guest.findMany({
    include: {
      eventAccess: { include: { event: true } },
      rsvps: true,
    },
    orderBy: { name: "asc" },
  });
  const needle = filters.q.toLowerCase();
  const rows: RsvpRow[] = [];
  for (const guest of guests) {
    if (filters.category !== "ALL" && guest.invitationType !== filters.category) continue;
    const phone = guest.phone ?? "";
    if (needle && !guest.name.toLowerCase().includes(needle) && !phone.toLowerCase().includes(needle)) continue;
    const visible = selectVisibleEvents(
      guest.invitationType,
      guest.eventAccess.map((access) => access.event),
    );
    for (const event of visible) {
      if (filters.event !== "ALL" && event.slug !== filters.event) continue;
      const rsvp = guest.rsvps.find((item) => item.eventId === event.id) ?? null;
      const response = rsvp?.status ?? "PENDING";
      if (filters.status !== "ALL" && response !== filters.status) continue;
      rows.push({
        guestId: guest.id,
        guestName: guest.name,
        phone: guest.phone,
        invitationType: guest.invitationType,
        maxAttendees: guest.maxAttendees,
        invitationStatus: effectiveStatus(guest.status, guest.expiresAt),
        eventTitle: event.title,
        eventSlug: event.slug,
        response,
        attendeeCount: rsvp ? rsvp.attendeeCount : null,
        message: rsvp?.message ?? null,
        updatedAt: rsvp ? formatStamp(rsvp.updatedAt, weddingTimeZone()) : null,
      });
    }
  }
  return rows;
}

export async function dashboardStats() {
  const [guests, rows] = await Promise.all([
    getPrisma().guest.findMany({ select: { invitationType: true } }),
    listRsvpRows({ q: "", category: "ALL", status: "ALL", event: "ALL" }),
  ]);
  const sum = (slug: string) =>
    rows
      .filter((row) => row.eventSlug === slug && row.response === "ACCEPTED")
      .reduce((total, row) => total + (row.attendeeCount ?? 0), 0);
  const parties = (slug: string) =>
    rows.filter((row) => row.eventSlug === slug && row.response === "ACCEPTED").length;
  return {
    totalGuests: guests.length,
    bothEvents: guests.filter((guest) => guest.invitationType === "BOTH_EVENTS").length,
    receptionOnly: guests.filter((guest) => guest.invitationType === "RECEPTION_ONLY").length,
    nikahAttendees: sum("nikah"),
    nikahParties: parties("nikah"),
    receptionAttendees: sum("reception"),
    receptionParties: parties("reception"),
    pending: rows.filter((row) => row.response === "PENDING").length,
    declined: rows.filter((row) => row.response === "DECLINED").length,
  };
}
