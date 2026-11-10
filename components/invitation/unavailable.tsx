import Link from "next/link";

import { BISMILLAH } from "@/lib/constants";
import { PublicShell } from "@/components/invitation/shell";
import { Monogram } from "@/components/invitation/seal";

const copy = {
  not_found: {
    title: "Invitation not found",
    body: "This link does not match an invitation. Please open the personal link you received, or ask the family to send it again.",
  },
  disabled: {
    title: "Invitation unavailable",
    body: "This invitation is no longer active. Please contact the family if you need a new link.",
  },
  expired: {
    title: "Invitation expired",
    body: "This invitation link has expired. Please contact the family and they can share a new one.",
  },
  error: {
    title: "The invitation could not be opened",
    body: "Please try again in a moment. If it continues, the family can resend your link.",
  },
} as const;

export function Unavailable({ state }: { state: keyof typeof copy }) {
  const message = copy[state];
  return (
    <PublicShell>
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-2 py-20 text-center">
        <Monogram />
        <p lang="ar" dir="rtl" className="mt-6 font-arabic text-2xl text-[#f3e2bc]">
          {BISMILLAH}
        </p>
        <h1 className="mt-6 font-display text-5xl text-[#fbf6ef]">{message.title}</h1>
        <p className="mt-4 max-w-sm leading-7 text-[#f6e7c4]">{message.body}</p>
        <Link href="/" className="btn btn-sage mt-8 bg-[#fbf6ef] text-[#3c1018]">
          Return home
        </Link>
      </main>
    </PublicShell>
  );
}
