import { guardAdminRequest } from "@/lib/auth";
import { dashboardStats } from "@/lib/reporting";
import { json, toErrorResponse } from "@/lib/http";

export async function GET(request: Request) {
  const { error } = await guardAdminRequest(request);
  if (error) return error;
  try {
    return json({ stats: await dashboardStats() });
  } catch (caught) {
    return toErrorResponse(caught);
  }
}
