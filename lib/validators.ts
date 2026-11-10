import { z } from "zod";

import { weddingTimeZone } from "@/lib/config";
import { dateOnly, emptyToNull, parseZonedDateTime } from "@/lib/format";
import type { InvitationAccess, InvitationState } from "@/lib/public-types";

const guestSchema = z.object({
  name: z.string().trim().min(2, "Please enter the guest name.").max(120),
  phone: z.string().trim().max(30).optional().nullable(),
  invitationType: z.enum(["BOTH_EVENTS", "RECEPTION_ONLY"]),
  maxAttendees: z.number().int().min(1).max(30),
  status: z.enum(["ACTIVE", "DISABLED", "EXPIRED"]),
  expiresAt: z.string().trim().max(40).optional().nullable(),
});

const eventSchema = z.object({
  title: z.string().trim().min(2, "Please name the event.").max(80),
  date: z.string().trim().max(10).optional().nullable(),
  timeLabel: z.string().trim().max(40).optional().nullable(),
  venue: z.string().trim().max(160).optional().nullable(),
  address: z.string().trim().max(300).optional().nullable(),
  mapUrl: z.string().trim().max(500).optional().nullable(),
  notes: z.string().trim().max(800).optional().nullable(),
});

const rsvpSchema = z.object({
  eventSlug: z.enum(["nikah", "reception"]),
  status: z.enum(["ACCEPTED", "DECLINED"]),
  attendeeCount: z.number().int().min(0).max(30),
  message: z.string().trim().max(1000).optional().nullable(),
});

export type GuestInput = {
  name: string;
  phone: string | null;
  invitationType: InvitationAccess;
  maxAttendees: number;
  status: InvitationState;
  expiresAt: Date | null;
};

export type EventInput = {
  title: string;
  date: Date | null;
  timeLabel: string | null;
  venue: string | null;
  address: string | null;
  mapUrl: string | null;
  notes: string | null;
};

export function parseGuestInput(body: unknown) {
  const parsed = guestSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Please check the guest details." };
  }
  const phone = emptyToNull(parsed.data.phone);
  if (phone && !/^[0-9+\-\s()]{7,30}$/.test(phone)) {
    return { ok: false as const, error: "Enter a phone number with at least 7 digits, including the country code." };
  }
  let expiresAt: Date | null = null;
  const expiry = emptyToNull(parsed.data.expiresAt);
  if (expiry) {
    expiresAt = parseZonedDateTime(expiry, weddingTimeZone());
    if (!expiresAt || Number.isNaN(expiresAt.getTime())) {
      return { ok: false as const, error: "The expiry date could not be read." };
    }
  }
  const data: GuestInput = {
    name: parsed.data.name,
    phone,
    invitationType: parsed.data.invitationType,
    maxAttendees: parsed.data.maxAttendees,
    status: parsed.data.status,
    expiresAt,
  };
  return { ok: true as const, data };
}

export function parseEventInput(body: unknown) {
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Please check the event details." };
  }
  const dateValue = emptyToNull(parsed.data.date);
  if (dateValue && !/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return { ok: false as const, error: "Enter the date as YYYY-MM-DD." };
  }
  const mapUrl = emptyToNull(parsed.data.mapUrl);
  if (mapUrl) {
    try {
      const url = new URL(mapUrl);
      if (url.protocol !== "https:") {
        return { ok: false as const, error: "The map link must start with https://." };
      }
    } catch {
      return { ok: false as const, error: "The map link must be a valid https address." };
    }
  }
  const data: EventInput = {
    title: parsed.data.title,
    date: dateValue ? dateOnly(dateValue) : null,
    timeLabel: emptyToNull(parsed.data.timeLabel),
    venue: emptyToNull(parsed.data.venue),
    address: emptyToNull(parsed.data.address),
    mapUrl,
    notes: emptyToNull(parsed.data.notes),
  };
  return { ok: true as const, data };
}

export function parseRsvpInput(body: unknown) {
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Please check the reply." };
  }
  return {
    ok: true as const,
    data: {
      eventSlug: parsed.data.eventSlug,
      status: parsed.data.status,
      attendeeCount: parsed.data.attendeeCount,
      message: emptyToNull(parsed.data.message),
    },
  };
}
