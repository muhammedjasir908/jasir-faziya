"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { adminFetch } from "@/components/admin/fetch";
import type { InvitationAccess, InvitationState } from "@/lib/public-types";

export type GuestFormValues = {
  name: string;
  phone: string;
  invitationType: InvitationAccess;
  maxAttendees: number;
  status: InvitationState;
  expiresAt: string;
};

export function GuestForm({
  mode,
  guestId,
  initial,
}: {
  mode: "create" | "edit";
  guestId?: string;
  initial: GuestFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  function update<K extends keyof GuestFormValues>(key: K, value: GuestFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    const payload = {
      ...values,
      phone: values.phone.trim() || null,
      maxAttendees: Number(values.maxAttendees),
      expiresAt: values.expiresAt || null,
    };
    try {
      if (mode === "create") {
        const data = await adminFetch<{ guest: { id: string } }>("/api/admin/guests", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        router.push(`/admin/guests/${data.guest.id}?created=1`);
        router.refresh();
        return;
      }
      await adminFetch(`/api/admin/guests/${guestId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setMessage("Guest details saved.");
      router.refresh();
    } catch (caught) {
      if (caught instanceof Error && caught.message === "Please sign in again.") {
        router.push("/admin/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "The guest could not be saved.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="label" htmlFor="guest-name">
          Guest name
        </label>
        <input
          id="guest-name"
          className="field"
          required
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="guest-phone">
          Phone
        </label>
        <input
          id="guest-phone"
          className="field"
          type="tel"
          inputMode="tel"
          placeholder="Country code and number"
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="guest-limit">
          Maximum guests
        </label>
        <input
          id="guest-limit"
          className="field"
          type="number"
          min={1}
          max={30}
          value={values.maxAttendees}
          onChange={(event) => update("maxAttendees", Number(event.target.value))}
        />
      </div>
      <div>
        <label className="label" htmlFor="guest-type">
          Invitation
        </label>
        <select
          id="guest-type"
          className="field"
          value={values.invitationType}
          onChange={(event) => update("invitationType", event.target.value as InvitationAccess)}
        >
          <option value="RECEPTION_ONLY">Reception only</option>
          <option value="BOTH_EVENTS">Both events, including Nikah</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="guest-status">
          Status
        </label>
        <select
          id="guest-status"
          className="field"
          value={values.status}
          onChange={(event) => update("status", event.target.value as InvitationState)}
        >
          <option value="ACTIVE">Active</option>
          <option value="DISABLED">Disabled</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="label" htmlFor="guest-expiry">
          Expiry, optional
        </label>
        <input
          id="guest-expiry"
          className="field"
          type="datetime-local"
          value={values.expiresAt}
          onChange={(event) => update("expiresAt", event.target.value)}
        />
        <p className="mt-2 text-sm leading-6 text-muted">
          Reception-only guests never receive Nikah details. Choose both events only when this guest should see them.
        </p>
      </div>
      {error ? (
        <p className="note note-error md:col-span-2" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="note md:col-span-2" role="status">
          {message}
        </p>
      ) : null}
      <div>
        <button className="btn btn-sage" type="submit" disabled={pending}>
          {pending ? "Saving" : mode === "create" ? "Create invitation" : "Save guest"}
        </button>
      </div>
    </form>
  );
}
