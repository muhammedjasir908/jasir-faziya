import { earliestMoment, formatLongDate, toDateInput } from "@/lib/format";
import { mapsLink } from "@/lib/maps";
import type { InvitationAccess, InvitationState, PublicInvitation } from "@/lib/public-types";

export type PolicyEvent = {
  id: string;
  slug: string;
  title: string;
  date: Date | null;
  timeLabel: string | null;
  venue: string | null;
  address: string | null;
  mapUrl: string | null;
  notes: string | null;
  sortOrder: number;
};

export function effectiveStatus(
  status: InvitationState,
  expiresAt: Date | null,
  now = new Date(),
): InvitationState {
  if (status === "DISABLED") return "DISABLED";
  if (status === "EXPIRED" || (expiresAt && expiresAt.getTime() <= now.getTime())) return "EXPIRED";
  return "ACTIVE";
}

export function selectVisibleEvents<T extends { slug: string; sortOrder: number }>(
  invitationType: InvitationAccess,
  events: T[],
) {
  const visible =
    invitationType === "RECEPTION_ONLY"
      ? events.filter((event) => event.slug.toLowerCase() !== "nikah")
      : events.filter((event) => {
          const slug = event.slug.toLowerCase();
          return slug === "nikah" || slug === "reception";
        });
  if (invitationType === "RECEPTION_ONLY" && visible.some((event) => event.slug.toLowerCase() === "nikah")) {
    throw new Error("Invitation filter failed");
  }
  return [...visible].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function normalizeRsvp(input: {
  status: "ACCEPTED" | "DECLINED";
  attendeeCount: number;
  maxAttendees: number;
}) {
  if (input.status === "DECLINED") {
    return { ok: true as const, status: "DECLINED" as const, attendeeCount: 0 };
  }
  if (
    !Number.isInteger(input.attendeeCount) ||
    input.attendeeCount < 1 ||
    input.attendeeCount > input.maxAttendees
  ) {
    return {
      ok: false as const,
      error: `Please choose between 1 and ${input.maxAttendees} guests.`,
    };
  }
  return { ok: true as const, status: "ACCEPTED" as const, attendeeCount: input.attendeeCount };
}

export function toPublicInvitation(
  guest: {
    name: string;
    invitationType: InvitationAccess;
    maxAttendees: number;
    eventAccess: { event: PolicyEvent }[];
    rsvps: {
      eventId: string;
      status: "ACCEPTED" | "DECLINED";
      attendeeCount: number;
      message: string | null;
    }[];
  },
  timeZone: string,
): PublicInvitation {
  const visible = selectVisibleEvents(
    guest.invitationType,
    guest.eventAccess.map((access) => access.event),
  );
  const events = visible.map((event) => {
    const date = toDateInput(event.date);
    const rsvp = guest.rsvps.find((item) => item.eventId === event.id);
    return {
      slug: event.slug,
      title: event.title,
      date,
      dateLabel: date ? formatLongDate(date) : null,
      timeLabel: event.timeLabel,
      venue: event.venue,
      address: event.address,
      mapUrl: mapsLink(event.venue, event.address, event.mapUrl),
      notes: event.notes,
      rsvp: rsvp
        ? {
            status: rsvp.status,
            attendeeCount: rsvp.attendeeCount,
            message: rsvp.message,
          }
        : null,
    };
  });
  return {
    guestName: guest.name,
    maxAttendees: guest.maxAttendees,
    events,
    countdownTo: earliestMoment(events, timeZone),
  };
}
