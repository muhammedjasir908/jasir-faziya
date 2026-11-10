"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-lg">
      <h1 className="font-display text-4xl">The family desk could not open this page</h1>
      <p className="mt-3 text-sm leading-6 text-muted">Please try again.</p>
      <button className="btn btn-sage mt-6" type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
