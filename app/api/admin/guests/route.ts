import { guardAdminRequest } from "@/lib/auth";
import { createGuest, listGuests } from "@/lib/guests";
import { json, readJson, toErrorResponse } from "@/lib/http";
import { baseUrlFromRequest } from "@/lib/urls";
import { parseGuestInput } from "@/lib/validators";

export async function GET(request: Request) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  const url = new URL(request.url);
  try {
    const guests = await listGuests(
      {
        q: url.searchParams.get("q") ?? "",
        category: url.searchParams.get("category") ?? "",
        status: url.searchParams.get("status") ?? "",
      },
      baseUrlFromRequest(request),
    );
    return json({ guests });
  } catch (caught) {
    return toErrorResponse(caught);
  }
}

export async function POST(request: Request) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  const body = await readJson(request);
  if (body.error) return body.error;
  const parsed = parseGuestInput(body.data);
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  try {
    const guest = await createGuest(parsed.data, baseUrlFromRequest(request));
    return json({ guest }, 201);
  } catch (caught) {
    return toErrorResponse(caught);
  }
}
