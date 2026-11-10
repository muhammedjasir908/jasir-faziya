import { guardAdminRequest } from "@/lib/auth";
import { listEvents } from "@/lib/events";
import { json, toErrorResponse } from "@/lib/http";

export async function GET(request: Request) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  try {
    return json({ events: await listEvents() });
  } catch (caught) {
    return toErrorResponse(caught);
  }
}
