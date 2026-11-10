import { guardAdminRequest } from "@/lib/auth";
import { rsvpCsv } from "@/lib/csv";
import { toErrorResponse } from "@/lib/http";
import { listRsvpRows, parseRsvpFilters } from "@/lib/reporting";

export async function GET(request: Request) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  const url = new URL(request.url);
  const filters = parseRsvpFilters(Object.fromEntries(url.searchParams.entries()));
  try {
    const csv = rsvpCsv(await listRsvpRows(filters));
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="jasir-faziya-rsvps.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (caught) {
    return toErrorResponse(caught);
  }
}
