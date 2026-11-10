"use client";

import { useEffect, useState } from "react";

const units = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Sec" },
] as const;

export function Countdown({ target, title = "Until the celebration" }: { target: string | null; title?: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const start = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, []);

  if (!target) return null;
  const remaining = now == null ? null : new Date(target).getTime() - now;
  const ended = remaining != null && remaining <= 0;
  const parts = ended || remaining == null
    ? null
    : {
        days: Math.floor(remaining / 86_400_000),
        hours: Math.floor(remaining / 3_600_000) % 24,
        minutes: Math.floor(remaining / 60_000) % 60,
        seconds: Math.floor(remaining / 1000) % 60,
      };

  return (
    <section className="text-center" aria-labelledby="countdown-heading">
      <h2 id="countdown-heading" className="section-kicker">
        {ended ? "The celebration is here" : title}
      </h2>
      {ended ? null : (
        <div className="mx-auto mt-4 grid max-w-md grid-cols-4 gap-2">
          {units.map((unit) => (
            <div key={unit.key} className="countdown-tile">
              <strong>{parts ? String(parts[unit.key]).padStart(2, "0") : "–"}</strong>
              <span>{unit.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
