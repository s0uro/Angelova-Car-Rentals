import { describe, expect, it } from "vitest";
import {
  effectiveDropoff,
  rangesOverlap,
  isCarAvailable,
  peakBookings,
  fullyBookedUntil,
  fullyBookedNow,
  unitsOf,
  type BookedRange,
} from "@/app/lib/availability-core";

const d = (iso: string) => new Date(iso);

function booking(carName: string, from: string, to: string): BookedRange {
  return { carName, pickupDate: d(from), dropoffDate: d(to) };
}
function times(n: number, b: BookedRange): BookedRange[] {
  return Array.from({ length: n }, () => ({ ...b }));
}

describe("effectiveDropoff", () => {
  it("blocks one day when no drop-off is given", () => {
    const end = effectiveDropoff(d("2026-09-01T08:00:00Z"), null);
    expect(end.toISOString()).toBe("2026-09-02T08:00:00.000Z");
  });

  it("ignores a drop-off that is not after the pickup", () => {
    const end = effectiveDropoff(d("2026-09-01T08:00:00Z"), d("2026-08-30T08:00:00Z"));
    expect(end.toISOString()).toBe("2026-09-02T08:00:00.000Z");
  });
});

describe("rangesOverlap", () => {
  it("treats touching ranges as free (one ends exactly when the next starts)", () => {
    expect(
      rangesOverlap(d("2026-09-01"), d("2026-09-03"), d("2026-09-03"), d("2026-09-05"))
    ).toBe(false);
  });

  it("detects a one-hour overlap", () => {
    expect(
      rangesOverlap(
        d("2026-09-01T00:00:00Z"),
        d("2026-09-03T10:00:00Z"),
        d("2026-09-03T09:00:00Z"),
        d("2026-09-05T00:00:00Z")
      )
    ).toBe(true);
  });
});

describe("isCarAvailable with several units of a model", () => {
  const dec10to12 = booking("Nissan March", "2026-12-10T07:00:00Z", "2026-12-12T07:00:00Z");

  it("7 Nissan March, one booked 10–12 Dec: the other 6 are still bookable", () => {
    for (let booked = 1; booked < 7; booked++) {
      expect(
        isCarAvailable(times(booked, dec10to12), "Nissan March", 7, d("2026-12-10T07:00:00Z"), d("2026-12-12T07:00:00Z"))
      ).toBe(true);
    }
  });

  it("is unavailable only when every unit is booked for those dates", () => {
    const all7 = times(7, dec10to12);
    expect(isCarAvailable(all7, "Nissan March", 7, d("2026-12-11T07:00:00Z"), d("2026-12-11T17:00:00Z"))).toBe(false);
    // ...and bookable again from the moment they come back.
    expect(isCarAvailable(all7, "Nissan March", 7, d("2026-12-12T07:00:00Z"), d("2026-12-14T07:00:00Z"))).toBe(true);
  });

  it("ignores other models", () => {
    const all7 = times(7, dec10to12);
    expect(isCarAvailable(all7, "Toyota Vitz", 1, d("2026-12-10T07:00:00Z"), d("2026-12-12T07:00:00Z"))).toBe(true);
  });

  it("a single-unit model is blocked by any overlap", () => {
    const jimny = [booking("Suzuki Jimny", "2026-09-10", "2026-09-14")];
    expect(isCarAvailable(jimny, "Suzuki Jimny", 1, d("2026-09-11"), d("2026-09-12"))).toBe(false);
    expect(isCarAvailable(jimny, "Suzuki Jimny", 1, d("2026-09-14"), d("2026-09-16"))).toBe(true);
  });

  it("counts the busiest moment, not every booking in the range", () => {
    // 2 Nissan Note: 1–5 Nov and 8–12 Nov never overlap each other, so one
    // unit stays free all through 3–10 Nov.
    const notes = [
      booking("Nissan Note", "2026-11-01T08:00:00Z", "2026-11-05T08:00:00Z"),
      booking("Nissan Note", "2026-11-08T08:00:00Z", "2026-11-12T08:00:00Z"),
    ];
    expect(peakBookings(notes, "Nissan Note", d("2026-11-03T08:00:00Z"), d("2026-11-10T08:00:00Z"))).toBe(1);
    expect(isCarAvailable(notes, "Nissan Note", 2, d("2026-11-03T08:00:00Z"), d("2026-11-10T08:00:00Z"))).toBe(true);
    // A third, long booking takes the free unit: now both are out at once.
    const busier = [...notes, booking("Nissan Note", "2026-11-03T08:00:00Z", "2026-11-10T08:00:00Z")];
    expect(isCarAvailable(busier, "Nissan Note", 2, d("2026-11-04T08:00:00Z"), d("2026-11-09T08:00:00Z"))).toBe(false);
  });

  it("an open booking without drop-off blocks one day", () => {
    const jimny = [booking("Suzuki Jimny", "2026-09-10", "2026-09-14")];
    expect(isCarAvailable(jimny, "Suzuki Jimny", 1, d("2026-09-13"), null)).toBe(false);
  });

  it("a model with 0 units is never bookable", () => {
    expect(isCarAvailable([], "Honda Fit", 0, d("2026-09-13"), d("2026-09-14"))).toBe(false);
  });
});

describe("unitsOf", () => {
  it("defaults to one unit for a model with no quantity set", () => {
    expect(unitsOf({ "Nissan March": 7 }, "Nissan March")).toBe(7);
    expect(unitsOf({ "Nissan March": 7 }, "Toyota Vitz")).toBe(1);
  });
});

describe("fullyBookedUntil (the car card badge)", () => {
  const now = d("2026-12-11T10:00:00Z");

  it("shows nothing while a unit is free", () => {
    const six = times(6, booking("Nissan March", "2026-12-10T07:00:00Z", "2026-12-12T07:00:00Z"));
    expect(fullyBookedUntil(six, "Nissan March", 7, now)).toBeUndefined();
  });

  it("gives the moment the first unit comes back when all are out", () => {
    const out = [
      booking("Nissan Note", "2026-12-10T07:00:00Z", "2026-12-13T07:00:00Z"),
      booking("Nissan Note", "2026-12-09T07:00:00Z", "2026-12-12T07:00:00Z"),
    ];
    expect(fullyBookedUntil(out, "Nissan Note", 2, now)?.toISOString()).toBe("2026-12-12T07:00:00.000Z");
  });

  it("skips a return that is immediately booked again", () => {
    const chained = [
      booking("Suzuki Jimny", "2026-12-10T07:00:00Z", "2026-12-12T07:00:00Z"),
      booking("Suzuki Jimny", "2026-12-12T07:00:00Z", "2026-12-15T07:00:00Z"),
    ];
    expect(fullyBookedUntil(chained, "Suzuki Jimny", 1, now)?.toISOString()).toBe("2026-12-15T07:00:00.000Z");
  });

  it("is null (no end) for a model with 0 units", () => {
    expect(fullyBookedUntil([], "Honda Fit", 0, now)).toBeNull();
  });

  it("fullyBookedNow lists only the cars with every unit out, by id", () => {
    const availability = {
      quantities: { "Nissan March": 7, "Suzuki Jimny": 1 },
      bookings: [
        { carName: "Nissan March", start: d("2026-12-10T07:00:00Z").getTime(), end: d("2026-12-12T07:00:00Z").getTime() },
        { carName: "Suzuki Jimny", start: d("2026-12-10T07:00:00Z").getTime(), end: d("2026-12-12T07:00:00Z").getTime() },
      ],
    };
    const cars = [
      { id: "nissan-march", name: "Nissan March" },
      { id: "suzuki-jimny", name: "Suzuki Jimny" },
    ];
    expect(fullyBookedNow(availability, cars, now)).toEqual({ "suzuki-jimny": "2026-12-12T07:00:00.000Z" });
  });
});
