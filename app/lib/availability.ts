import "server-only";
import { prisma } from "@/app/lib/prisma";
import {
  type BookedRange,
  type FleetAvailability,
  EMPTY_AVAILABILITY,
  MS_PER_DAY,
  PENDING_HOLD_HOURS,
  effectiveDropoff,
} from "@/app/lib/availability-core";

export * from "@/app/lib/availability-core";

/**
 * "First reservation wins": a car reservation blocks its dates from the moment
 * it's submitted. To stop fake/abandoned submissions blocking the fleet
 * forever, an unconfirmed reservation only holds the car for
 * PENDING_HOLD_HOURS; after that it is marked `expired` and frees the dates.
 * Accepting it in the admin (status = confirmed) keeps the hold indefinitely.
 */
export async function expireStaleReservations(): Promise<number> {
  const cutoff = new Date(Date.now() - PENDING_HOLD_HOURS * 60 * 60 * 1000);
  const result = await prisma.reservation.updateMany({
    where: { type: "car", status: "new", createdAt: { lt: cutoff } },
    data: { status: "expired" },
  });
  return result.count as number;
}

/**
 * Car reservations that currently block dates and are still relevant
 * (ending now or in the future). Past bookings are not loaded. Throws if the
 * database can't be read.
 */
export async function loadActiveCarBookings(): Promise<BookedRange[]> {
  await expireStaleReservations();

  const now = new Date();
  const rows: { carName: string | null; pickupDate: Date; dropoffDate: Date | null }[] =
    await prisma.reservation.findMany({
      where: {
        type: "car",
        status: { in: ["new", "confirmed"] },
        carName: { not: null },
        OR: [
          { dropoffDate: { gte: now } },
          { dropoffDate: null, pickupDate: { gte: new Date(now.getTime() - MS_PER_DAY) } },
        ],
      },
      select: { carName: true, pickupDate: true, dropoffDate: true },
    });

  return rows.map((row) => ({
    carName: row.carName as string,
    pickupDate: row.pickupDate,
    dropoffDate: effectiveDropoff(row.pickupDate, row.dropoffDate),
  }));
}

/** Units per car name, as set in /admin/fleet. Throws if the database can't be read. */
export async function loadCarQuantities(): Promise<Record<string, number>> {
  const rows: { name: string; quantity: number }[] = await prisma.carModel.findMany({
    select: { name: true, quantity: true },
  });
  return Object.fromEntries(rows.map((row) => [row.name, row.quantity]));
}

/**
 * Bookings and fleet counts for the public pages. Never throws: at build time
 * (no DB) or when the database can't be read, every car shows as available.
 * That only affects what is displayed: createReservation re-checks every
 * booking and the database trigger refuses anything over capacity.
 */
export async function getFleetAvailability(): Promise<FleetAvailability> {
  if (!process.env.DATABASE_URL) return EMPTY_AVAILABILITY;

  try {
    const [bookings, quantities] = await Promise.all([loadActiveCarBookings(), loadCarQuantities()]);
    return {
      quantities,
      bookings: bookings.map((b) => ({
        carName: b.carName,
        start: b.pickupDate.getTime(),
        end: b.dropoffDate.getTime(),
      })),
    };
  } catch (error) {
    console.error("Could not load car availability:", error);
    return EMPTY_AVAILABILITY;
  }
}

/**
 * The database refused a booking because every unit of the model is already
 * out for those dates (the enforce_car_capacity trigger, see prisma/migrations).
 */
export function isCarCapacityError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const { message, meta } = error as { message?: unknown; meta?: unknown };
  let details = "";
  try {
    details = JSON.stringify(meta ?? null);
  } catch {
    // unserialisable meta: the message alone decides
  }
  return `${String(message ?? "")} ${details}`.includes("car_fully_booked");
}
