import { clientIp, json, jsonError, readJson } from "@/lib/http";
import { submitRsvp } from "@/lib/invitation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request, context: { params: Promise<{ token: string }> }) {
  if (!rateLimit(`rsvp:${clientIp(request)}`, 20, 10 * 60 * 1000)) {
    return jsonError("Please wait a moment and try again.", 429);
  }
  const body = await readJson(request);
  if (body.error) return body.error;
  const { token } = await context.params;
  const result = await submitRsvp(token, body.data);
  return json(result.body, result.status);
}
