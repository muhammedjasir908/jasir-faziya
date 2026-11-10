import { guardAdminRequest } from "@/lib/auth";
import { regenerateInvitation } from "@/lib/guests";
import { json, toErrorResponse } from "@/lib/http";
import { baseUrlFromRequest } from "@/lib/urls";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  const { id } = await context.params;
  try {
    const guest = await regenerateInvitation(id, baseUrlFromRequest(request));
    return json({ guest });
  } catch (caught) {
    return toErrorResponse(caught);
  }
}
