import { z } from "zod";
import { fleet } from "@/app/lib/fleet-data";
import { pafosAreas } from "@/app/lib/site-config";

// Single source of truth for booking validation. BookingForm uses the
// per-step pickers below for instant feedback; createReservation runs the
// full schema so nothing can bypass the client.

export const MIN_AGE = 25;
export const MAX_AGE = 99;
export const MAX_RENTAL_DAYS = 60;
export const MIN_RENTAL_HOURS = 1;
/** Pickups may be up to this far in the past (clock skew / "right now"). */
export const PAST_GRACE_MS = 60 * 60 * 1000;

const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * MS_PER_HOUR;

const carNames = fleet.map((c) => c.name);

const trimmed = (max: number, label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be at most ${max} characters.`);

const isoDate = z
  .string()
  .datetime({ offset: true, message: "A valid date/time is required." });

export const reservationSchema = z
  .object({
    type: z.enum(["car", "taxi"], { message: "Please choose a service type." }),
    carName: z.string().trim().max(80).default(""),
    pickupDate: isoDate,
    dropoffDate: isoDate.or(z.literal("")).default(""),
    pickupLocation: z
      .string()
      .trim()
      .min(1, "Pickup location is required.")
      .refine((v) => pafosAreas.includes(v), "Please choose a pickup area from the list."),
    dropoffLocation: z
      .string()
      .trim()
      .max(80)
      .default("")
      .refine(
        (v) => v === "" || pafosAreas.includes(v),
        "Please choose a drop-off area from the list."
      ),
    notes: z.string().trim().max(500, "Notes must be at most 500 characters.").default(""),
    name: trimmed(60, "First name"),
    surname: trimmed(60, "Surname"),
    age: z.coerce
      .number({ message: "Age is required." })
      .int("Age must be a whole number.")
      .min(MIN_AGE, `You must be at least ${MIN_AGE} years old to book.`)
      .max(MAX_AGE, "Please enter a valid age."),
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required.")
      .transform((v) => v.replace(/[\s().-]/g, ""))
      .refine((v) => /^\+?\d{6,15}$/.test(v), "Please enter a valid phone number."),
    email: z
      .string()
      .trim()
      .max(120)
      .default("")
      .refine(
        (v) => v === "" || z.string().email().safeParse(v).success,
        "Please enter a valid email address."
      ),
    agreedToTerms: z.literal(true, {
      message: "You must agree to the terms to continue.",
    }),
  })
  .superRefine((v, ctx) => {
    const pickup = new Date(v.pickupDate).getTime();
    const now = Date.now();

    if (pickup < now - PAST_GRACE_MS) {
      ctx.addIssue({
        code: "custom",
        path: ["pickupDate"],
        message: "Pickup date must be in the future.",
      });
    }

    if (v.type === "car") {
      if (!v.carName) {
        ctx.addIssue({ code: "custom", path: ["carName"], message: "Please select a car." });
      } else if (!carNames.includes(v.carName)) {
        ctx.addIssue({
          code: "custom",
          path: ["carName"],
          message: "Please choose a car from the list.",
        });
      }
      if (!v.dropoffDate) {
        ctx.addIssue({
          code: "custom",
          path: ["dropoffDate"],
          message: "Drop-off date & time is required for car rentals.",
        });
      }
    } else {
      // Taxi: destination is mandatory, no return time.
      if (!v.dropoffLocation) {
        ctx.addIssue({
          code: "custom",
          path: ["dropoffLocation"],
          message: "Destination is required for a taxi.",
        });
      }
    }

    if (v.dropoffDate) {
      const dropoff = new Date(v.dropoffDate).getTime();
      if (dropoff < pickup + MIN_RENTAL_HOURS * MS_PER_HOUR) {
        ctx.addIssue({
          code: "custom",
          path: ["dropoffDate"],
          message: "Drop-off must be at least 1 hour after pickup.",
        });
      } else if (dropoff - pickup > MAX_RENTAL_DAYS * MS_PER_DAY) {
        ctx.addIssue({
          code: "custom",
          path: ["dropoffDate"],
          message: `Rentals longer than ${MAX_RENTAL_DAYS} days — please contact us for a quote.`,
        });
      }
    }
  });

export type ReservationInput = z.infer<typeof reservationSchema>;

/** Flatten zod issues to the { field: message } shape the UI renders. */
export function issuesToErrors(issues: z.ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Keys the client validates on each step (server always validates all). */
export const STEP_FIELDS: Record<1 | 2 | 3, (keyof ReservationInput)[]> = {
  1: ["type", "carName", "pickupDate", "dropoffDate", "pickupLocation", "dropoffLocation"],
  2: ["name", "surname", "age", "phone", "email"],
  3: ["notes", "agreedToTerms"],
};
