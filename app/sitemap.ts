import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/lib/site-config";
import { fleet } from "@/app/lib/fleet-data";
import { taxiRoutes } from "@/app/lib/taxi-data";
import { routeCopy } from "@/app/lib/seo-data";

// No lastModified: it was set to the build time, which told Google every page
// changed on every deploy. Google only trusts lastmod when it is accurate, so
// an honest omission beats a false signal.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/fleet`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/taxi`, changeFrequency: "weekly", priority: 0.9 },
    ...taxiRoutes
      .filter((r) => routeCopy(r.id))
      .map((r) => ({
        url: `${siteConfig.url}/taxi/${r.id}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ...fleet.map((car) => ({
      url: `${siteConfig.url}/fleet/${car.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
