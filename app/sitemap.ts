import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/fleet`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];
}
