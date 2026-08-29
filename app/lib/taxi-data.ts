import raw from "@/taxi-rates.json";

// Taxi & minibus transfer prices: per vehicle, one-way, from/to Pafos.
// Source of truth is taxi-rates.json (edit that file to change prices).

export type TaxiTier = {
  key: string;
  label: string;
  minPax: number;
  maxPax: number;
  vehicle: "Taxi" | "Minibus";
};

export type TaxiRoute = {
  id: string;
  destination: string;
  prices: Record<string, number>;
};

export const taxiTiers = raw.tiers as TaxiTier[];
export const taxiRoutes = raw.routes as TaxiRoute[];

export const MIN_PASSENGERS = taxiTiers[0].minPax;
export const MAX_PASSENGERS = taxiTiers[taxiTiers.length - 1].maxPax;

export const OTHER_DESTINATION = "Other (tell us in notes)";

export const taxiDestinations = taxiRoutes.map((r) => r.destination);

export function tierForPassengers(passengers: number): TaxiTier | null {
  return taxiTiers.find((t) => passengers >= t.minPax && passengers <= t.maxPax) ?? null;
}

export function getRouteByDestination(destination: string): TaxiRoute | undefined {
  return taxiRoutes.find((r) => r.destination === destination);
}

/** Fixed price for a route + group size, or null when we need to quote. */
export function getTransferPrice(destination: string, passengers: number): number | null {
  const route = getRouteByDestination(destination);
  const tier = tierForPassengers(passengers);
  if (!route || !tier) return null;
  return route.prices[tier.key] ?? null;
}

/** Cheapest price on a route (1–4 people) — for "from €X" teasers. */
export function fromPrice(routeId: string): number | null {
  const route = taxiRoutes.find((r) => r.id === routeId);
  return route ? route.prices[taxiTiers[0].key] ?? null : null;
}

export function formatPrice(value: number | null): string {
  return value === null ? "Ask" : `€${value}`;
}
