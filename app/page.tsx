import { DEFAULT_TIMEZONE, RECEPTION_START, WEDDING_DATE_ISO } from "@/lib/constants";
import { eventMoment } from "@/lib/format";
import { Celebration } from "@/components/invitation/celebration";
import { PublicShell } from "@/components/invitation/shell";

export default function HomePage() {
  const countdownTo = eventMoment(WEDDING_DATE_ISO, RECEPTION_START, DEFAULT_TIMEZONE);
  return (
    <PublicShell>
      <Celebration countdownTo={countdownTo ?? ""} />
    </PublicShell>
  );
}
