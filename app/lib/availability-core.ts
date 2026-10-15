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

/** Units of a model with no CarModel row (same default as the DB trigger). */
export const DEFAULT_UNITS = 1;
/** Highest quantity the admin accepts (CarModel_quantity_check in the DB). */
export const MAX_UNITS = 99;

/** Fleet counts and blocked ranges, in a shape a server page can hand to client components. */
export type FleetAvailability = {
  /** Units per car name; a missing name means DEFAULT_UNITS. */
  quantities: Record<string, number>;
  /** Blocked ranges as epoch milliseconds. */
  bookings: { carName: string; start: number; end: number }[];
};

export const EMPTY_AVAILABILITY: FleetAvailability = { quantities: {}, bookings: [] };

/**
 * Cars with every unit out right now, by car id: when the first unit is back
 * (ISO date), or null if none will be. Cars with a free unit are left out.
 * Worked out on the server so the car cards render the same on both sides.
 */
export type FullyBookedNow = Record<string, string | null>;

export function unitsOf(quantities: Record<string, number>, carName: string): number {
  return quantities[carName] ?? DEFAULT_UNITS;
}

export function toBookedRanges(availability: FleetAvailability): BookedRange[] {
  return availability.bookings.map((b) => ({
    carName: b.carName,
    pickupDate: new Date(b.start),
    dropoffDate: new Date(b.end),
  }));
}

// A missing drop-off (e.g. a one-way/open booking) blocks at least one day.
export function effectiveDropoff(pickupDate: Date, dropoffDate: Date | null): Date {
  if (dropoffDate && dropoffDate > pickupDate) return dropoffDate;
  return new Date(pickupDate.getTime() + MS_PER_DAY);
}

export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * The most bookings of `carName` out at the same moment within [start, end).
 * The count only goes up when a booking starts, so the start of the range and
 * every booking start inside it are the only moments worth checking. Same
 * algorithm as the enforce_car_capacity trigger in prisma/migrations.
 */
export function peakBookings(bookings: BookedRange[], carName: string, start: Date, end: Date): number {
  const overlapping = bookings.filter(
    (b) => b.carName === carName && rangesOverlap(start, end, b.pickupDate, b.dropoffDate)
  );
  let peak = 0;
  for (const b of overlapping) {
    const t = Math.max(b.pickupDate.getTime(), start.getTime());
    const out = overlapping.filter(
      (o) => o.pickupDate.getTime() <= t && t < o.dropoffDate.getTime()
    ).length;
    peak = Math.max(peak, out);
  }
  return peak;
}

/**
 * Can one more `carName` be booked from pickup to drop-off? Yes while, at the
 * busiest moment of that range, fewer than `units` of it are booked: with 7
 * Nissan March and one booked for 10–12 Dec, the other 6 stay bookable.
 */
export function isCarAvailable(
  bookings: BookedRange[],
  carName: string,
  units: number,
  pickupDate: Date,
  dropoffDate: Date | null
): boolean {
  const end = effectiveDropoff(pickupDate, dropoffDate);
  return peakBookings(bookings, carName, pickupDate, end) < units;
}

/**
 * When every unit of `carName` is out at `now`: the moment the first one is
 * free again, or null if none ever is (0 units). undefined while at least one
 * unit is free.
 */
export function fullyBookedUntil(
  bookings: BookedRange[],
  carName: string,
  units: number,
  now: Date = new Date()
): Date | null | undefined {
  const mine = bookings.filter((b) => b.carName === carName);
  const outAt = (t: number) =>
    mine.filter((b) => b.pickupDate.getTime() <= t && t < b.dropoffDate.getTime()).length;

  if (outAt(now.getTime()) < units) return undefined;
  const returns = mine
    .map((b) => b.dropoffDate.getTime())
    .filter((t) => t > now.getTime())
    .sort((a, b) => a - b);
  for (const t of returns) {
    if (outAt(t) < units) return new Date(t);
  }
  return null;
}

export function fullyBookedNow(
  availability: FleetAvailability,
  cars: { id: string; name: string }[],
  now: Date = new Date()
): FullyBookedNow {
  const bookings = toBookedRanges(availability);
  const result: FullyBookedNow = {};
  for (const car of cars) {
    const until = fullyBookedUntil(bookings, car.name, unitsOf(availability.quantities, car.name), now);
    if (until !== undefined) result[car.id] = until === null ? null : until.toISOString();
  }
  return result;
}
