import QRCode from "qrcode";

import { guardAdminRequest } from "@/lib/auth";
import { getAdminGuest } from "@/lib/guests";
import { jsonError, toErrorResponse } from "@/lib/http";
import { baseUrlFromRequest } from "@/lib/urls";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  const { id } = await context.params;
  try {
    const guest = await getAdminGuest(id, baseUrlFromRequest(request));
    if (!guest) return jsonError("That guest could not be found.", 404);
    if (!guest.inviteUrl) {
      return jsonError("This link cannot be shown. Generate a new invitation.", 409);
    }
    const png = await QRCode.toBuffer(guest.inviteUrl, {
      type: "png",
      width: 720,
      margin: 1,
      color: { dark: "#24312a", light: "#f7f1e6" },
    });
    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, no-store",
        "Content-Disposition": 'inline; filename="invitation.png"',
      },
    });
  } catch (caught) {
    return toErrorResponse(caught);
  }
}
