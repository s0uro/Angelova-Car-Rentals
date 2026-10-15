import { carByName, type FleetCar } from "@/app/lib/fleet-data";
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

/** A car may come back up to this late before another day is charged. */
export const RENTAL_GRACE_HOURS = 2;
const GRACE_MS = RENTAL_GRACE_HOURS * 60 * 60 * 1000;

/**
 * Billable days: a rental day is 24 hours plus a 2-hour grace period, and a
 * rental is always at least one day — max(1, ceil((hours - 2) / 24)). So up
 * to 26h is 1 day, 26h01m–50h is 2 days, and so on. The form estimate, the
 * price stored with the booking, the admin and the emails all use this.
 */
export function rentalDays(pickup: Date, dropoff: Date): number {
  const diffMs = dropoff.getTime() - pickup.getTime();
  if (!Number.isFinite(diffMs) || diffMs <= 0) return 0;
  return Math.max(1, Math.ceil((diffMs - GRACE_MS) / MS_PER_DAY));
}

export function quoteRental(
  carName: string,
  pickup: Date | null,
  dropoff: Date | null
): RentalQuote | null {
  const car = carByName(carName);
  if (!car || !pickup || !dropoff) return null;
  const days = rentalDays(pickup, dropoff);
  if (days === 0) return null;
  const perDay = dailyRateFor(car, days);
  return { car, days, perDay, total: perDay === null ? null : perDay * days };
}
