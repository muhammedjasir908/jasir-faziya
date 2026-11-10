import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { readAdminToken, SESSION_COOKIE } from "@/lib/auth-token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const adminId = token ? await readAdminToken(token).catch(() => null) : null;

  if (!isLogin && pathname.startsWith("/admin") && !adminId) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    if (pathname !== "/admin") url.searchParams.set("next", pathname);
    const response = NextResponse.redirect(url);
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (isLogin && adminId) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
