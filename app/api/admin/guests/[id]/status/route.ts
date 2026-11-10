import { z } from "zod";

import { guardAdminRequest } from "@/lib/auth";
import { setGuestStatus } from "@/lib/guests";
import { json, readJson, toErrorResponse } from "@/lib/http";
import { baseUrlFromRequest } from "@/lib/urls";

const schema = z.object({ status: z.enum(["ACTIVE", "DISABLED"]) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  const body = await readJson(request);
  if (body.error) return body.error;
  const parsed = schema.safeParse(body.data);
  if (!parsed.success) return json({ error: "Choose whether the invitation is active or disabled." }, 400);
  const { id } = await context.params;
  try {
    const guest = await setGuestStatus(id, parsed.data.status, baseUrlFromRequest(request));
    return json({ guest });
  } catch (caught) {
    return toErrorResponse(caught);
  }
}
