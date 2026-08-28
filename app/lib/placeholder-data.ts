// Real fleet & pricing now live in app/lib/fleet-data.ts, sourced from prices.json.

import { fromPrice, formatPrice } from "@/app/lib/taxi-data";

// Transfer prices come from taxi-rates.json (see app/lib/taxi-data.ts).
export const taxiServices = [
  {
    id: "airport-pafos",
    name: "Pafos ⇄ Pafos Airport",
    description: "Fixed-price transfer between Pafos and Pafos Airport, any time of day.",
    priceNote: `from ${formatPrice(fromPrice("pafos-airport"))}`,
  },
  {
    id: "airport-larnaca",
    name: "Pafos ⇄ Larnaca Airport",
    description: "Fixed-price transfer between Pafos and Larnaca Airport.",
    priceNote: `from ${formatPrice(fromPrice("larnaca-airport"))}`,
  },
  {
    id: "other-routes",
    name: "Limassol, Nicosia, Ayia Napa & more",
    description: "Taxi for up to 4, minibus for up to 16. Fixed prices to every major destination.",
    priceNote: `from ${formatPrice(fromPrice("limassol"))}`,
  },
];

export const taxiVehicles = [
  {
    id: "taxi",
    name: "Taxi",
    description: "Standard sedan taxi for up to 4 passengers.",
    images: [
      "/taxi/audi-a6.jpg",
      "/taxi/audi-a6-2.jpg",
      "/taxi/mercedes-e-class.jpg",
      "/taxi/mercedes-e-class-2.jpg",
      "/taxi/taxi-van.jpg",
      "/taxi/taxi-van-2.jpg",
      "/taxi/taxi-van-3.jpg",
    ],
  },
  {
    id: "minibus",
    name: "Minibus",
    description:
      "Spacious minibus for larger groups who need extra seats and luggage space.",
    images: [
      "/taxi/minibus.jpg",
      "/taxi/minibus-2.jpg",
      "/taxi/minibus-3.jpg",
      "/taxi/minibus-4.jpg",
      "/taxi/minibus-5.jpg",
      "/taxi/minibus-6.jpg",
    ],
  },
];

// Hebrew listed first — high volume of Israeli tourists searching for taxis,
// minibuses, and car rentals.
export const taxiLanguages = ["Hebrew", "English", "Russian"];

export const pricingNotes = [
  "Car rental rates include basic insurance and drop per rental length — the longer you rent, the lower the daily rate.",
  "\"Ask\" rates (14+ days) are quoted individually — contact us for a custom offer.",
  "Fixed airport transfer rates are shown above; all other taxi and minibus routes are quoted on request.",
];
