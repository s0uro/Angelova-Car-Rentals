// Pure availability helpers — safe to import from client components.
// The DB-backed functions live in availability.ts (server-only).

export type BookedRange = {
  carName: string;
  pickupDate: Date;
  dropoffDate: Date;
};

export const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** How long an unconfirmed ("new") reservation blocks a car before it expires. */
export const PENDING_HOLD_HOURS = 48;

/** Statuses that block a car's dates. Everything else (rejected, expired) frees them. */
export const BLOCKING_STATUSES = ["new", "confirmed"] as const;

// A missing drop-off (e.g. a one-way/open booking) blocks at least one day.
export function effectiveDropoff(pickupDate: Date, dropoffDate: Date | null): Date {
  if (dropoffDate && dropoffDate > pickupDate) return dropoffDate;
  return new Date(pickupDate.getTime() + MS_PER_DAY);
}

export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function isCarBookedNow(bookings: BookedRange[], carName: string, now: Date = new Date()): boolean {
  return bookings.some((b) => b.carName === carName && b.pickupDate <= now && now < b.dropoffDate);
}

// The date the car's current booking frees up, if it's booked right now.
export function getBookedUntil(bookings: BookedRange[], carName: string, now: Date = new Date()): Date | undefined {
  return bookings.find((b) => b.carName === carName && b.pickupDate <= now && now < b.dropoffDate)?.dropoffDate;
}

export function findConflictingBooking(
  bookings: BookedRange[],
  carName: string,
  pickupDate: Date,
  dropoffDate: Date | null
): BookedRange | undefined {
  const end = effectiveDropoff(pickupDate, dropoffDate);
  return bookings.find((b) => b.carName === carName && rangesOverlap(pickupDate, end, b.pickupDate, b.dropoffDate));
}

/** All future/current blocked ranges for one car, soonest first. */
export function getCarBookings(bookings: BookedRange[], carName: string): BookedRange[] {
  return bookings
    .filter((b) => b.carName === carName)
    .sort((a, b) => a.pickupDate.getTime() - b.pickupDate.getTime());
}
