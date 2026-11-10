import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { SESSION_COOKIE, sessionCookieOptions, signAdminToken } from "@/lib/auth-token";
import { safeNext } from "@/lib/config";
import { getPrisma } from "@/lib/db";
import { assertSameOrigin, clientIp, jsonError, readJson } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(200),
  next: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;
  if (!rateLimit(`login:${clientIp(request)}`, 8, 15 * 60 * 1000)) {
    return jsonError("Please wait a few minutes and try again.", 429);
  }

  try {
    const body = await readJson(request);
    if (body.error) return body.error;
    const parsed = schema.safeParse(body.data);
    if (!parsed.success) return jsonError("The email or password is not correct.", 401);

    const admin = await getPrisma().admin.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });
    const matches = admin ? await bcrypt.compare(parsed.data.password, admin.passwordHash) : false;
    if (!admin || !matches) return jsonError("The email or password is not correct.", 401);

    const token = await signAdminToken(admin.id);
    const response = NextResponse.json(
      { redirect: safeNext(parsed.data.next) },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes("DATABASE_URL")) {
      return jsonError("The family desk is not connected yet. Add the database and seed an admin.", 503);
    }
    if (error instanceof Error && error.message.includes("AUTH_SECRET")) {
      return jsonError("AUTH_SECRET is missing. Add it before signing in.", 503);
    }
    console.error("Sign-in failed");
    return jsonError("Sign-in could not be completed.", 500);
  }
}
