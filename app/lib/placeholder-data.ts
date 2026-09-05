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
    images: ["/taxi/mercedes-e-class.webp", "/taxi/mercedes-e-class-2.webp"],
  },
  {
    id: "minibus",
    name: "Minibus",
    description:
      "Spacious minibus for larger groups who need extra seats and luggage space.",
    images: [
      "/taxi/mercedes-v-class.webp",
      "/taxi/mercedes-v-class-2.webp",
      "/taxi/mercedes-v-class-interior.webp",
    ],
  },
];

export const taxiLanguages = ["English", "Russian"];
