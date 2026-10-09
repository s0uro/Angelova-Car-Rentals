import { Resend } from "resend";
import { siteConfig } from "@/app/lib/site-config";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Sent from the verified angelovacarrentals.com domain in Resend. The shared
// sandbox address (onboarding@resend.dev) only delivers to the Resend
// account's own inbox, so customer receipts never arrived with it.
const FROM = "Angelova Car Rentals <bookings@angelovacarrentals.com>";

export type BookingNotification = {
  reference: string;
  type: "car" | "taxi";
  carName: string | null;
  name: string;
  surname: string;
  phone: string;
  email: string | null;
  pickupDate: Date;
  dropoffDate: Date | null;
  pickupLocation: string;
  dropoffLocation: string | null;
  passengers: number | null;
  notes: string | null;
};

function formatDate(d: Date): string {
  return d.toLocaleString("en-GB", {
    timeZone: "Asia/Nicosia",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function summaryLines(booking: BookingNotification): string[] {
  return [
    `Reference: ${booking.reference}`,
    booking.type === "car" ? `Car rental — ${booking.carName}` : "Taxi transfer",
    `Name: ${booking.name} ${booking.surname}`,
    `Phone: ${booking.phone}`,
    booking.email ? `Email: ${booking.email}` : null,
    `Pickup: ${formatDate(booking.pickupDate)} — ${booking.pickupLocation}`,
    booking.dropoffDate ? `Drop-off: ${formatDate(booking.dropoffDate)}` : null,
    booking.dropoffLocation ? `Destination: ${booking.dropoffLocation}` : null,
    booking.passengers ? `Passengers: ${booking.passengers}` : null,
    booking.notes ? `Notes: ${booking.notes}` : null,
  ].filter((line): line is string => Boolean(line));
}

/** Fire-and-log: a failed notification must never fail the booking itself. */
export async function sendBookingNotification(booking: BookingNotification): Promise<void> {
  if (!resend) {
    console.error("sendBookingNotification: RESEND_API_KEY is not set, skipping email.");
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: siteConfig.email,
      subject: `New booking — ${booking.type === "car" ? booking.carName : "Taxi"} (${booking.reference})`,
      text: summaryLines(booking).join("\n"),
    });
    if (error) {
      console.error("sendBookingNotification failed:", error);
    }
  } catch (error) {
    console.error("sendBookingNotification failed:", error);
  }
}

/**
 * Receipt-style email to the customer. The booking form requires an email,
 * but older reservations may not have one. Fire-and-log, same as
 * sendBookingNotification -- must never fail the booking itself.
 */
export async function sendBookingConfirmation(booking: BookingNotification): Promise<void> {
  if (!resend || !booking.email) return;

  const text = [
    `Hi ${booking.name},`,
    "",
    `Thanks for booking with ${siteConfig.shortName}. We've received your request below and will contact you shortly to confirm it.`,
    "",
    ...summaryLines(booking),
    "",
    `Questions in the meantime? Call us at ${booking.type === "taxi" ? siteConfig.phone2 : siteConfig.phone} or reply to this email.`,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: booking.email,
      subject: `Booking received — ${siteConfig.shortName} (${booking.reference})`,
      text,
    });
    if (error) {
      console.error("sendBookingConfirmation failed:", error);
    }
  } catch (error) {
    console.error("sendBookingConfirmation failed:", error);
  }
}
