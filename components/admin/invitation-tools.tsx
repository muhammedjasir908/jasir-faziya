"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { adminFetch } from "@/components/admin/fetch";

export function InvitationTools({
  guestId,
  inviteUrl,
  whatsappUrl,
  effectiveStatus,
}: {
  guestId: string;
  inviteUrl: string | null;
  whatsappUrl: string | null;
  effectiveStatus: "ACTIVE" | "DISABLED" | "EXPIRED";
}) {
  const [url, setUrl] = useState(inviteUrl);
  const [shareUrl, setShareUrl] = useState(whatsappUrl);
  const [status, setStatus] = useState(effectiveStatus);
  const [qrVersion, setQrVersion] = useState(0);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState<"regenerate" | "delete" | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("The link could not be copied. Select it and copy it manually.");
    }
  }

  async function download() {
    const response = await fetch(`/api/admin/guests/${guestId}/qr?v=${qrVersion}`);
    if (!response.ok) {
      setError("The QR code could not be prepared.");
      return;
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "invitation.png";
    link.click();
    URL.revokeObjectURL(objectUrl);
  }

  async function toggleStatus() {
    setPending(true);
    setError("");
    try {
      const next = status === "DISABLED" ? "ACTIVE" : "DISABLED";
      const data = await adminFetch<{ guest: { effectiveStatus: "ACTIVE" | "DISABLED" | "EXPIRED" } }>(
        `/api/admin/guests/${guestId}/status`,
        { method: "POST", body: JSON.stringify({ status: next }) },
      );
      setStatus(data.guest.effectiveStatus);
      setMessage(data.guest.effectiveStatus === "ACTIVE" ? "Invitation enabled." : "Invitation updated.");
    } catch (caught) {
      if (caught instanceof Error && caught.message === "Please sign in again.") {
        router.push("/admin/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "The invitation could not be updated.");
    } finally {
      setPending(false);
    }
  }

  async function regenerate() {
    setPending(true);
    setError("");
    try {
      const data = await adminFetch<{ guest: { inviteUrl: string | null; whatsappUrl: string | null } }>(
        `/api/admin/guests/${guestId}/regenerate`,
        { method: "POST" },
      );
      setUrl(data.guest.inviteUrl);
      setShareUrl(data.guest.whatsappUrl);
      setQrVersion(Date.now());
      setConfirming(null);
      setMessage("A new link is ready. The previous link no longer opens.");
    } catch (caught) {
      if (caught instanceof Error && caught.message === "Please sign in again.") {
        router.push("/admin/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "The link could not be replaced.");
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    setPending(true);
    setError("");
    try {
      await adminFetch(`/api/admin/guests/${guestId}`, { method: "DELETE" });
      router.push("/admin/guests");
      router.refresh();
    } catch (caught) {
      if (caught instanceof Error && caught.message === "Please sign in again.") {
        router.push("/admin/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "The guest could not be removed.");
      setPending(false);
    }
  }

  return (
    <div className="mt-8 space-y-5">
      <div>
        <p className="section-kicker">Personal link</p>
        {url ? (
          <p className="mt-3 break-all text-sm leading-6 text-ink">{url}</p>
        ) : (
          <p className="note mt-3">This link cannot be shown. Generate a new one.</p>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="btn btn-sage" type="button" onClick={copy} disabled={!url}>
          {copied ? "Copied" : "Copy link"}
        </button>
        {shareUrl ? (
          <a className="btn btn-gold" href={shareUrl} target="_blank" rel="noopener noreferrer">
            Share on WhatsApp
          </a>
        ) : null}
        {url ? (
          <a className="btn btn-gold" href={url} target="_blank" rel="noreferrer">
            Preview
          </a>
        ) : null}
        <button className="btn btn-gold" type="button" onClick={toggleStatus} disabled={pending}>
          {status === "DISABLED" ? "Enable invitation" : "Disable invitation"}
        </button>
      </div>
      {url ? (
        <div className="flex flex-wrap items-end gap-5">
          {/* Authenticated QR images must bypass the image optimizer so the session cookie is sent. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/admin/guests/${guestId}/qr?v=${qrVersion}`}
            alt="QR code for this guest's invitation"
            width={220}
            height={220}
            className="border border-[rgba(141,106,50,0.35)] bg-paper"
          />
          <button className="btn btn-gold" type="button" onClick={download}>
            Download QR
          </button>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {confirming === "regenerate" ? (
          <>
            <button className="btn btn-danger" type="button" onClick={regenerate} disabled={pending}>
              Replace the link
            </button>
            <button className="btn btn-gold" type="button" onClick={() => setConfirming(null)}>
              Keep this link
            </button>
          </>
        ) : (
          <button className="btn btn-gold" type="button" onClick={() => setConfirming("regenerate")}>
            Generate a new link
          </button>
        )}
        {confirming === "delete" ? (
          <>
            <button className="btn btn-danger" type="button" onClick={remove} disabled={pending}>
              Delete guest
            </button>
            <button className="btn btn-gold" type="button" onClick={() => setConfirming(null)}>
              Keep guest
            </button>
          </>
        ) : (
          <button className="btn btn-danger" type="button" onClick={() => setConfirming("delete")}>
            Delete guest
          </button>
        )}
      </div>
      {confirming === "regenerate" ? (
        <p className="text-sm leading-6 text-muted">The current link will stop working immediately.</p>
      ) : null}
      {error ? (
        <p className="note note-error" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="note" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
