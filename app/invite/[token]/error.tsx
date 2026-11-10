"use client";

export default function InviteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="invitation-bg grid min-h-dvh place-items-center px-6 text-center">
      <div className="max-w-md">
        <h1 className="font-display text-5xl text-[#fbf6ef]">Something interrupted the invitation</h1>
        <p className="mt-4 leading-7 text-[#f6e7c4]">Please try opening it again.</p>
        <button className="btn btn-sage mt-8 bg-[#fbf6ef] text-[#3c1018]" type="button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </main>
  );
}
