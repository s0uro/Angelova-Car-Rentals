import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  reservationSchema,
  issuesToErrors,
  TOO_MANY_PASSENGERS_MESSAGE,
} from "@/app/lib/booking-schema";
import { allCars, carByName, fleet } from "@/app/lib/fleet-data";

const inHours = (h: number) => new Date(Date.now() + h * 60 * 60 * 1000).toISOString();

const customer = {
  name: "Maria",
  surname: "Ivanova",
  age: "30",
  phone: "+35799123456",
  email: "maria@example.com",
  notes: "",
  agreedToTerms: true,
};
const taxi = {
  ...customer,
  type: "taxi",
  carName: "",
  pickupDate: inHours(48),
  dropoffDate: "",
  pickupLocation: "Kato Pafos (Harbour)",
  dropoffLocation: "Pafos Airport",
};
const rental = {
  ...customer,
  type: "car",
  carName: "Nissan March",
  pickupDate: inHours(48),
  dropoffDate: inHours(72),
  pickupLocation: "Pafos International Airport",
  dropoffLocation: "",
  passengers: "",
};

function errorsFor(input: Record<string, unknown>) {
  const result = reservationSchema.safeParse(input);
  return result.success ? {} : issuesToErrors(result.error.issues);
}

describe("taxi passengers (server-side validation, also run by the form)", () => {
  it.each(["1", "4", "16"])("accepts %s", (passengers) => {
    expect(errorsFor({ ...taxi, passengers })).toEqual({});
  });

  it.each(["17", "30"])("refuses %s and asks the customer to contact us", (passengers) => {
    expect(errorsFor({ ...taxi, passengers }).passengers).toBe(TOO_MANY_PASSENGERS_MESSAGE);
    expect(TOO_MANY_PASSENGERS_MESSAGE).toMatch(/call us on \+357/);
  });

  it.each([
    ["0", "Please enter at least 1 passenger."],
    ["-3", "Please enter at least 1 passenger."],
    ["2.5", "Please enter a whole number of passengers."],
    ["abc", "Please enter the number of passengers."],
    ["", "Please tell us how many people are travelling."],
  ])("refuses %j with a readable message", (passengers, message) => {
    expect(errorsFor({ ...taxi, passengers }).passengers).toBe(message);
  });
});

describe("retired cars", () => {
  it("the Mercedes V Class is no longer for rent but old bookings can still find it", () => {
    expect(fleet.map((c) => c.name)).not.toContain("Mercedes V Class");
    expect(carByName("Mercedes V Class")).toMatchObject({ active: false, rates: { oneDay: 300 } });
  });

  it("can't be booked, even by a request that skips the form", () => {
    expect(errorsFor({ ...rental, carName: "Mercedes V Class" }).carName).toBe(
      "Please choose a car from the list."
    );
    expect(errorsFor(rental)).toEqual({});
  });
});

describe("fleet specs", () => {
  it("the Suzuki Jimny is automatic", () => {
    expect(carByName("Suzuki Jimny")?.transmission).toBe("Automatic");
  });
});

describe("unit quantities seeded by the migration", () => {
  const sql = readFileSync(
    new URL("../prisma/migrations/20261015120000_car_model_quantities/migration.sql", import.meta.url),
    "utf8"
  );
  const seeded = Object.fromEntries(
    [...sql.matchAll(/\('([^']+)', (\d+)\)/g)].map((m) => [m[1], Number(m[2])])
  );

  it("match the owner's numbers", () => {
    expect(seeded).toEqual({
      "Nissan March": 7,
      "Nissan Note": 2,
      "Nissan Note E Power": 4,
      "Toyota Vitz": 1,
      "Honda Fit": 2,
      "Mazda Demio": 3,
      "Nissan Serena": 2,
      "Nissan Serena E Power": 1,
      "Mazda Cx5": 1,
      "Toyota Chr": 1,
      "Suzuki Jimny": 1,
    });
  });

  it("cover every car for rent, spelled exactly as bookings store it", () => {
    // A misspelt name would silently fall back to one unit.
    expect(Object.keys(seeded).sort()).toEqual(fleet.map((c) => c.name).sort());
    expect(allCars.length).toBe(fleet.length + 1);
  });
});
