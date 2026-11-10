"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { adminFetch } from "@/components/admin/fetch";

type EventValues = {
  id: string;
  slug: string;
  title: string;
  date: string;
  timeLabel: string;
  venue: string;
  address: string;
  mapUrl: string;
  notes: string;
};

export function EventForm({ event }: { event: EventValues }) {
  const [values, setValues] = useState(event);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function update(key: keyof EventValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(formEvent: React.FormEvent) {
    formEvent.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    try {
      await adminFetch(`/api/admin/events/${event.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: values.title,
          date: values.date || null,
          timeLabel: values.timeLabel,
          venue: values.venue,
          address: values.address,
          mapUrl: values.mapUrl,
          notes: values.notes,
        }),
      });
      setMessage("Celebration details saved.");
    } catch (caught) {
      if (caught instanceof Error && caught.message === "Please sign in again.") {
        router.push("/admin/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "The celebration could not be saved.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="frame space-y-4">
      <div className="relative z-10 space-y-4">
        <p className="text-sm leading-6 text-muted">
          {event.slug === "nikah"
            ? "Shown only to guests invited to both celebrations. Leave unknown details blank."
            : "Shown to every invited guest."}
        </p>
        <div>
          <label className="label" htmlFor={`${event.id}-title`}>
            Title
          </label>
          <input id={`${event.id}-title`} className="field" value={values.title} onChange={(input) => update("title", input.target.value)} required />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor={`${event.id}-date`}>
              Date
            </label>
            <input id={`${event.id}-date`} className="field" type="date" value={values.date} onChange={(input) => update("date", input.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor={`${event.id}-time`}>
              Time
            </label>
            <input id={`${event.id}-time`} className="field" value={values.timeLabel} onChange={(input) => update("timeLabel", input.target.value)} placeholder="11:00 AM" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor={`${event.id}-venue`}>
            Venue
          </label>
          <input id={`${event.id}-venue`} className="field" value={values.venue} onChange={(input) => update("venue", input.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor={`${event.id}-address`}>
            Address
          </label>
          <input id={`${event.id}-address`} className="field" value={values.address} onChange={(input) => update("address", input.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor={`${event.id}-map`}>
            Google Maps link
          </label>
          <input id={`${event.id}-map`} className="field" type="url" value={values.mapUrl} onChange={(input) => update("mapUrl", input.target.value)} placeholder="https://" />
        </div>
        <div>
          <label className="label" htmlFor={`${event.id}-notes`}>
            Note for guests
          </label>
          <textarea id={`${event.id}-notes`} className="field" value={values.notes} onChange={(input) => update("notes", input.target.value)} />
        </div>
        {error ? <p className="note note-error" role="alert">{error}</p> : null}
        {message ? <p className="note" role="status">{message}</p> : null}
        <button className="btn btn-sage" type="submit" disabled={pending}>
          {pending ? "Saving" : "Save celebration"}
        </button>
      </div>
    </form>
  );
}
