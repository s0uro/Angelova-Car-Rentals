"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import { fleet } from "@/app/lib/fleet-data";
import { MAX_UNITS } from "@/app/lib/availability-core";

export type AdminActionResult = { ok: true } | { ok: false; error: string };

async function requireSession(): Promise<AdminActionResult | null> {
  const session = await getSession();
  if (!session?.userId) {
    return { ok: false, error: "Your session has expired. Please sign in again." };
  }
  return null;
}

function validId(id: unknown): id is string {
  return typeof id === "string" && id.length > 0 && id.length <= 64;
}

export async function saveAdminNotes(id: string, notes: string): Promise<AdminActionResult> {
  const denied = await requireSession();
  if (denied) return denied;
  if (!validId(id)) return { ok: false, error: "Invalid reservation." };
  const text = String(notes ?? "").slice(0, 2000);
  try {
    await prisma.reservation.update({
      where: { id },
      data: { adminNotes: text.trim() === "" ? null : text },
    });
  } catch (error) {
    console.error("saveAdminNotes failed:", error);
    return { ok: false, error: "Could not save the note. Please try again." };
  }
  revalidatePath(`/admin/reservations/${id}`);
  return { ok: true };
}

export async function markContacted(id: string, contacted: boolean): Promise<AdminActionResult> {
  const denied = await requireSession();
  if (denied) return denied;
  if (!validId(id)) return { ok: false, error: "Invalid reservation." };
  try {
    await prisma.reservation.update({
      where: { id },
      data: { contactedAt: contacted ? new Date() : null },
    });
  } catch (error) {
    console.error("markContacted failed:", error);
    return { ok: false, error: "Could not update. Please try again." };
  }
  revalidatePath(`/admin/reservations/${id}`);
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

/** How many units of a model the fleet has (CarModel.quantity). */
export async function updateCarQuantity(carName: string, quantity: number): Promise<AdminActionResult> {
  const denied = await requireSession();
  if (denied) return denied;
  if (typeof carName !== "string" || !fleet.some((car) => car.name === carName)) {
    return { ok: false, error: "Unknown car." };
  }
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > MAX_UNITS) {
    return { ok: false, error: `Enter a whole number from 0 to ${MAX_UNITS}.` };
  }
  try {
    await prisma.carModel.upsert({
      where: { name: carName },
      update: { quantity },
      create: { name: carName, quantity },
    });
  } catch (error) {
    console.error("updateCarQuantity failed:", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
  // The fully-booked badges and the booking form read it.
  revalidatePath("/");
  revalidatePath("/fleet");
  revalidatePath("/admin/fleet");
  return { ok: true };
}
