import { AppError } from "@/lib/errors";

export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function jsonError(message: string, status: number) {
  return json({ error: message }, status);
}

export function toErrorResponse(error: unknown) {
  if (error instanceof AppError) return jsonError(error.message, error.status);
  console.error(error);
  return jsonError("Something went wrong. Please try again.", 500);
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const host = request.headers.get("host");
  if (!host) return jsonError("This request could not be checked.", 400);
  try {
    if (new URL(origin).host !== host) return jsonError("This request was refused.", 403);
  } catch {
    return jsonError("This request was refused.", 403);
  }
  return null;
}

export async function readJson(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().includes("application/json")) {
    return { data: null, error: jsonError("Send the form as JSON.", 415) };
  }
  try {
    return { data: await request.json(), error: null };
  } catch {
    return { data: null, error: jsonError("The form could not be read.", 400) };
  }
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}
