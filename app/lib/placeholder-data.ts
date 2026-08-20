// Real fleet & pricing now live in app/lib/fleet-data.ts, sourced from prices.json.

export const taxiServices = [
  {
    id: "airport-pafos",
    name: "Pafos Airport → Pafos",
    description: "Fixed-price transfer between Pafos Airport and Pafos.",
    priceNote: "€35",
  },
  {
    id: "airport-larnaca",
    name: "Pafos Airport → Larnaca",
    description: "Fixed-price transfer between Pafos Airport and Larnaca.",
    priceNote: "€130",
  },
  {
    id: "other-routes",
    name: "Other City & Intercity Routes",
    description: "Local rides and other destinations beyond the routes above.",
    priceNote: "Ask price for taxi or minibus",
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
