import { describe, expect, it } from "vitest";
import { summaryLines, type BookingNotification } from "@/app/lib/email";
import { quoteBooking } from "@/app/lib/quote";
import { localInputToDate } from "@/app/lib/timezone";

function notification(b: Omit<BookingNotification, "price" | "days" | "reference" | "name" | "surname" | "phone" | "email" | "notes">): BookingNotification {
  return {
    ...b,
    ...quoteBooking(b),
    reference: "ABC12345",
    name: "Maria",
    surname: "Ivanova",
    phone: "+35799123456",
    email: "maria@example.com",
    notes: null,
  };
}

describe("booking emails show the same price as the form", () => {
  it("a 26h car rental is 1 day", () => {
    const lines = summaryLines(
      notification({
        type: "car",
        carName: "Nissan March",
        pickupDate: localInputToDate("2026-12-10T09:00")!,
        dropoffDate: localInputToDate("2026-12-11T11:00")!,
        pickupLocation: "Kato Pafos (Harbour)",
        dropoffLocation: null,
        passengers: null,
      })
    );
    expect(lines).toContain("Rental: 1 day · estimated total €70.00");
  });

  it("a taxi from outside Kato Paphos has its fare confirmed by phone", () => {
    const lines = summaryLines(
      notification({
        type: "taxi",
        carName: null,
        pickupDate: localInputToDate("2026-12-10T09:00")!,
        dropoffDate: null,
        pickupLocation: "Pafos Town Centre",
        dropoffLocation: "Pafos Airport",
        passengers: 2,
      })
    );
    expect(lines).toContain("Fare: to be confirmed — we'll confirm the fare when we call you");
  });

  it("a taxi from Kato Paphos shows the fixed price", () => {
    const lines = summaryLines(
      notification({
        type: "taxi",
        carName: null,
        pickupDate: localInputToDate("2026-12-10T09:00")!,
        dropoffDate: null,
        pickupLocation: "Kato Pafos (Harbour)",
        dropoffLocation: "Pafos Airport",
        passengers: 2,
      })
    );
    expect(lines).toContain("Fare: €35 (fixed price, one-way)");
  });
});
