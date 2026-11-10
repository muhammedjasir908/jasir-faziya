import { BRIDE, GROOM } from "@/lib/constants";
import type { InvitationAccess } from "@/lib/public-types";

export function invitationShareText(guestName: string, url: string, invitationType: InvitationAccess) {
  const access =
    invitationType === "BOTH_EVENTS"
      ? "You are invited to the Nikah and the Reception."
      : "You are invited to the Reception.";
  return [
    `Assalamu Alaikum ${guestName},`,
    "",
    `With the blessings of our families, you are invited to the wedding of ${GROOM} and ${BRIDE}.`,
    access,
    "",
    "Please open your personal invitation:",
    url,
  ].join("\n");
}

export function whatsAppHref(phone: string | null, text: string) {
  const encoded = encodeURIComponent(text);
  const digits = phone?.replace(/\D/g, "") ?? "";
  if (digits.length >= 10 && !digits.startsWith("0")) {
    return `https://wa.me/${digits}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}
