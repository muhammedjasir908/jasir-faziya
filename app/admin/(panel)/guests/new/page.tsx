import Link from "next/link";

import { GuestForm } from "@/components/admin/guest-form";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "New guest" };

export default function NewGuestPage() {
  return (
    <>
      <PageHeader
        title="New guest"
        lede="A private link is created when you save. Reception only is selected first, so the Nikah stays hidden unless you choose both events."
        action={
          <Link className="btn btn-gold" href="/admin/guests">
            All guests
          </Link>
        }
      />
      <GuestForm
        mode="create"
        initial={{
          name: "",
          phone: "",
          invitationType: "RECEPTION_ONLY",
          maxAttendees: 2,
          status: "ACTIVE",
          expiresAt: "",
        }}
      />
    </>
  );
}
