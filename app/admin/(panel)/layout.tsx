import { Suspense } from "react";
import { connection } from "next/server";

import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/auth";

export const metadata = {
  title: "Family desk",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="bg-ivory p-8 font-display text-3xl text-ink">Opening the family desk</p>}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}

async function Gate({ children }: { children: React.ReactNode }) {
  await connection();
  const admin = await requireAdmin();
  return <AdminShell name={admin.name}>{children}</AdminShell>;
}
