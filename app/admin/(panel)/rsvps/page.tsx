import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";

import { DatabaseNotice, PageHeader, ReplyBadge, categoryLabel } from "@/components/admin/ui";
import { filterQuery, listRsvpRows, parseRsvpFilters } from "@/lib/reporting";

export const metadata = { title: "Replies" };

export default function RsvpPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="font-display text-3xl">Gathering replies</p>}>
      <Replies searchParams={searchParams} />
    </Suspense>
  );
}

async function Replies({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const filters = parseRsvpFilters(await searchParams);
  let rows: Awaited<ReturnType<typeof listRsvpRows>> | null = null;
  try {
    rows = await listRsvpRows(filters);
  } catch {
    rows = null;
  }
  if (!rows) {
    return (
      <>
        <PageHeader title="Replies" />
        <DatabaseNotice />
      </>
    );
  }
  const attending = rows
      .filter((row) => row.response === "ACCEPTED")
      .reduce((total, row) => total + (row.attendeeCount ?? 0), 0);
    return (
      <>
        <PageHeader
          title="Replies"
          lede="Each celebration has its own answer. Attendee counts are the people who accepted."
          action={
            <a className="btn btn-sage" href={`/api/admin/export${filterQuery(filters)}`}>
              Download CSV for Excel
            </a>
          }
        />
        <form className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5" method="get">
          <input className="field" name="q" defaultValue={filters.q} placeholder="Search name or phone" aria-label="Search replies" />
          <select className="field" name="category" defaultValue={filters.category} aria-label="Invitation type">
            <option value="ALL">All invitations</option>
            <option value="BOTH_EVENTS">Both events</option>
            <option value="RECEPTION_ONLY">Reception only</option>
          </select>
          <select className="field" name="event" defaultValue={filters.event} aria-label="Celebration">
            <option value="ALL">All celebrations</option>
            <option value="nikah">Nikah</option>
            <option value="reception">Reception</option>
          </select>
          <select className="field" name="status" defaultValue={filters.status} aria-label="Reply">
            <option value="ALL">All replies</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DECLINED">Declined</option>
            <option value="PENDING">Pending</option>
          </select>
          <button className="btn btn-gold" type="submit">
            Filter
          </button>
        </form>
        <p className="mb-4 text-sm text-muted">
          {rows.length} {rows.length === 1 ? "row" : "rows"} · {attending} confirmed attendees
        </p>
        {rows.length === 0 ? (
          <p className="note">No replies match these filters.</p>
        ) : (
          <div className="divide-y divide-[rgba(141,106,50,0.25)] border-y border-[rgba(141,106,50,0.25)]">
            {rows.map((row) => (
              <article key={`${row.guestId}-${row.eventSlug}`} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-3xl">
                      <Link href={`/admin/guests/${row.guestId}`}>{row.guestName}</Link>
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {row.eventTitle} · {categoryLabel(row.invitationType)}
                      {row.phone ? ` · ${row.phone}` : ""}
                    </p>
                  </div>
                  <ReplyBadge response={row.response} />
                </div>
                <p className="mt-2 text-sm">
                  Attendees: {row.attendeeCount ?? "—"} · Limit {row.maxAttendees}
                  {row.updatedAt ? ` · Updated ${row.updatedAt}` : ""}
                </p>
                {row.message ? <p className="mt-2 max-w-2xl text-sm leading-6">{row.message}</p> : null}
              </article>
            ))}
          </div>
        )}
      </>
    );
}
