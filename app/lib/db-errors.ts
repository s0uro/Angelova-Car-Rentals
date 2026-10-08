import { Prisma } from "@/app/generated/prisma/client";

/**
 * True when a write was rejected by the `no_overlapping_car_bookings`
 * exclusion constraint (see prisma/migrations), i.e. the car is already
 * booked for overlapping dates.
 */
export function isExclusionViolation(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const meta = JSON.stringify(error.meta ?? {});
    return error.code === "P2004" || meta.includes("no_overlapping_car_bookings");
  }
  // Driver-level error (pg code 23P01 = exclusion_violation).
  const e = error as { code?: string; constraint?: string; message?: string } | null;
  return (
    e?.code === "23P01" ||
    e?.constraint === "no_overlapping_car_bookings" ||
    Boolean(e?.message?.includes("no_overlapping_car_bookings"))
  );
}
