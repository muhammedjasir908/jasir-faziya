import { InvitePage } from "@/components/invitation/invite-page";
import { invitationMetadata } from "@/lib/public-share";

export const metadata = invitationMetadata("groom");

export default function HomePage() {
  return <InvitePage side="groom" />;
}
