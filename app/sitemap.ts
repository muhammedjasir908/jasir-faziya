import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
  return [{ url: `${base}/` }, { url: `${base}/groom` }, { url: `${base}/bride` }];
}
