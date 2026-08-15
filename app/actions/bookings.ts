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
  const carName = String(formData.get("carName") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const surname = String(formData.get("surname") ?? "").trim();
  const ageRaw = String(formData.get("age") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const pickupDateRaw = String(formData.get("pickupDate") ?? "");
  const dropoffDateRaw = String(formData.get("dropoffDate") ?? "");
  const pickupLocation = String(formData.get("pickupLocation") ?? "").trim();
  const dropoffLocation = String(formData.get("dropoffLocation") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const agreedToTerms = formData.get("agreedToTerms") === "on";

  const errors: Record<string, string> = {};
  const MIN_AGE = 25;

  if (type !== "car" && type !== "taxi") {
    errors.type = "Please choose a service type.";
  }
  if (type === "car" && !carName) {
    errors.carName = "Please select a car.";
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

  if (!name) {
    errors.name = "Name is required.";
  }
  if (!surname) {
    errors.surname = "Surname is required.";
  }
  const age = Number(ageRaw);
  if (!ageRaw || Number.isNaN(age) || !Number.isInteger(age)) {
    errors.age = "Age is required.";
  } else if (age < MIN_AGE) {
    errors.age = `You must be at least ${MIN_AGE} years old to book.`;
  }
  if (!phone) {
    errors.phone = "Phone number is required.";
  }

  if (!agreedToTerms) {
    errors.agreedToTerms = "You must agree to the terms to continue.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  await prisma.reservation.create({
    data: {
      type,
      carName: carName || null,
      name,
      surname,
      age,
      phone,
      email: email || null,
      pickupDate: pickupDate as Date,
      dropoffDate: dropoffDate,
      pickupLocation,
      dropoffLocation: dropoffLocation || null,
      notes: notes || null,
      agreedToTerms,
    },
  });

  return { success: true };
}
