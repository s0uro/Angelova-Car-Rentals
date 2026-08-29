import { describe, expect, it } from "vitest";
import {
  effectiveDropoff,
  rangesOverlap,
  findConflictingBooking,
  getBookedUntil,
  type BookedRange,
} from "@/app/lib/availability-core";

const d = (iso: string) => new Date(iso);

function booking(carName: string, from: string, to: string): BookedRange {
  return { carName, pickupDate: d(from), dropoffDate: d(to) };
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

describe("findConflictingBooking", () => {
  const bookings = [booking("Nissan March", "2026-09-10", "2026-09-14")];

  it("ignores a different car", () => {
    expect(findConflictingBooking(bookings, "Toyota Vitz", d("2026-09-11"), d("2026-09-12"))).toBeUndefined();
  });

  it("finds a booking inside an existing range", () => {
    expect(findConflictingBooking(bookings, "Nissan March", d("2026-09-11"), d("2026-09-12"))).toBeDefined();
  });

  it("allows a booking that starts on the drop-off day", () => {
    expect(findConflictingBooking(bookings, "Nissan March", d("2026-09-14"), d("2026-09-16"))).toBeUndefined();
  });

  it("catches an open booking whose implied day overlaps", () => {
    expect(findConflictingBooking(bookings, "Nissan March", d("2026-09-13"), null)).toBeDefined();
  });
});

describe("getBookedUntil", () => {
  const bookings = [booking("Mazda Demio", "2026-09-10", "2026-09-14")];

  it("returns the free-up date while the car is out", () => {
    expect(getBookedUntil(bookings, "Mazda Demio", d("2026-09-12"))?.toISOString()).toBe(
      d("2026-09-14").toISOString()
    );
  });

  it("returns nothing before the booking starts", () => {
    expect(getBookedUntil(bookings, "Mazda Demio", d("2026-09-01"))).toBeUndefined();
  });
});
