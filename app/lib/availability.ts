import "server-only";
import { prisma } from "@/app/lib/prisma";

export type BookedRange = {
  carName: string;
  pickupDate: Date;
  dropoffDate: Date;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// A missing drop-off (e.g. a one-way/open booking) blocks at least one day.
function effectiveDropoff(pickupDate: Date, dropoffDate: Date | null): Date {
  if (dropoffDate && dropoffDate > pickupDate) return dropoffDate;
  return new Date(pickupDate.getTime() + MS_PER_DAY);
}

export function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

// First reservation wins: any car reservation that hasn't been rejected
// blocks its dates, from the moment it's submitted (not just once an admin
// confirms it). This is what lets us tell a second customer "not available"
// instead of allowing two people to book the same car for the same dates.
export async function getActiveCarBookings(): Promise<BookedRange[]> {
  const rows = await prisma.reservation.findMany({
    where: { type: "car", status: { not: "rejected" }, carName: { not: null } },
    select: { carName: true, pickupDate: true, dropoffDate: true },
  });

  return rows.map((row) => ({
    carName: row.carName as string,
    pickupDate: row.pickupDate,
    dropoffDate: effectiveDropoff(row.pickupDate, row.dropoffDate),
  }));
}

export function isCarBookedNow(
  bookings: BookedRange[],
  carName: string,
  now: Date = new Date()
): boolean {
  return bookings.some(
    (b) => b.carName === carName && b.pickupDate <= now && now < b.dropoffDate
  );
}

// The date the car's current booking frees up, if it's booked right now.
export function getBookedUntil(
  bookings: BookedRange[],
  carName: string,
  now: Date = new Date()
): Date | undefined {
  return bookings.find(
    (b) => b.carName === carName && b.pickupDate <= now && now < b.dropoffDate
  )?.dropoffDate;
}

export function findConflictingBooking(
  bookings: BookedRange[],
  carName: string,
  pickupDate: Date,
  dropoffDate: Date | null
): BookedRange | undefined {
  const end = effectiveDropoff(pickupDate, dropoffDate);
  return bookings.find(
    (b) =>
      b.carName === carName &&
      rangesOverlap(pickupDate, end, b.pickupDate, b.dropoffDate)
  );
}
