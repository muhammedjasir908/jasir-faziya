import "server-only";

import { headers } from "next/headers";

export async function requestBaseUrl() {
  const configured = process.env.APP_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  if (!host) return "http://localhost:3000";
  return `${proto}://${host}`;
}

export function baseUrlFromRequest(request: Request) {
  const configured = process.env.APP_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export function invitationUrl(base: string, token: string) {
  return `${base}/invite/${token}`;
}
