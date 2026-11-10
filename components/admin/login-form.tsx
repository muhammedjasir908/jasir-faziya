"use client";

import { useState } from "react";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
          next: nextPath,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; redirect?: string };
      if (!response.ok) {
        setError(data.error || "Sign-in could not be completed.");
        return;
      }
      window.location.href = data.redirect || "/admin";
    } catch {
      setError("Sign-in could not be completed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left">
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field"
        />
      </div>
      {error ? (
        <p className="note note-error" role="alert">
          {error}
        </p>
      ) : null}
      <button className="btn btn-sage w-full" type="submit" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
