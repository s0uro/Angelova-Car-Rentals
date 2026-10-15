"use server";

import { inspect } from "node:util";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import {
  loadActiveCarBookings,
  loadCarQuantities,
  isCarAvailable,
  isCarCapacityError,
  unitsOf,
} from "@/app/lib/availability";
import { reservationSchema, issuesToErrors, fullyBookedMessage } from "@/app/lib/booking-schema";
import { quoteBooking } from "@/app/lib/quote";
import { checkRateLimit } from "@/app/lib/rate-limit";
import { sendBookingNotification, sendBookingConfirmation } from "@/app/lib/email";

const GENERIC_ERROR =
  "Something went wrong while saving your booking. Please try again or call us.";

/** Bots fill forms instantly; humans need at least this long. */
const MIN_FILL_TIME_MS = 3000;

export type BookingState =
  | {
      errors?: Record<string, string>;
      success?: boolean;
      reference?: string;
    }
  | undefined;

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

export async function createReservation(
  _prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  // --- Abuse protection -----------------------------------------------------
  // Honeypot: real users never see or fill this field.
  if (str(formData, "website").trim() !== "") {
    return { success: true, reference: "PENDING" };
  }
  const startedAt = Number(str(formData, "formStartedAt"));
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return { errors: { form: "Please take a moment to review the form, then submit again." } };
  }
  if (!(await checkRateLimit("booking"))) {
    return {
      errors: {
        form: "Too many booking requests from your connection. Please try again later or call us.",
      },
    };
  }

  // --- Validation -----------------------------------------------------------
  const parsed = reservationSchema.safeParse({
    type: str(formData, "type"),
    carName: str(formData, "carName"),
    pickupDate: str(formData, "pickupDate"),
    dropoffDate: str(formData, "dropoffDate"),
    pickupLocation: str(formData, "pickupLocation"),
    dropoffLocation: str(formData, "dropoffLocation"),
    passengers: str(formData, "passengers"),
    notes: str(formData, "notes"),
    name: str(formData, "name"),
    surname: str(formData, "surname"),
    age: str(formData, "age"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    agreedToTerms: formData.get("agreedToTerms") === "on",
  });

  if (!parsed.success) {
    return { errors: issuesToErrors(parsed.error.issues) };
  }

  const v = parsed.data;
  const pickupDate = new Date(v.pickupDate);
  const dropoffDate = v.dropoffDate ? new Date(v.dropoffDate) : null;
  const carName = v.type === "car" ? v.carName : null;
  const passengers = v.type === "taxi" ? (v.passengers ?? null) : null;
  const dropoffLocation = v.dropoffLocation || null;

  // Priced here, never taken from the form: a taxi only gets a fixed price
  // when it starts in Kato Paphos, otherwise it is saved with price null.
  const { price, days } = quoteBooking({
    type: v.type,
    carName,
    pickupDate,
    dropoffDate,
    pickupLocation: v.pickupLocation,
    dropoffLocation,
    passengers,
  });

  try {
    // --- Availability (app-level; the DB trigger is the final guard) --------
    if (carName) {
      const [activeBookings, quantities] = await Promise.all([
        loadActiveCarBookings(),
        loadCarQuantities(),
      ]);
      const units = unitsOf(quantities, carName);
      if (!isCarAvailable(activeBookings, carName, units, pickupDate, dropoffDate)) {
        return { errors: { carName: fullyBookedMessage(carName) } };
      }
    }

    // --- Persist ------------------------------------------------------------
    const created: { id: string } = await prisma.reservation.create({
      data: {
        type: v.type,
        carName,
        name: v.name,
        surname: v.surname,
        age: v.age,
        phone: v.phone,
        email: v.email || null,
        pickupDate,
        dropoffDate,
        pickupLocation: v.pickupLocation,
        dropoffLocation,
        passengers,
        notes: v.notes || null,
        agreedToTerms: true,
        price,
      },
      select: { id: true },
    });

    // Availability badges on the public pages changed.
    revalidatePath("/");
    revalidatePath("/fleet");

    const reference = created.id.slice(-8).toUpperCase();
    const notification = {
      reference,
      type: v.type,
      carName,
      name: v.name,
      surname: v.surname,
      phone: v.phone,
      email: v.email || null,
      pickupDate,
      dropoffDate,
      pickupLocation: v.pickupLocation,
      dropoffLocation,
      passengers,
      notes: v.notes || null,
      price,
      days,
    };
    await sendBookingNotification(notification);
    await sendBookingConfirmation(notification);

    return { success: true, reference };
  } catch (error) {
    // Two people booking the last unit at the same instant: the capacity
    // trigger (see prisma/migrations) rejects the second one.
    if (carName && isCarCapacityError(error)) {
      return { errors: { carName: fullyBookedMessage(carName) } };
    }
    console.error("createReservation failed:", inspect(error, { depth: null }));
    return { errors: { form: GENERIC_ERROR } };
  }
}
