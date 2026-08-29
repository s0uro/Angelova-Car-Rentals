"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import {
  RESERVATION_STATUSES,
  type ReservationStatus,
} from "@/app/lib/reservation-status";

export type UpdateStatusResult = { ok: true } | { ok: false; error: string };

export async function updateReservationStatus(
  id: string,
  status: string
): Promise<UpdateStatusResult> {
  const session = await getSession();
  if (!session?.userId) {
    return { ok: false, error: "Your session has expired. Please sign in again." };
  }
  if (!RESERVATION_STATUSES.includes(status as ReservationStatus)) {
    return { ok: false, error: "Invalid status." };
  }
  if (typeof id !== "string" || id.length === 0 || id.length > 64) {
    return { ok: false, error: "Invalid reservation." };
  }

  try {
    await prisma.reservation.update({ where: { id }, data: { status } });
  } catch (error) {
    console.error("updateReservationStatus failed:", error);
    return { ok: false, error: "Could not update the status. Please try again." };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  revalidatePath("/fleet");
  return { ok: true };
}
