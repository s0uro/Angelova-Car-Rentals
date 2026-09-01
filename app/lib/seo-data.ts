import raw from "@/seo.json";

// Landing-page copy for the transfer routes. Prices are deliberately NOT here:
// taxi-rates.json stays the single source of truth for money.

export type RouteCopy = {
  aliases: string[];
  approxKm: number;
  approxMinutes: number;
  intro: string;
  highlights: string[];
};

export type Faq = { q: string; a: string };

const routes = raw.routes as Record<string, RouteCopy>;

export const sharedTransferFaqs = raw.sharedFaqs as Faq[];

export function routeCopy(routeId: string): RouteCopy | undefined {
  return routes[routeId];
}

/** Route ids that have landing-page copy, so pages are only built for those. */
export const routeIdsWithCopy = Object.keys(routes);

/** "1 h 45 min" / "20 min" — journey times read better than raw minutes. */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
