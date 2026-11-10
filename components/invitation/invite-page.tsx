import { DEFAULT_TIMEZONE, NIKAH_DATE_ISO, NIKAH_TIME, RECEPTION_START, WEDDING_DATE_ISO, type InvitationSide } from "@/lib/constants";
import { eventMoment } from "@/lib/format";
import { Celebration } from "@/components/invitation/celebration";
import { PublicShell } from "@/components/invitation/shell";

export function InvitePage({ side }: { side: InvitationSide }) {
  const countdownTo = eventMoment(
    side === "bride" ? NIKAH_DATE_ISO : WEDDING_DATE_ISO,
    side === "bride" ? NIKAH_TIME : RECEPTION_START,
    DEFAULT_TIMEZONE,
  );

  return (
    <PublicShell tone={side === "bride" ? "garden" : "velvet"}>
      <Celebration side={side} countdownTo={countdownTo ?? ""} />
    </PublicShell>
  );
}
