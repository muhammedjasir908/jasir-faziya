"use client";

import { useState } from "react";

import type { PublicRsvp } from "@/lib/public-types";

export function RsvpForm({
  token,
  slug,
  title,
  guestName,
  maxAttendees,
  existing,
  variant,
}: {
  token: string;
  slug: string;
  title: string;
  guestName: string;
  maxAttendees: number;
  existing: PublicRsvp | null;
  variant: "compact" | "full";
}) {
  const [status, setStatus] = useState<"ACCEPTED" | "DECLINED" | null>(existing?.status ?? null);
  const [count, setCount] = useState(existing?.status === "ACCEPTED" ? existing.attendeeCount : 1);
  const [message, setMessage] = useState(existing?.message ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(Boolean(existing));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!status) {
      setError("Please choose a reply.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/invite/${encodeURIComponent(token)}/rsvp`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          eventSlug: slug,
          status,
          attendeeCount: status === "ACCEPTED" ? count : 0,
          message,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        rsvp?: PublicRsvp;
      };
      if (!response.ok || !data.rsvp) {
        setError(data.error || "Your reply could not be saved.");
        setSaved(false);
        return;
      }
      setStatus(data.rsvp.status);
      setCount(data.rsvp.status === "ACCEPTED" ? data.rsvp.attendeeCount : 1);
      setMessage(data.rsvp.message ?? "");
      setSaved(true);
    } catch {
      setError("Your reply could not be saved. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const choices = (
    <fieldset>
      <legend className="sr-only">Attendance for {title}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={status === "ACCEPTED" ? "choice choice-on" : "choice"}>
          <input
            type="radio"
            name={`reply-${slug}`}
            value="ACCEPTED"
            checked={status === "ACCEPTED"}
            onChange={() => setStatus("ACCEPTED")}
          />
          Accept with pleasure
        </label>
        <label className={status === "DECLINED" ? "choice choice-on" : "choice"}>
          <input
            type="radio"
            name={`reply-${slug}`}
            value="DECLINED"
            checked={status === "DECLINED"}
            onChange={() => setStatus("DECLINED")}
          />
          Regret
        </label>
      </div>
    </fieldset>
  );

  const guests = status === "ACCEPTED" ? (
    <div className="mt-4">
      <label className="label" htmlFor={`count-${slug}`}>
        Number of guests
      </label>
      <div className="flex items-center gap-3">
        <span className="field flex items-center text-sm">Attending</span>
        <button
          type="button"
          className="btn btn-gold min-w-12 px-0"
          onClick={() => setCount((value) => Math.max(1, value - 1))}
          aria-label="Fewer guests"
        >
          –
        </button>
        <input
          id={`count-${slug}`}
          className="field max-w-20 text-center"
          type="number"
          inputMode="numeric"
          min={1}
          max={maxAttendees}
          value={count}
          onChange={(input) => {
            const next = Number(input.target.value);
            if (Number.isInteger(next)) setCount(Math.min(maxAttendees, Math.max(1, next)));
          }}
        />
        <button
          type="button"
          className="btn btn-gold min-w-12 px-0"
          onClick={() => setCount((value) => Math.min(maxAttendees, value + 1))}
          aria-label="More guests"
        >
          +
        </button>
      </div>
    </div>
  ) : null;

  const note = (
    <div className="mt-4">
      <label className="label" htmlFor={`message-${slug}`}>
        Private well wishes
      </label>
      <textarea
        id={`message-${slug}`}
        className="field"
        maxLength={1000}
        placeholder="Send heartfelt dua for Jasir & Faziya..."
        value={message}
        onChange={(input) => setMessage(input.target.value)}
      />
    </div>
  );

  const feedback = (
    <>
      {error ? (
        <p className="note note-error mt-4" role="alert">
          {error}
        </p>
      ) : null}
      {saved && !error ? (
        <p className="note mt-4" role="status">
          Your reply is saved. You may change it from this same link.
        </p>
      ) : null}
    </>
  );

  if (variant === "compact") {
    return (
      <form onSubmit={onSubmit} className="mt-5 text-left">
        {choices}
        {status ? (
          <>
            {guests}
            {note}
            {feedback}
            <button className="btn btn-sage mt-4 w-full" type="submit" disabled={pending}>
              {pending ? "Saving" : saved ? "Update reply" : "Send reply"}
            </button>
          </>
        ) : null}
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="reply-card mt-4 text-left" aria-labelledby={`reply-${slug}`}>
      <h3 id={`reply-${slug}`} className="text-center font-display text-3xl text-[#3c1018]">
        Attendance confirmation
      </h3>
      <p className="mt-2 text-center text-sm leading-6 text-[#6a5348]">
        Kindly share your response for {title}, together with your prayers and presence.
      </p>
      <div className="mt-5">
        <label className="label" htmlFor={`name-${slug}`}>
          Guest name
        </label>
        <input id={`name-${slug}`} className="field" value={guestName} readOnly />
      </div>
      <div className="mt-5">{choices}</div>
      {guests}
      {note}
      {feedback}
      <button className="btn btn-sage mt-5 w-full" type="submit" disabled={pending}>
        {pending ? "Saving" : "Send reply & dua"}
      </button>
    </form>
  );
}
