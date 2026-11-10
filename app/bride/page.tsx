import { InvitePage } from "@/components/invitation/invite-page";
import { invitationMetadata } from "@/lib/public-share";

export const metadata = invitationMetadata("bride");

export default function BridePage() {
  return <InvitePage side="bride" />;
}
