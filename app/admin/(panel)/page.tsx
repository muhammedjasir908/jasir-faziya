import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";

import { DatabaseNotice, PageHeader } from "@/components/admin/ui";
import { dashboardStats } from "@/lib/reporting";

export const metadata = { title: "Overview" };

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="font-display text-3xl">Gathering the guest book</p>}>
      <Overview />
    </Suspense>
  );
}

async function Overview() {
  await connection();
  let stats: Awaited<ReturnType<typeof dashboardStats>> | null = null;
  try {
    stats = await dashboardStats();
  } catch {
    stats = null;
  }
  if (!stats) {
    return (
      <>
        <PageHeader title="Overview" />
        <DatabaseNotice />
      </>
    );
  }
  const cards = [
      { href: "/admin/guests", label: "Total invited guests", value: stats.totalGuests, hint: "Personal cards prepared" },
      { href: "/admin/guests?category=BOTH_EVENTS", label: "Both events", value: stats.bothEvents, hint: "Nikah and reception" },
      { href: "/admin/guests?category=RECEPTION_ONLY", label: "Reception only", value: stats.receptionOnly, hint: "Nikah is not shared" },
      { href: "/admin/rsvps?event=nikah&status=ACCEPTED", label: "Nikah confirmed", value: stats.nikahAttendees, hint: `${stats.nikahParties} accepted replies` },
      { href: "/admin/rsvps?event=reception&status=ACCEPTED", label: "Reception confirmed", value: stats.receptionAttendees, hint: `${stats.receptionParties} accepted replies` },
      { href: "/admin/rsvps?status=PENDING", label: "Pending replies", value: stats.pending, hint: "Celebrations still awaiting an answer" },
      { href: "/admin/rsvps?status=DECLINED", label: "Declined replies", value: stats.declined, hint: "Marked unable to attend" },
    ];
    return (
      <>
        <PageHeader
          title="Overview"
          lede="Confirmed numbers count people attending, not the number of invitations."
          action={
            <Link className="btn btn-sage" href="/admin/guests/new">
              Add a guest
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.label} href={card.href} className="stat-link">
              <article className="frame frame-compact h-full">
                <p className="section-kicker">{card.label}</p>
                <p className="mt-3 font-display text-5xl text-ink">{card.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{card.hint}</p>
              </article>
            </Link>
          ))}
        </div>
      </>
    );
}
