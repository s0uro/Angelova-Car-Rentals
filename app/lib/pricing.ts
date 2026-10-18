import { fleet, type FleetCar } from "@/app/lib/fleet-data";
import { MS_PER_DAY } from "@/app/lib/availability-core";
import { OFFICE_LOCATION } from "@/app/lib/site-config";

export type RentalQuote = {
  car: FleetCar;
  days: number;
  perDay: number | null;
  /** Daily rate × days, before delivery fees. */
  rentalTotal: number | null;
  /** Fee for bringing the car to / collecting it from outside the office. */
  pickupFee: number;
  dropoffFee: number;
  /** null = the 14+ day rate is "ask us" for this car. */
  total: number | null;
};

/**
 * Delivery / collection fee per area, charged once for the pickup and once
 * for the drop-off. Pickup and drop-off at the office are free.
 */
export const LOCATION_FEES: Record<string, number> = {
  [OFFICE_LOCATION]: 0,
  "Pafos Town Centre": 5,
  "Tombs of the Kings Area": 5,
  "Universal / Anavargos": 5,
  "Geroskipou": 10,
  "Chlorakas": 10,
  "Emba": 10,
  "Pafos International Airport": 15,
  "Kissonerga": 15,
  "Tala": 15,
  "Coral Bay": 20,
  "Peyia": 20,
  "Polis Chrysochous": 40,
  "Latchi": 45,
};

/** Fee for one pickup or drop-off at `area`; unknown or empty areas are free. */
export function locationFee(area: string): number {
  return LOCATION_FEES[area] ?? 0;
}

/** Daily rate for a rental of `days` days — the tier table in one place. */
export function dailyRateFor(car: FleetCar, days: number): number | null {
  if (days <= 1) return car.rates.oneDay;
  if (days <= 3) return car.rates.twoToThreeDays;
  if (days <= 7) return car.rates.fourToSevenDays;
  if (days <= 14) return car.rates.eightToFourteenDays;
  return car.rates.fourteenPlusDays;
}

/** Part-days count as a full day, and a rental is always at least one day. */
export function rentalDays(pickup: Date, dropoff: Date): number {
  const diffMs = dropoff.getTime() - pickup.getTime();
  if (!Number.isFinite(diffMs) || diffMs <= 0) return 0;
  return Math.max(1, Math.ceil(diffMs / MS_PER_DAY));
}

/** An empty `dropoffLocation` means "same as pickup". */
export function quoteRental(
  carName: string,
  pickup: Date | null,
  dropoff: Date | null,
  pickupLocation = "",
  dropoffLocation = ""
): RentalQuote | null {
  const car = fleet.find((c) => c.name === carName);
  if (!car || !pickup || !dropoff) return null;
  const days = rentalDays(pickup, dropoff);
  if (days === 0) return null;
  const perDay = dailyRateFor(car, days);
  const rentalTotal = perDay === null ? null : perDay * days;
  const pickupFee = locationFee(pickupLocation);
  const dropoffFee = locationFee(dropoffLocation || pickupLocation);
  return {
    car,
    days,
    perDay,
    rentalTotal,
    pickupFee,
    dropoffFee,
    total: rentalTotal === null ? null : rentalTotal + pickupFee + dropoffFee,
  };
}
