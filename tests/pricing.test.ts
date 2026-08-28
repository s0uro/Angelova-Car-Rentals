import { describe, expect, it } from "vitest";
import { fleet } from "@/app/lib/fleet-data";
import { dailyRateFor, rentalDays, quoteRental } from "@/app/lib/pricing";

const car = fleet[0];
const d = (iso: string) => new Date(iso);

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

describe("rentalDays", () => {
  it("rounds part days up", () => {
    expect(rentalDays(d("2026-09-01T10:00:00Z"), d("2026-09-02T12:00:00Z"))).toBe(2);
  });

  it("charges a minimum of one day", () => {
    expect(rentalDays(d("2026-09-01T10:00:00Z"), d("2026-09-01T12:00:00Z"))).toBe(1);
  });

  it("returns 0 when the drop-off is not after the pickup", () => {
    expect(rentalDays(d("2026-09-02T10:00:00Z"), d("2026-09-01T10:00:00Z"))).toBe(0);
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
