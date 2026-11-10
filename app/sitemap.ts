import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_URL?.replace(/\/$/, "") || "https://jasir-faziya.vercel.app";
  return [{ url: `${base}/` }, { url: `${base}/groom` }, { url: `${base}/bride` }];
}
