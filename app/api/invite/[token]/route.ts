import { clientIp, json, jsonError } from "@/lib/http";
import { resolveInvitation } from "@/lib/invitation";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request, context: { params: Promise<{ token: string }> }) {
  if (!rateLimit(`invite:${clientIp(request)}`, 60, 60_000)) {
    return jsonError("Please wait a moment and try again.", 429);
  }
  const { token } = await context.params;
  const result = await resolveInvitation(token);
  if (result.state === "ready") return json({ invitation: result.invitation });
  if (result.state === "not_found") return jsonError("This invitation could not be found.", 404);
  if (result.state === "disabled") return jsonError("This invitation is no longer available.", 403);
  if (result.state === "expired") return jsonError("This invitation has expired.", 403);
  return jsonError("This invitation could not be opened.", 503);
}
