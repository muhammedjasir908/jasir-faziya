import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";

import { CopyLink } from "@/components/admin/copy-link";
import { DatabaseNotice, PageHeader, StatusBadge, categoryLabel } from "@/components/admin/ui";
import { listGuests } from "@/lib/guests";
import { requestBaseUrl } from "@/lib/urls";

export const metadata = { title: "Guests" };

function read(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="font-display text-3xl">Gathering guests</p>}>
      <GuestList searchParams={searchParams} />
    </Suspense>
  );
}

async function GuestList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const params = await searchParams;
  const filters = {
    q: read(params, "q"),
    category: read(params, "category"),
    status: read(params, "status"),
  };
  let guests: Awaited<ReturnType<typeof listGuests>> | null = null;
  try {
    guests = await listGuests(filters, await requestBaseUrl());
  } catch {
    guests = null;
  }
  if (!guests) {
    return (
      <>
        <PageHeader title="Guests" />
        <DatabaseNotice />
      </>
    );
  }
  return (
      <>
        <PageHeader
          title="Guests"
          lede="Each guest receives one private link. The invitation type decides whether the Nikah is included."
          action={
            <Link className="btn btn-sage" href="/admin/guests/new">
              Add a guest
            </Link>
          }
        />
        <form className="mb-6 grid gap-3 md:grid-cols-4" method="get">
          <input className="field" name="q" defaultValue={filters.q} placeholder="Search name or phone" aria-label="Search guests" />
          <select className="field" name="category" defaultValue={filters.category} aria-label="Invitation type">
            <option value="">All invitations</option>
            <option value="BOTH_EVENTS">Both events</option>
            <option value="RECEPTION_ONLY">Reception only</option>
          </select>
          <select className="field" name="status" defaultValue={filters.status} aria-label="Invitation status">
            <option value="">Any status</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <button className="btn btn-sage" type="submit">
            Filter
          </button>
        </form>
        {guests.length === 0 ? (
          <p className="note">No guests match this view yet.</p>
        ) : (
          <div className="space-y-4">
            {guests.map((guest) => (
              <article key={guest.id} className="frame frame-compact">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-3xl">{guest.name}</h2>
                    <p className="mt-1 text-sm text-muted">{guest.phone || "No phone number"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={guest.effectiveStatus} />
                    <span className="badge badge-gold">{categoryLabel(guest.invitationType)}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted">Up to {guest.maxAttendees} guests</p>
                {guest.rsvpSummary.length > 0 ? (
                  <ul className="mt-3 space-y-1 text-sm">
                    {guest.rsvpSummary.map((rsvp) => (
                      <li key={rsvp.eventSlug}>
                        {rsvp.eventTitle}: {rsvp.status === "ACCEPTED" ? `Accepted, ${rsvp.attendeeCount}` : "Unable to attend"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">No reply yet</p>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link className="btn btn-sage" href={`/admin/guests/${guest.id}`}>
                    Invitation
                  </Link>
                  {guest.inviteUrl ? <CopyLink value={guest.inviteUrl} /> : null}
                  {guest.whatsappUrl ? (
                    <a className="btn btn-gold" href={guest.whatsappUrl} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </>
    );
}
