import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/app/lib/site-config";
import { buildBookingEmail, type BookingEmailData } from "@/app/lib/booking-email";

// onboarding@resend.dev works without a verified domain, but Resend only
// delivers it to the address that owns the Resend account. Set
// BOOKING_NOTIFY_FROM to an address on a verified domain for production.
const DEFAULT_FROM = "Angelova Bookings <onboarding@resend.dev>";

/**
 * Email the business about a new reservation. Never throws: the booking is
 * already saved, so a failed email must not turn into an error for the customer.
 */
export async function sendBookingNotification(booking: BookingEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; skipping booking notification email.");
    return;
  }

  const { subject, text, html } = buildBookingEmail(booking);
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.BOOKING_NOTIFY_FROM || DEFAULT_FROM,
      to: (process.env.BOOKING_NOTIFY_TO || siteConfig.email).split(",").map((s) => s.trim()),
      replyTo: booking.email || undefined,
      subject,
      text,
      html,
    });
    if (error) console.error("Booking notification email failed:", error);
  } catch (error) {
    console.error("Booking notification email failed:", error);
  }
}
