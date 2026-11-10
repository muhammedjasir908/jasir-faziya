import Link from "next/link";

import { Monogram } from "@/components/invitation/seal";
import { PublicShell } from "@/components/invitation/shell";

export default function NotFound() {
  return (
    <PublicShell>
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-2 text-center">
        <Monogram />
        <h1 className="mt-8 font-display text-5xl text-[#fbf6ef]">This page is not part of the invitation</h1>
        <p className="mt-4 leading-7 text-[#f6e7c4]">Please return home, or open the personal link you received.</p>
        <Link href="/" className="btn btn-sage mt-8 bg-[#fbf6ef] text-[#3c1018]">
          Return home
        </Link>
      </main>
    </PublicShell>
  );
}
