import { describe, expect, it } from "vitest";
import { fleet } from "@/app/lib/fleet-data";
import { dailyRateFor, rentalDays, quoteRental } from "@/app/lib/pricing";
import { quoteBooking } from "@/app/lib/quote";
import { localInputToDate } from "@/app/lib/timezone";

const car = fleet[0];
const d = (iso: string) => new Date(iso);
const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
/** A rental of the given length, starting 10 Dec 2026 09:00 Cyprus time. */
function daysFor(ms: number): number {
  const pickup = localInputToDate("2026-12-10T09:00")!;
  return rentalDays(pickup, new Date(pickup.getTime() + ms));
}

describe("dailyRateFor tier boundaries", () => {
  const cases: [number, keyof typeof car.rates][] = [
    [1, "oneDay"],
    [2, "twoToThreeDays"],
    [3, "twoToThreeDays"],
    [4, "fourToSevenDays"],
    [7, "fourToSevenDays"],
    [8, "eightToFourteenDays"],
    [14, "eightToFourteenDays"],
    [15, "fourteenPlusDays"],
  ];

  it.each(cases)("%i days uses the %s rate", (days, key) => {
    expect(dailyRateFor(car, days)).toBe(car.rates[key]);
  });
});

describe("rentalDays: 24h days with a 2-hour grace period", () => {
  const cases: [string, number, number][] = [
    ["24h", 24 * HOUR, 1],
    ["26h (inside the grace period)", 26 * HOUR, 1],
    ["26h01m", 26 * HOUR + MINUTE, 2],
    ["48h", 48 * HOUR, 2],
    ["50h", 50 * HOUR, 2],
    ["50h01m", 50 * HOUR + MINUTE, 3],
    ["a short same-day rental (3h)", 3 * HOUR, 1],
    ["one hour", HOUR, 1],
  ];

  it.each(cases)("%s -> %i day(s)", (_, ms, days) => {
    expect(daysFor(ms)).toBe(days);
  });

  it("pickup 10/12 09:00, drop-off 11/12 11:00 is 1 day, not 2", () => {
    const pickup = localInputToDate("2026-12-10T09:00");
    const dropoff = localInputToDate("2026-12-11T11:00");
    const quote = quoteRental("Nissan March", pickup, dropoff);
    expect(quote?.days).toBe(1);
    expect(quote?.total).toBe(70); // was "2 days · estimated total €96"
  });

  it("returns 0 when the drop-off is not after the pickup", () => {
    expect(rentalDays(d("2026-09-02T10:00:00Z"), d("2026-09-01T10:00:00Z"))).toBe(0);
  });
});

describe("quoteBooking (the price saved with the booking and shown in admin/emails)", () => {
  const base = {
    type: "car",
    carName: "Nissan March",
    pickupLocation: "Peyia",
    dropoffLocation: null,
    passengers: null,
  };

  it("uses the same day count as the booking form", () => {
    const pickupDate = localInputToDate("2026-12-10T09:00")!;
    const dropoffDate = localInputToDate("2026-12-11T11:00")!;
    expect(quoteBooking({ ...base, pickupDate, dropoffDate })).toEqual({ price: 70, days: 1 });
    expect(quoteRental("Nissan March", pickupDate, dropoffDate)?.total).toBe(70);
  });

  it("charges the 2–3 day rate from 26h01m", () => {
    const pickupDate = localInputToDate("2026-12-10T09:00")!;
    const dropoffDate = new Date(pickupDate.getTime() + 26 * HOUR + MINUTE);
    expect(quoteBooking({ ...base, pickupDate, dropoffDate })).toEqual({ price: 96, days: 2 });
  });
});

describe("quoteRental", () => {
  it("multiplies the tier rate by the number of days", () => {
    const quote = quoteRental(car.name, d("2026-09-01T10:00:00Z"), d("2026-09-03T10:00:00Z"));
    expect(quote?.days).toBe(2);
    expect(quote?.total).toBe(car.rates.twoToThreeDays * 2);
  });

  it("returns null for an unknown car", () => {
    expect(quoteRental("DeLorean", d("2026-09-01"), d("2026-09-03"))).toBeNull();
  });

  it("returns a null total when the long-stay rate is 'ask'", () => {
    const askCar = fleet.find((c) => c.rates.fourteenPlusDays === null);
    if (!askCar) return;
    const quote = quoteRental(askCar.name, d("2026-09-01"), d("2026-09-20"));
    expect(quote?.total).toBeNull();
  });
});
