"use client";

import { useState } from "react";

import type { InvitationSide } from "@/lib/constants";
import { invitationLink, publicShare } from "@/lib/public-share";

export function ShareInvitation({ side }: { side: InvitationSide }) {
  const [note, setNote] = useState("");

  async function onShare() {
    const share = publicShare(side);
    const url = invitationLink(side);
    const full = `${share.message}\n\n${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: share.title, text: share.message, url });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
    const opened = window.open(`https://wa.me/?text=${encodeURIComponent(full)}`, "_blank", "noopener,noreferrer");
    if (opened) return;
    try {
      await navigator.clipboard.writeText(full);
      setNote("Invitation text copied");
    } catch {
      setNote("Share this page from your browser menu");
    }
  }

  return (
    <div className="mt-3 flex flex-col items-center">
      <button type="button" className="velora-open velora-share" onClick={onShare}>
        Share invitation
      </button>
      {note ? <p className="velora-date mt-2">{note}</p> : null}
    </div>
  );
}
