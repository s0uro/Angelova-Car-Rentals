import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/lib/site-config";
import { fleet } from "@/app/lib/fleet-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/fleet`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...fleet.map((car) => ({
      url: `${siteConfig.url}/fleet/${car.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${siteConfig.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
