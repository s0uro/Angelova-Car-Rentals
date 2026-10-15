import { quoteRental } from "@/app/lib/pricing";
import {
  FIXED_FARE_PICKUP,
  OTHER_DESTINATION,
  getRouteByDestination,
  getTransferPrice,
} from "@/app/lib/taxi-data";

// One price for a booking, wherever it is shown: the server stores it with the
// reservation, the emails and the admin read it back. The booking form shows
// the customer the same numbers through quoteRental / getTransferPrice.

export type BookingQuote = {
  /** EUR. null = to be confirmed by phone. */
  price: number | null;
  /** Billable days of a car rental (2-hour grace rule); null for a taxi. */
  days: number | null;
};

type QuotableBooking = {
  type: string;
  carName: string | null;
  pickupDate: Date;
  dropoffDate: Date | null;
  pickupLocation: string;
  dropoffLocation: string | null;
  passengers: number | null;
};

export function quoteBooking(b: QuotableBooking): BookingQuote {
  if (b.type === "taxi") {
    const price =
      b.dropoffLocation && b.passengers
        ? getTransferPrice(b.pickupLocation, b.dropoffLocation, b.passengers)
        : null;
    return { price, days: null };
  }
  const rental = b.carName ? quoteRental(b.carName, b.pickupDate, b.dropoffDate) : null;
  const total = rental?.total ?? null;
  return {
    price: total === null ? null : Math.round(total * 100) / 100,
    days: rental?.days ?? null,
  };
}

/**
 * A saved reservation's price: the one quoted when it was made, or, for
 * bookings from before prices were stored, the current rules.
 */
export function reservationQuote(
  r: QuotableBooking & { price: { toString(): string } | null }
): BookingQuote {
  const quote = quoteBooking(r);
  return r.price === null ? quote : { price: Number(r.price.toString()), days: quote.days };
}

/** Why a taxi booking has no fixed fare — shown to the owner in the admin. */
export function whyNoFixedFare(b: {
  pickupLocation: string;
  dropoffLocation: string | null;
  passengers: number | null;
}): string {
  if (!b.dropoffLocation || b.dropoffLocation === OTHER_DESTINATION) {
    return "the destination isn't on the price list";
  }
  if (!getRouteByDestination(b.dropoffLocation)) return "it's a local ride";
  if (b.pickupLocation !== FIXED_FARE_PICKUP) {
    return `the pickup (${b.pickupLocation}) is outside Kato Paphos`;
  }
  return "the group size has no fixed price";
}
