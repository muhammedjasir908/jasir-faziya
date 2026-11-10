import { Suspense } from "react";
import { connection } from "next/server";

import { LoginForm } from "@/components/admin/login-form";
import { Framed } from "@/components/invitation/ornaments";
import { InvitationFallback, PublicShell } from "@/components/invitation/shell";
import { safeNext } from "@/lib/config";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return (
    <Suspense
      fallback={
        <PublicShell>
          <InvitationFallback />
        </PublicShell>
      }
    >
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginContent({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  await connection();
  const params = await searchParams;
  return (
    <PublicShell>
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center py-16">
        <p className="section-kicker text-center">Family desk</p>
        <h1 className="mt-3 text-center font-display text-5xl text-[#fbf6ef]">Sign in</h1>
        <p className="mt-3 text-center text-sm leading-6 text-[#f6e7c4]">
          For the family only. Guests open the personal link they were sent.
        </p>
        <div className="mt-8">
          <Framed>
            <LoginForm nextPath={safeNext(params.next)} />
          </Framed>
        </div>
      </main>
    </PublicShell>
  );
}
