"use server";

import { prisma } from "@/app/lib/prisma";

export type BookingState =
  | {
      errors?: Record<string, string>;
      success?: boolean;
    }
  | undefined;

export async function createReservation(
  _prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const type = String(formData.get("type") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const pickupDateRaw = String(formData.get("pickupDate") ?? "");
  const dropoffDateRaw = String(formData.get("dropoffDate") ?? "");
  const pickupLocation = String(formData.get("pickupLocation") ?? "").trim();
  const dropoffLocation = String(formData.get("dropoffLocation") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  const errors: Record<string, string> = {};

  if (type !== "car" && type !== "taxi") {
    errors.type = "Please choose a service type.";
  }
  if (!name) {
    errors.name = "Name is required.";
  }
  if (!phone) {
    errors.phone = "Phone number is required.";
  }
  if (!pickupLocation) {
    errors.pickupLocation = "Pickup location is required.";
  }

  const pickupDate = pickupDateRaw ? new Date(pickupDateRaw) : null;
  if (!pickupDate || Number.isNaN(pickupDate.getTime())) {
    errors.pickupDate = "A valid pickup date/time is required.";
  }

  let dropoffDate: Date | null = null;
  if (dropoffDateRaw) {
    dropoffDate = new Date(dropoffDateRaw);
    if (Number.isNaN(dropoffDate.getTime())) {
      errors.dropoffDate = "Drop-off date/time is invalid.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  await prisma.reservation.create({
    data: {
      type,
      name,
      phone,
      email: email || null,
      pickupDate: pickupDate as Date,
      dropoffDate: dropoffDate,
      pickupLocation,
      dropoffLocation: dropoffLocation || null,
      notes: notes || null,
    },
  });

  return { success: true };
}
