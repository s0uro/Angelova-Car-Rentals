import { describe, expect, it } from "vitest";
import {
  getTransferPrice,
  tierForPassengers,
  taxiRoutes,
  FIXED_PRICE_PICKUP as OFFICE,
} from "@/app/lib/taxi-data";

describe("tierForPassengers boundaries", () => {
  const cases: [number, string | null][] = [
    [1, "1–4"],
    [4, "1–4"],
    [5, "5–6"],
    [9, "7–9"],
    [10, "10–12"],
    [14, "12–14"],
    [16, "14–16"],
    [17, null],
    [0, null],
  ];

  it.each(cases)("%i passengers -> %s", (pax, label) => {
    expect(tierForPassengers(pax)?.label ?? null).toBe(label);
  });
});

describe("getTransferPrice", () => {
  it("matches the owner's price sheet", () => {
    expect(getTransferPrice(OFFICE, "Pafos Airport", 2)).toBe(35);
    expect(getTransferPrice(OFFICE, "Larnaca Airport", 7)).toBe(180);
    expect(getTransferPrice(OFFICE, "Nicosia", 5)).toBe(180);
    expect(getTransferPrice(OFFICE, "Protaras", 16)).toBe(300);
  });

  it("returns null for an unknown destination or oversized group", () => {
    expect(getTransferPrice(OFFICE, "Athens", 2)).toBeNull();
    expect(getTransferPrice(OFFICE, "Nicosia", 20)).toBeNull();
  });

  it("only gives a fixed price from the Kato Pafos office", () => {
    expect(getTransferPrice("Coral Bay", "Pafos Airport", 2)).toBeNull();
    expect(getTransferPrice("", "Nicosia", 5)).toBeNull();
  });

  it("never gets cheaper as the group grows", () => {
    for (const route of taxiRoutes) {
      const prices = [1, 5, 7, 10, 13, 15].map((p) => getTransferPrice(OFFICE, route.destination, p)!);
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    }
  });
});
