"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import {
  RESERVATION_STATUSES,
  type ReservationStatus,
} from "@/app/lib/reservation-status";

export async function updateReservationStatus(id: string, status: string) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error("Unauthorized");
  }
  if (!RESERVATION_STATUSES.includes(status as ReservationStatus)) {
    throw new Error("Invalid status");
  }

  await prisma.reservation.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  revalidatePath("/fleet");
}
