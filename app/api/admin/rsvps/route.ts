import { guardAdminRequest } from "@/lib/auth";
import { json, toErrorResponse } from "@/lib/http";
import { listRsvpRows, parseRsvpFilters } from "@/lib/reporting";

export async function GET(request: Request) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  const url = new URL(request.url);
  const filters = parseRsvpFilters(Object.fromEntries(url.searchParams.entries()));
  try {
    const rows = await listRsvpRows(filters);
    const attending = rows
      .filter((row) => row.response === "ACCEPTED")
      .reduce((total, row) => total + (row.attendeeCount ?? 0), 0);
    return json({ rows, attending });
  } catch (caught) {
    return toErrorResponse(caught);
  }
}
