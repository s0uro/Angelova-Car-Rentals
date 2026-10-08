"use server";

import { inspect } from "node:util";
import { prisma } from "@/app/lib/prisma";
import { isExclusionViolation } from "@/app/lib/db-errors";
import { getActiveCarBookings, findConflictingBooking } from "@/app/lib/availability";
import { reservationSchema, issuesToErrors } from "@/app/lib/booking-schema";
import { checkRateLimit } from "@/app/lib/rate-limit";

const CONFLICT_MESSAGE =
  "This car is already booked for the selected dates. Please choose different dates or another car.";
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

  // Rate-limit only well-formed requests: counting validation failures and
  // "already booked" answers locked out real customers trying other dates.
  if (!(await checkRateLimit("booking"))) {
    return {
      errors: {
        form: "Too many booking requests from your connection. Please try again later or call us.",
      },
    };
  }

  const v = parsed.data;
  const pickupDate = new Date(v.pickupDate);
  const dropoffDate = v.dropoffDate ? new Date(v.dropoffDate) : null;
  const carName = v.type === "car" ? v.carName : null;

  // --- Availability (app-level; the DB constraint is the final guard) -------
  if (carName) {
    const activeBookings = await getActiveCarBookings();
    if (findConflictingBooking(activeBookings, carName, pickupDate, dropoffDate)) {
      return { errors: { carName: CONFLICT_MESSAGE } };
    }
  }

  // --- Persist --------------------------------------------------------------
  try {
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
        dropoffLocation: v.dropoffLocation || null,
        passengers: v.type === "taxi" ? (v.passengers ?? null) : null,
        notes: v.notes || null,
        agreedToTerms: true,
      },
      select: { id: true },
    });

    return { success: true, reference: created.id.slice(-8).toUpperCase() };
  } catch (error) {
    // Two people submitting the same car/dates at the same instant: the
    // exclusion constraint (see prisma/migrations) rejects the second one.
    if (isExclusionViolation(error)) {
      return { errors: { carName: CONFLICT_MESSAGE } };
    }
    console.error("createReservation failed:", inspect(error, { depth: null }));
    return { errors: { form: GENERIC_ERROR } };
  }
}
