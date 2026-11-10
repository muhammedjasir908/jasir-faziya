import { guardAdminRequest } from "@/lib/auth";
import { deleteGuest, getAdminGuest, updateGuest } from "@/lib/guests";
import { json, jsonError, readJson, toErrorResponse } from "@/lib/http";
import { baseUrlFromRequest } from "@/lib/urls";
import { parseGuestInput } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  const { id } = await context.params;
  try {
    const guest = await getAdminGuest(id, baseUrlFromRequest(request));
    if (!guest) return jsonError("That guest could not be found.", 404);
    return json({ guest });
  } catch (caught) {
    return toErrorResponse(caught);
  }
}

export async function PATCH(request: Request, context: Context) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  const body = await readJson(request);
  if (body.error) return body.error;
  const parsed = parseGuestInput(body.data);
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  const { id } = await context.params;
  try {
    const guest = await updateGuest(id, parsed.data, baseUrlFromRequest(request));
    return json({ guest });
  } catch (caught) {
    return toErrorResponse(caught);
  }
}

export async function DELETE(request: Request, context: Context) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  const { id } = await context.params;
  try {
    await deleteGuest(id);
    return json({ ok: true });
  } catch (caught) {
    return toErrorResponse(caught);
  }
}
