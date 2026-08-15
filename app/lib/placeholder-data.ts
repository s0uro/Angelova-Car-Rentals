// Real fleet & pricing now live in app/lib/fleet-data.ts, sourced from prices.json.

export const taxiServices = [
  {
    id: "city-rides",
    name: "City Rides",
    description: "On-demand rides around town, day or night.",
    priceNote: "Metered — from €0.80/km",
  },
  {
    id: "airport-transfer",
    name: "Airport Transfers",
    description: "Fixed-price pickup and drop-off to/from the airport.",
    priceNote: "From €25 (flat rate)",
  },
  {
    id: "intercity",
    name: "Intercity Transfers",
    description: "Comfortable long-distance trips between cities.",
    priceNote: "Custom quote based on distance",
  },
];

export const pricingNotes = [
  "Car rental rates include basic insurance and drop per rental length — the longer you rent, the lower the daily rate.",
  "\"Ask\" rates (14+ days) are quoted individually — contact us for a custom offer.",
  "Taxi fares shown are placeholder rates and may vary by season, availability, distance, and time of day.",
];
