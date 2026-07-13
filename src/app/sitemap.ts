import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://vietconnect-egy.example.com";
  const paths = ["", "/services", "/students", "/business", "/investment", "/directory", "/news", "/emergency", "/proposal"];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const p of paths) {
      entries.push({ url: `${base}/${locale}${p}`, lastModified: new Date() });
    }
  }
  return entries;
}
