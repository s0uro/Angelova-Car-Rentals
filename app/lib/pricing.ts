import { fleet, type FleetCar } from "@/app/lib/fleet-data";
import { MS_PER_DAY } from "@/app/lib/availability-core";

export type RentalQuote = {
  car: FleetCar;
  days: number;
  perDay: number | null;
  /** null = the 14+ day rate is "ask us" for this car. */
  total: number | null;
};

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

export function quoteRental(
  carName: string,
  pickup: Date | null,
  dropoff: Date | null
): RentalQuote | null {
  const car = fleet.find((c) => c.name === carName);
  if (!car || !pickup || !dropoff) return null;
  const days = rentalDays(pickup, dropoff);
  if (days === 0) return null;
  const perDay = dailyRateFor(car, days);
  return { car, days, perDay, total: perDay === null ? null : perDay * days };
}
