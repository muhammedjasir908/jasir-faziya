import { guardAdminRequest } from "@/lib/auth";
import { updateEvent } from "@/lib/events";
import { json, readJson, toErrorResponse } from "@/lib/http";
import { parseEventInput } from "@/lib/validators";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  const body = await readJson(request);
  if (body.error) return body.error;
  const parsed = parseEventInput(body.data);
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  const { id } = await context.params;
  try {
    const event = await updateEvent(id, parsed.data);
    return json({ event });
  } catch (caught) {
    return toErrorResponse(caught);
  }
}
