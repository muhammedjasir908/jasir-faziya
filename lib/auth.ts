import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { readAdminToken, SESSION_COOKIE } from "@/lib/auth-token";
import { getPrisma } from "@/lib/db";
import { assertSameOrigin, jsonError } from "@/lib/http";

export async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  const adminId = await readAdminToken(token).catch(() => null);
  if (!adminId) redirect("/admin/login");
  const admin = await getPrisma().admin.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, name: true },
  });
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function assertAdmin() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return { admin: null, error: jsonError("Please sign in again.", 401) };
  const adminId = await readAdminToken(token).catch(() => null);
  if (!adminId) return { admin: null, error: jsonError("Please sign in again.", 401) };
  const admin = await getPrisma().admin.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, name: true },
  });
  if (!admin) return { admin: null, error: jsonError("Please sign in again.", 401) };
  return { admin, error: null };
}

export async function guardAdminRequest(request: Request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    const originError = assertSameOrigin(request);
    if (originError) return { admin: null, error: originError };
  }
  return assertAdmin();
}
