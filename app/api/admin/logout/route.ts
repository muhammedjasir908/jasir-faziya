import { NextResponse } from "next/server";

import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth-token";
import { assertSameOrigin } from "@/lib/http";

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
