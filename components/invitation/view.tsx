import {
  BISMILLAH,
  BRIDE,
  GROOM,
  VERSE_ARABIC,
  VERSE_ENGLISH,
  WEDDING_PLACE,
} from "@/lib/constants";
import { weddingDateParts } from "@/lib/format";
import type { PublicEvent, PublicInvitation } from "@/lib/public-types";
import { Countdown } from "@/components/invitation/countdown";
import { SiteFooter } from "@/components/invitation/footer";
import { Opening, ScrollCue } from "@/components/invitation/opening";
import { RsvpForm } from "@/components/invitation/rsvp-form";
import { CardSideBouquets } from "@/components/invitation/roses-bouquet";

function EventCard({
  event,
  token,
  guestName,
  maxAttendees,
}: {
  event: PublicEvent;
  token: string;
  guestName: string;
  maxAttendees: number;
}) {
  const detailed = Boolean(event.dateLabel || event.timeLabel || event.venue || event.address);
  return (
    <div className="relative">
      <article className="event-card card-crest text-center relative">
        <CardSideBouquets variant="both" size="sm" />
        <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[#8a6233]">Your invitation includes</p>
        <h3 className="mt-3 font-display text-3xl uppercase tracking-[0.14em] text-[#3c1018]">{event.title}</h3>
        {detailed ? (
          <div className="mt-4 space-y-1 text-[#3c1018]">
            {event.dateLabel ? <p className="text-sm uppercase tracking-[0.12em]">{event.dateLabel}</p> : null}
            {event.timeLabel ? <p className="font-display text-2xl">{event.timeLabel}</p> : null}
            {event.venue ? <p className="mt-3 text-sm font-semibold uppercase tracking-[0.08em]">{event.venue}</p> : null}
            {event.address ? <p className="text-sm leading-6 text-[#6a5348]">{event.address}</p> : null}
          </div>
        ) : (
          <p className="mt-4 font-display text-xl italic leading-7 text-[#6a5348]">
            Details for this gathering will be shared soon.
          </p>
        )}
        {event.notes ? <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#6a5348]">{event.notes}</p> : null}
        {event.mapUrl ? (
          <p className="mt-5">
            <a
              className="btn btn-sage no-print w-full"
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
            >
              Open directions
            </a>
          </p>
        ) : null}
        {detailed ? null : (
          <RsvpForm
            token={token}
            slug={event.slug}
            title={event.title}
            guestName={guestName}
            maxAttendees={maxAttendees}
            existing={event.rsvp}
            variant="compact"
          />
        )}
      </article>
      {detailed ? (
        <RsvpForm
          token={token}
          slug={event.slug}
          title={event.title}
          guestName={guestName}
          maxAttendees={maxAttendees}
          existing={event.rsvp}
          variant="full"
        />
      ) : null}
    </div>
  );
}

export function InvitationView({ invitation, token }: { invitation: PublicInvitation; token: string }) {
  const date = weddingDateParts();
  const several = invitation.events.length > 1;
  return (
    <Opening guestName={invitation.guestName}>
      <article className="mx-auto max-w-md pb-6 pt-8">
        <main id="letter">
          <section className="letter card-crest reveal text-center relative">
            <CardSideBouquets variant="both" size="md" />
            <p lang="ar" dir="rtl" className="font-arabic text-xl text-[#8a6233]">
              {BISMILLAH}
            </p>
            <p className="mt-3 text-[0.62rem] uppercase tracking-[0.28em] text-[#8a6233]">
              With the blessings of Allah
            </p>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#5c463c]">
              Together with their families, joyfully requesting the honour of your presence to celebrate the{" "}
              {several ? "nikah" : "marriage"} of
            </p>
            <h1 className="mt-5 font-display text-[2.6rem] leading-none text-[#3c1018]">{GROOM}</h1>
            <p className="my-1 font-script text-4xl text-[#a68445]">&</p>
            <p className="font-display text-[2.6rem] italic leading-none text-[#3c1018]">{BRIDE}</p>
            <div className="letter-rule mx-auto mt-6 max-w-xs" />
            <p className="mt-4 text-[0.62rem] uppercase tracking-[0.24em] text-[#8a6233]">Honoured guest</p>
            <p className="mt-1 font-display text-3xl text-[#3c1018]">{invitation.guestName}</p>
            <p className="mt-2 text-sm italic text-[#6a5348]">Your presence and blessings are cordially requested.</p>
            <div className="letter-rule mx-auto mt-5 max-w-xs" />
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#3c1018]">
              {date.weekday}, {date.rest}
            </p>
            <p className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-[#8a6233]">{WEDDING_PLACE}</p>
            <div className="letter-rule mx-auto mt-4 max-w-xs" />
            <p lang="ar" dir="rtl" className="mt-5 font-arabic text-lg leading-9 text-[#3c1018]">
              {VERSE_ARABIC}
            </p>
            <p className="mt-3 text-sm italic leading-6 text-[#6a5348]">{VERSE_ENGLISH}</p>
          </section>

          <div className="mt-8 text-center">
            <ScrollCue target="celebrations" label="Scroll to explore" />
          </div>

          <div id="celebrations" className="scroll-mt-8 pt-10">
            <Countdown target={invitation.countdownTo} />
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {invitation.events.length === 0 ? (
              <p className="text-center text-sm text-[#f6e7c4]">The celebration details are being prepared.</p>
            ) : (
              invitation.events.map((event) => (
                <EventCard
                  key={event.slug}
                  event={event}
                  token={token}
                  guestName={invitation.guestName}
                  maxAttendees={invitation.maxAttendees}
                />
              ))
            )}
          </div>
        </main>
        <SiteFooter />
      </article>
    </Opening>
  );
}
