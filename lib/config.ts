import "server-only";

import { DEFAULT_TIMEZONE } from "@/lib/constants";

export function weddingTimeZone() {
  return process.env.WEDDING_TIMEZONE?.trim() || DEFAULT_TIMEZONE;
}

export function safeNext(value: string | null | undefined) {
  if (!value) return "/admin";
  if (!value.startsWith("/admin") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return "/admin";
  }
  return value;
}
