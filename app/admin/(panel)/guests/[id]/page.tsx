import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";

import { GuestForm } from "@/components/admin/guest-form";
import { InvitationTools } from "@/components/admin/invitation-tools";
import { DatabaseNotice, PageHeader, StatusBadge, categoryLabel } from "@/components/admin/ui";
import { getAdminGuest } from "@/lib/guests";
import { requestBaseUrl } from "@/lib/urls";

export const metadata = { title: "Invitation" };

export default function GuestPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  return (
    <Suspense fallback={<p className="font-display text-3xl">Opening the invitation</p>}>
      <GuestDetail params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function GuestDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  await connection();
  const { id } = await params;
  const query = await searchParams;
  let missing = false;
  let guest: Awaited<ReturnType<typeof getAdminGuest>> = null;
  try {
    guest = await getAdminGuest(id, await requestBaseUrl());
    missing = !guest;
  } catch {
    guest = null;
  }
  if (!guest && !missing) {
    return (
      <>
        <PageHeader title="Invitation" />
        <DatabaseNotice />
      </>
    );
  }
  if (!guest) return <p className="note">That guest could not be found.</p>;
  return (
      <>
        <PageHeader
          title={guest.name}
          lede={`${categoryLabel(guest.invitationType)}. Up to ${guest.maxAttendees} guests.`}
          action={
            <Link className="btn btn-gold" href="/admin/guests">
              All guests
            </Link>
          }
        />
        <div className="mb-4">
          <StatusBadge status={guest.effectiveStatus} />
        </div>
        {query.created ? <p className="note mb-6">This invitation is ready to share.</p> : null}
        <GuestForm
          mode="edit"
          guestId={guest.id}
          initial={{
            name: guest.name,
            phone: guest.phone ?? "",
            invitationType: guest.invitationType,
            maxAttendees: guest.maxAttendees,
            status: guest.status,
            expiresAt: guest.expiresAt ?? "",
          }}
        />
        <InvitationTools
          key={`${guest.updatedAt}-${guest.inviteUrl ?? "hidden"}`}
          guestId={guest.id}
          inviteUrl={guest.inviteUrl}
          whatsappUrl={guest.whatsappUrl}
          effectiveStatus={guest.effectiveStatus}
        />
      </>
    );
}
