import raw from "@/taxi-rates.json";

// Taxi & minibus transfer prices: per vehicle, one-way, from Kato Paphos.
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

/**
 * The fixed prices are for pickups in Kato Paphos only (the pickup area of
 * that name in site-config's pafosAreas). From anywhere else, even another
 * part of Paphos, the fare is confirmed by phone.
 */
export const FIXED_FARE_PICKUP = "Kato Pafos (Harbour)";

export const taxiDestinations = taxiRoutes.map((r) => r.destination);

export function tierForPassengers(passengers: number): TaxiTier | null {
  return taxiTiers.find((t) => passengers >= t.minPax && passengers <= t.maxPax) ?? null;
}

export function getRouteByDestination(destination: string): TaxiRoute | undefined {
  return taxiRoutes.find((r) => r.destination === destination);
}

/**
 * Fixed price for a transfer, or null when we quote by phone: a pickup outside
 * Kato Paphos, a destination with no fixed price, or a group too big for any
 * tier. Used by the booking form, the server when it saves the booking, and
 * the admin.
 */
export function getTransferPrice(
  pickupLocation: string,
  destination: string,
  passengers: number
): number | null {
  if (pickupLocation !== FIXED_FARE_PICKUP) return null;
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
