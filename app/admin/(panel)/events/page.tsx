import { Suspense } from "react";
import { connection } from "next/server";

import { EventForm } from "@/components/admin/event-form";
import { DatabaseNotice, PageHeader } from "@/components/admin/ui";
import { listEvents } from "@/lib/events";

export const metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <Suspense fallback={<p className="font-display text-3xl">Opening the celebrations</p>}>
      <Events />
    </Suspense>
  );
}

async function Events() {
  await connection();
  let events: Awaited<ReturnType<typeof listEvents>> | null = null;
  try {
    events = await listEvents();
  } catch {
    events = null;
  }
  if (!events) {
    return (
      <>
        <PageHeader title="Celebrations" />
        <DatabaseNotice />
      </>
    );
  }
  return (
      <>
        <PageHeader
          title="Celebrations"
          lede="Set the Nikah here when the date, time, and venue are known. Do not guess them. The reception begins with the details already given."
        />
        {events.length === 0 ? (
          <p className="note">The celebrations are not in the database yet. Run the seed command.</p>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {events.map((event) => (
              <section key={event.id}>
                <h2 className="mb-3 font-display text-4xl">{event.title}</h2>
                <EventForm
                  event={{
                    id: event.id,
                    slug: event.slug,
                    title: event.title,
                    date: event.date ?? "",
                    timeLabel: event.timeLabel ?? "",
                    venue: event.venue ?? "",
                    address: event.address ?? "",
                    mapUrl: event.mapUrl ?? "",
                    notes: event.notes ?? "",
                  }}
                />
              </section>
            ))}
          </div>
        )}
      </>
    );
}
