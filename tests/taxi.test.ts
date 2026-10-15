import { describe, expect, it } from "vitest";
import {
  FIXED_FARE_PICKUP,
  getTransferPrice,
  tierForPassengers,
  taxiRoutes,
} from "@/app/lib/taxi-data";
import { pafosAreas } from "@/app/lib/site-config";
import { quoteBooking, whyNoFixedFare } from "@/app/lib/quote";

const KATO = FIXED_FARE_PICKUP;

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
    [30, null],
    [0, null],
  ];

  it.each(cases)("%i passengers -> %s", (pax, label) => {
    expect(tierForPassengers(pax)?.label ?? null).toBe(label);
  });
});

describe("getTransferPrice", () => {
  it("is offered as a pickup area in the booking form", () => {
    expect(pafosAreas).toContain(FIXED_FARE_PICKUP);
  });

  it("matches the owner's price sheet for pickups in Kato Paphos", () => {
    expect(getTransferPrice(KATO, "Pafos Airport", 2)).toBe(35);
    expect(getTransferPrice(KATO, "Larnaca Airport", 7)).toBe(180);
    expect(getTransferPrice(KATO, "Nicosia", 5)).toBe(180);
    expect(getTransferPrice(KATO, "Protaras", 16)).toBe(300);
  });

  it("has no fixed price from anywhere else, even elsewhere in Paphos", () => {
    for (const pickup of pafosAreas.filter((a) => a !== KATO)) {
      expect(getTransferPrice(pickup, "Pafos Airport", 2)).toBeNull();
    }
    expect(getTransferPrice("", "Pafos Airport", 2)).toBeNull();
  });

  it("returns null for an unknown destination or oversized group", () => {
    expect(getTransferPrice(KATO, "Athens", 2)).toBeNull();
    expect(getTransferPrice(KATO, "Nicosia", 20)).toBeNull();
  });

  it("never gets cheaper as the group grows", () => {
    for (const route of taxiRoutes) {
      const prices = [1, 5, 7, 10, 13, 15].map((p) => getTransferPrice(KATO, route.destination, p)!);
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    }
  });
});

describe("quoteBooking for a taxi (what the server saves)", () => {
  const taxi = {
    type: "taxi",
    carName: null,
    pickupDate: new Date("2026-12-10T09:00:00Z"),
    dropoffDate: null,
    dropoffLocation: "Pafos Airport",
    passengers: 2,
  };

  it("saves the fixed price for a pickup in Kato Paphos", () => {
    expect(quoteBooking({ ...taxi, pickupLocation: KATO })).toEqual({ price: 35, days: null });
  });

  it("saves no price for a Paphos -> airport ride from elsewhere (the €35 bug)", () => {
    expect(quoteBooking({ ...taxi, pickupLocation: "Pafos Town Centre" }).price).toBeNull();
    expect(quoteBooking({ ...taxi, pickupLocation: "Pafos International Airport", dropoffLocation: "Pegeia" }).price).toBeNull();
    expect(quoteBooking({ ...taxi, pickupLocation: "Peyia" }).price).toBeNull();
  });

  it("explains to the owner why there is no fixed fare", () => {
    expect(whyNoFixedFare({ ...taxi, pickupLocation: "Peyia" })).toBe("the pickup (Peyia) is outside Kato Paphos");
    expect(whyNoFixedFare({ ...taxi, pickupLocation: KATO, dropoffLocation: "Coral Bay" })).toBe("it's a local ride");
  });
});
