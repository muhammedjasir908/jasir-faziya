"use client";

import { useEffect, useState } from "react";

import {
  BRIDE,
  BRIDE_FATHER,
  BRIDE_HOME,
  BRIDE_MOTHER,
  GROOM,
  GROOM_FATHER,
  GROOM_HOME,
  GROOM_MOTHER,
  MAPS_URL,
  RECEPTION_ADDRESS,
  RECEPTION_TIME,
  RECEPTION_VENUE,
  VERSE_ENGLISH,
  WEDDING_DATE_LABEL,
  WEDDING_PLACE,
} from "@/lib/constants";
import { weddingDateParts } from "@/lib/format";
import { CalendarButton } from "@/components/invitation/calendar-button";
import { Countdown } from "@/components/invitation/countdown";

export function Celebration({ countdownTo }: { countdownTo: string }) {
  const date = weddingDateParts();
  const [opened, setOpened] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const dated = `${date.weekday}, ${date.rest}`;
  const [active, setActive] = useState<SectionId>("opening");

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const nodes = SECTIONS.map((section) => document.getElementById(section.id)).filter((node) => node instanceof HTMLElement);
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = hit?.target.id;
        if (id && SECTIONS.some((section) => section.id === id)) setActive(id as SectionId);
      },
      { threshold: [0.35, 0.55, 0.75] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [opened]);

  function jumpTo(id: SectionId) {
    setActive(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function openInvitation() {
    if (opened || leaving) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOpened(true);
      return;
    }
    setLeaving(true);
    window.setTimeout(() => setOpened(true), 700);
  }

  return (
    <div className="velora velora-frame">
      <noscript>
        <style>{`.velora-cover{display:none !important}.velora-stage{display:block !important}`}</style>
      </noscript>

      {opened ? null : (
        <div className={leaving ? "velora-cover cover-leave" : "velora-cover"}>
          <div className="velora-cover-card">
            <Garden />
            <div className="relative z-10 flex flex-col items-center">
              <Rings />
              <p className="velora-kicker mt-8">The wedding of</p>
              <Names />
              <p className="velora-date mt-6">{dated}</p>
              <p className="velora-copy mt-4 max-w-xs">We would be honoured by your presence.</p>
              <button type="button" className="velora-open" onClick={openInvitation}>
                Open invitation
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={opened ? "velora-stage is-open" : "velora-stage"}>
        <Garden />

        <section id="opening" className="velora-scene">
          <Rings />
          <p className="velora-kicker mt-7">The wedding of</p>
          <Names />
          <p className="velora-date mt-6">{dated}</p>
          <p className="velora-copy mt-3">{WEDDING_PLACE}</p>
        </section>

        <section id="blessing" className="velora-scene">
          <p className="velora-kicker">A sign</p>
          <p className="velora-copy mt-6 max-w-sm">{VERSE_ENGLISH}</p>
          <p className="velora-cite mt-6">Qur&apos;an 30:21</p>
        </section>

        <section id="groom" className="velora-scene">
          <p className="velora-kicker">The groom</p>
          <h2 className="velora-person mt-4">{GROOM}</h2>
          <p className="velora-copy mt-4">
            Son of {GROOM_FATHER}
            <br />&amp; {GROOM_MOTHER}
          </p>
          <p className="velora-place mt-4">{GROOM_HOME}</p>
        </section>

        <section id="bride" className="velora-scene">
          <p className="velora-kicker">The bride</p>
          <h2 className="velora-person mt-4">{BRIDE}</h2>
          <p className="velora-copy mt-4">
            Daughter of {BRIDE_FATHER}
            <br />&amp; {BRIDE_MOTHER}
          </p>
          <p className="velora-place mt-4">{BRIDE_HOME}</p>
        </section>

        <section id="date" className="velora-scene">
          <Countdown target={countdownTo} title="Save the date" />
          <p className="velora-date mt-6">
            {dated}
            <br />
            {RECEPTION_TIME}
          </p>
        </section>

        <section id="venue" className="velora-scene">
          <div className="velora-glass">
            <p className="velora-kicker">The gathering</p>
            <h2 className="velora-person mt-4">{RECEPTION_VENUE}</h2>
            <p className="velora-date mt-4">{dated}</p>
            <p className="velora-date mt-1">{RECEPTION_TIME}</p>
            <p className="velora-copy mt-4">{RECEPTION_ADDRESS}</p>
            <a className="velora-open velora-open-link" href={MAPS_URL} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
              Open the location
            </a>
            <div className="velora-actions">
              <CalendarButton />
            </div>
          </div>
        </section>

        <section id="thanks" className="velora-scene">
          <p className="velora-kicker">Thank you</p>
          <h2 className="velora-script velora-script-end mt-4">
            <span>Jasir</span>
            <span className="amp">&</span>
            <span>Faziya</span>
          </h2>
          <p className="velora-copy mt-5 max-w-xs">
            Both families will be happy if you join them and keep them in your prayers.
          </p>
          <p className="velora-place mt-6">
            {GROOM_FATHER} &amp; {GROOM_MOTHER}
            <br />
            {BRIDE_FATHER} &amp; {BRIDE_MOTHER}
          </p>
          <p className="velora-date mt-5">
            {WEDDING_DATE_LABEL} · {WEDDING_PLACE}
          </p>
        </section>
      </div>
      {opened ? <SceneNav active={active} onJump={jumpTo} /> : null}
    </div>
  );
}

const SECTIONS = [
  { id: "opening", label: "Opening" },
  { id: "blessing", label: "Blessing" },
  { id: "groom", label: "Groom" },
  { id: "bride", label: "Bride" },
  { id: "date", label: "Date" },
  { id: "venue", label: "Venue" },
  { id: "thanks", label: "Thanks" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

function SceneNav({ active, onJump }: { active: SectionId; onJump: (id: SectionId) => void }) {
  return (
    <nav className="scene-nav no-print" aria-label="Invitation sections">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          aria-current={active === section.id ? "true" : undefined}
          onClick={() => onJump(section.id)}
        >
          <SectionIcon id={section.id} />
          <span>{section.label}</span>
        </button>
      ))}
    </nav>
  );
}

function SectionIcon({ id }: { id: SectionId }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": true as const };
  if (id === "opening") {
    return (
      <svg {...common}>
        <path d="M4 11.5 12 5l8 6.5V20H4z" />
      </svg>
    );
  }
  if (id === "blessing") {
    return (
      <svg {...common}>
        <path d="M7 16c-2 0-3-1.4-3-3.2C4 10 6.2 7 9 6M17 16c-2 0-3-1.4-3-3.2C14 10 16.2 7 19 6" />
      </svg>
    );
  }
  if (id === "groom" || id === "bride") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 19c.6-3 3.2-4.5 7-4.5s6.4 1.5 7 4.5" />
      </svg>
    );
  }
  if (id === "date") {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="15" rx="1.5" />
        <path d="M8 3.5v3M16 3.5v3M4 10h16" />
      </svg>
    );
  }
  if (id === "venue") {
    return (
      <svg {...common}>
        <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
        <circle cx="12" cy="11" r="1.6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 19s-6-3.6-6-8a3.4 3.4 0 0 1 6-2 3.4 3.4 0 0 1 6 2c0 4.4-6 8-6 8z" />
    </svg>
  );
}

function Names() {
  return (
    <h1 className="velora-script">
      <span>{GROOM}</span>
      <span className="amp">&</span>
      <span>{BRIDE}</span>
    </h1>
  );
}

function Garden() {
  return (
    <div className="garden" aria-hidden="true">
      <img className="garden-rose garden-rose-tr" src="/roses/red.jpg" alt="" />
      <img className="garden-rose garden-rose-bl" src="/roses/white.jpg" alt="" />
    </div>
  );
}

function Rings() {
  return (
    <svg className="velora-rings" viewBox="0 0 88 36" aria-hidden="true">
      <circle cx="30" cy="18" r="12" />
      <circle cx="52" cy="18" r="12" />
    </svg>
  );
}
