import { toErrorResponse, clientIp, json, jsonError, readJson } from "@/lib/http";
import { saveCelebrationReply } from "@/lib/public-rsvp";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!rateLimit(`public-rsvp:${clientIp(request)}`, 20, 10 * 60 * 1000)) {
    return jsonError("Please wait a moment and try again.", 429);
  }
  const body = await readJson(request);
  if (body.error) return body.error;
  try {
    const reply = await saveCelebrationReply(body.data);
    return json({ reply });
  } catch (error) {
    if (error instanceof Error && /DATABASE_URL|Can't reach database|ECONNREFUSED|Server has closed the connection/i.test(error.message)) {
      return jsonError("Your reply could not be saved yet. The family register is not connected.", 503);
    }
    return toErrorResponse(error);
  }
}
