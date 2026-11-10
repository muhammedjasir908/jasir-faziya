import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 12;

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET must be a random string of at least 16 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(adminId: string) {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(key());
}

export async function readAdminToken(token: string) {
  const { payload } = await jwtVerify(token, key());
  if (payload.role !== "admin" || !payload.sub) return null;
  return payload.sub;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
