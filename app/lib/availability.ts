import "server-only";
import { prisma } from "@/app/lib/prisma";
import {
  type BookedRange,
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
 * (ending now or in the future). Past bookings are not loaded.
 */
export async function getActiveCarBookings(): Promise<BookedRange[]> {
  // At build time (no DB) render as "all available" instead of failing.
  if (!process.env.DATABASE_URL) return [];

  try {
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
  } catch (error) {
    console.error("Could not load car availability:", error);
    return [];
  }
}
