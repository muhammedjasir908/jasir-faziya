import "server-only";

import { getPrisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { toDateInput } from "@/lib/format";
import type { EventInput } from "@/lib/validators";

export type AdminEvent = {
  id: string;
  slug: string;
  title: string;
  date: string | null;
  timeLabel: string | null;
  venue: string | null;
  address: string | null;
  mapUrl: string | null;
  notes: string | null;
  sortOrder: number;
};

function presentEvent(event: {
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
}): AdminEvent {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    date: toDateInput(event.date),
    timeLabel: event.timeLabel,
    venue: event.venue,
    address: event.address,
    mapUrl: event.mapUrl,
    notes: event.notes,
    sortOrder: event.sortOrder,
  };
}

export async function listEvents() {
  const events = await getPrisma().event.findMany({ orderBy: { sortOrder: "asc" } });
  return events.map(presentEvent);
}

export async function updateEvent(id: string, input: EventInput) {
  const existing = await getPrisma().event.findUnique({ where: { id } });
  if (!existing || (existing.slug !== "nikah" && existing.slug !== "reception")) {
    throw new AppError("That celebration could not be found.", 404);
  }
  const event = await getPrisma().event.update({
    where: { id },
    data: {
      title: input.title,
      date: input.date,
      timeLabel: input.timeLabel,
      venue: input.venue,
      address: input.address,
      mapUrl: input.mapUrl,
      notes: input.notes,
    },
  });
  return presentEvent(event);
}
