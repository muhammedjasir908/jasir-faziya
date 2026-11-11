"use client";

import { useEffect, useRef, useState } from "react";

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
  NIKAH_ADDRESS,
  NIKAH_DATE_ISO,
  NIKAH_DATE_LABEL,
  NIKAH_MAPS_URL,
  NIKAH_PLACE,
  NIKAH_TIME,
  NIKAH_VENUE,
  RECEPTION_ADDRESS,
  RECEPTION_TIME,
  RECEPTION_VENUE,
  VERSE_ENGLISH,
  WEDDING_DATE_ISO,
  WEDDING_DATE_LABEL,
  WEDDING_PLACE,
  type InvitationSide,
} from "@/lib/constants";
import { weddingDateParts } from "@/lib/format";
import { CalendarButton } from "@/components/invitation/calendar-button";
import { Countdown } from "@/components/invitation/countdown";
import { InvitationMusic, type MusicControl } from "@/components/invitation/invitation-music";
import { ShareInvitation } from "@/components/invitation/share-invitation";

export function Celebration({ countdownTo, side = "groom" }: { countdownTo: string; side?: InvitationSide }) {
  const brideFirst = side === "bride";
  const first = brideFirst ? BRIDE : GROOM;
  const second = brideFirst ? GROOM : BRIDE;
  const date = weddingDateParts(brideFirst ? NIKAH_DATE_ISO : WEDDING_DATE_ISO);
  const musicRef = useRef<MusicControl>(null);
  const [opened, setOpened] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const dated = `${date.weekday}, ${date.rest}`;
  const [active, setActive] = useState<SectionId>("opening");
  const sections = sectionsFor(side);
  const timeLabel = brideFirst ? NIKAH_TIME : RECEPTION_TIME;
  const venue = brideFirst ? NIKAH_VENUE : RECEPTION_VENUE;
  const address = brideFirst ? NIKAH_ADDRESS : RECEPTION_ADDRESS;
  const place = brideFirst ? NIKAH_PLACE : WEDDING_PLACE;
  const mapsUrl = brideFirst ? NIKAH_MAPS_URL : MAPS_URL;
  const dateLabel = brideFirst ? NIKAH_DATE_LABEL : WEDDING_DATE_LABEL;
  const kicker = brideFirst ? "The Nikah of" : "The wedding of";
  const ceremony = brideFirst ? "The Nikah" : "The reception";
  const leadParents = brideFirst ? `${BRIDE_FATHER} & ${BRIDE_MOTHER}` : `${GROOM_FATHER} & ${GROOM_MOTHER}`;
  const followParents = brideFirst ? `${GROOM_FATHER} & ${GROOM_MOTHER}` : `${BRIDE_FATHER} & ${BRIDE_MOTHER}`;

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const nodes = sectionsFor(side).map((section) => document.getElementById(section.id)).filter((node) => node instanceof HTMLElement);
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = hit?.target.id;
        if (id && sectionsFor(side).some((section) => section.id === id)) setActive(id as SectionId);
      },
      { threshold: [0.35, 0.55, 0.75] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [opened, side]);

  function jumpTo(id: SectionId) {
    setActive(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function openInvitation() {
    if (opened || leaving) return;
    musicRef.current?.play();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOpened(true);
      return;
    }
    setLeaving(true);
    window.setTimeout(() => setOpened(true), 700);
  }

  return (
    <div className={brideFirst ? "velora velora-frame velora-bride" : "velora velora-frame"}>
      <InvitationMusic controlRef={musicRef} />
      <noscript>
        <style>{`.velora-cover{display:none !important}.velora-stage{display:block !important}`}</style>
      </noscript>

      {opened ? null : (
        <div className={leaving ? "velora-cover cover-leave" : "velora-cover"}>
          <div className="velora-cover-card">
            <Garden />
            <div className="relative z-10 flex flex-col items-center">
              <Rings />
              <p className="velora-kicker mt-8">{kicker}</p>
              <Names first={first} second={second} />
              <p className="velora-date mt-6">{dated}</p>
              <p className="velora-copy mt-4 max-w-xs">We would be honoured by your presence.</p>
              <button type="button" className="velora-open" onClick={openInvitation}>
                Open invitation
              </button>
              <ShareInvitation side={side} />
            </div>
          </div>
        </div>
      )}

      <div className={opened ? "velora-stage is-open" : "velora-stage"}>
        <Garden />

        <section id="opening" className="velora-scene">
          <Rings />
          <p className="velora-kicker mt-7">{kicker}</p>
          <Names first={first} second={second} />
          <p className="velora-date mt-6">{dated}</p>
          <p className="velora-copy mt-3">{place}</p>
        </section>

        <section id="blessing" className="velora-scene">
          <p className="velora-kicker">A sign</p>
          <p className="velora-copy mt-6 max-w-sm">{VERSE_ENGLISH}</p>
          <p className="velora-cite mt-6">Qur&apos;an 30:21</p>
        </section>

        {brideFirst ? <BrideSection /> : <GroomSection />}
        {brideFirst ? <GroomSection /> : <BrideSection />}

        <section id="date" className="velora-scene">
          <Countdown target={countdownTo} title="Save the date" />
          <p className="velora-date mt-6">
            {dated}
            <br />
            {timeLabel}
          </p>
        </section>

        <section id="venue" className="velora-scene">
          <div className="velora-glass">
            <p className="velora-kicker">{ceremony}</p>
            <h2 className="velora-person mt-4">{venue}</h2>
            <p className="velora-date mt-4">{dated}</p>
            <p className="velora-date mt-1">{timeLabel}</p>
            <p className="velora-copy mt-4">{address}</p>
            <p className="velora-copy mt-3">
              {brideFirst
                ? "Please join the families for the Nikah at eleven in the morning."
                : "Please join the families from one o’clock until three."}
            </p>
            <a className="velora-open velora-open-link" href={mapsUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
              Open the location
            </a>
            <div className="velora-actions">
              <CalendarButton
                summary={brideFirst ? "Nikah: Faziya Sherin & Muhammed Jasir" : "Wedding Reception: Muhammed Jasir & Faziya Sherin"}
                description={
                  brideFirst
                    ? "With the blessings of Allah, the Nikah of Faziya Sherin and Muhammed Jasir at 11:00 AM at AMANATH Convention Centre."
                    : "With the blessings of Allah, the reception of Muhammed Jasir and Faziya Sherin from 1:00 PM until 3:00 PM at Shadhi Mahal Auditorium."
                }
                location={brideFirst ? `${NIKAH_VENUE}, ${NIKAH_ADDRESS}` : `${RECEPTION_VENUE}, ${RECEPTION_ADDRESS}`}
                startUtc={brideFirst ? "20261206T053000Z" : "20261207T073000Z"}
                endUtc={brideFirst ? "20261206T063000Z" : "20261207T093000Z"}
                uid={brideFirst ? "faziya-jasir-nikah-20261206@wedding" : "jasir-faziya-reception-20261207@wedding"}
                filename={brideFirst ? "faziya-jasir-nikah.ics" : "jasir-faziya-reception.ics"}
              />
            </div>
          </div>
        </section>

        <section id="thanks" className="velora-scene">
          <p className="velora-kicker">Thank you</p>
          <h2 className="velora-script velora-script-end mt-4">
            <span>{brideFirst ? "Faziya" : "Jasir"}</span>
            <span className="amp">&</span>
            <span>{brideFirst ? "Jasir" : "Faziya"}</span>
          </h2>
          <p className="velora-copy mt-5 max-w-xs">
            Both families will be happy if you join them and keep them in your prayers.
          </p>
          <p className="velora-place mt-6">
            {leadParents}
            <br />
            {followParents}
          </p>
          <p className="velora-date mt-5">
            {dateLabel} · {place}
          </p>
          <ShareInvitation side={side} />
        </section>
      </div>
      {opened ? <SceneNav sections={sections} active={active} onJump={jumpTo} /> : null}
    </div>
  );
}

const SECTION_IDS = ["opening", "blessing", "groom", "bride", "date", "venue", "thanks"] as const;
type SectionId = (typeof SECTION_IDS)[number];

function sectionsFor(side: InvitationSide) {
  const couple: { id: SectionId; label: string }[] =
    side === "bride"
      ? [
          { id: "bride", label: "Bride" },
          { id: "groom", label: "Groom" },
        ]
      : [
          { id: "groom", label: "Groom" },
          { id: "bride", label: "Bride" },
        ];
  return [
    { id: "opening" as const, label: "Opening" },
    { id: "blessing" as const, label: "Blessing" },
    ...couple,
    { id: "date" as const, label: "Date" },
    { id: "venue" as const, label: "Venue" },
    { id: "thanks" as const, label: "Thanks" },
  ];
}

function SceneNav({
  sections,
  active,
  onJump,
}: {
  sections: { id: SectionId; label: string }[];
  active: SectionId;
  onJump: (id: SectionId) => void;
}) {
  return (
    <nav className="scene-nav no-print" aria-label="Invitation sections">
      {sections.map((section) => (
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

function Names({ first, second }: { first: string; second: string }) {
  return (
    <h1 className="velora-script">
      <span>{first}</span>
      <span className="amp">&</span>
      <span>{second}</span>
    </h1>
  );
}

function GroomSection() {
  return (
    <section id="groom" className="velora-scene">
      <p className="velora-kicker">The groom</p>
      <h2 className="velora-person mt-4">{GROOM}</h2>
      <p className="velora-copy mt-4">
        Son of {GROOM_FATHER}
        <br />&amp; {GROOM_MOTHER}
      </p>
      <p className="velora-place mt-4">{GROOM_HOME}</p>
    </section>
  );
}

function BrideSection() {
  return (
    <section id="bride" className="velora-scene">
      <p className="velora-kicker">The bride</p>
      <h2 className="velora-person mt-4">{BRIDE}</h2>
      <p className="velora-copy mt-4">
        Daughter of {BRIDE_FATHER}
        <br />&amp; {BRIDE_MOTHER}
      </p>
      <p className="velora-place mt-4">{BRIDE_HOME}</p>
    </section>
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
