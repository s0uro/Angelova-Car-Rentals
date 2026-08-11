// Placeholder fleet/pricing data — replace with the real fleet and rates.
export const fleet = [
  {
    id: "economy-hatch",
    name: "Economy Hatchback",
    category: "Economy",
    seats: 4,
    transmission: "Manual",
    pricePerDay: 29,
    description: "Compact and fuel-efficient — great for city trips.",
  },
  {
    id: "compact-sedan",
    name: "Compact Sedan",
    category: "Compact",
    seats: 5,
    transmission: "Automatic",
    pricePerDay: 39,
    description: "Comfortable sedan with plenty of trunk space.",
  },
  {
    id: "family-suv",
    name: "Family SUV",
    category: "SUV",
    seats: 7,
    transmission: "Automatic",
    pricePerDay: 59,
    description: "Spacious SUV, ideal for families and longer trips.",
  },
  {
    id: "premium-sedan",
    name: "Premium Sedan",
    category: "Premium",
    seats: 5,
    transmission: "Automatic",
    pricePerDay: 79,
    description: "A refined ride for business travel or special occasions.",
  },
];

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
  "Prices shown are placeholder rates and may vary by season and availability.",
  "Car rental prices are per day and include basic insurance.",
  "Taxi fares depend on distance, time of day, and vehicle type.",
  "Contact us for weekly/monthly rental discounts or corporate accounts.",
];
