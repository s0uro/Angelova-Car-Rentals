import rawPrices from "@/prices.json";

export type RentalRates = {
  oneDay: number;
  twoToThreeDays: number;
  fourToSevenDays: number;
  eightToFourteenDays: number;
  fourteenPlusDays: number | null; // null = "ask for a quote"
};

export type FleetCar = {
  id: string;
  name: string;
  rates: RentalRates;
  images: string[];
};

// Photos live in public/fleet, named by car slug. Cars with no photos yet
// (Toyota Vitz, Mazda CX-5) fall back to a placeholder in the UI.
const fleetImages: Record<string, string[]> = {
  "nissan-march": ["/fleet/nissan-march.jpg", "/fleet/nissan-march-2.jpg"],
  "mazda-demio": ["/fleet/mazda-demio.jpg", "/fleet/mazda-demio-2.jpg"],
  "nissan-note": ["/fleet/nissan-note.jpg", "/fleet/nissan-note-2.jpg"],
  "nissan-note-e-power": [
    "/fleet/nissan-note-e-power.jpg",
    "/fleet/nissan-note-e-power-2.jpg",
  ],
  "honda-fit": ["/fleet/honda-fit.jpg", "/fleet/honda-fit-2.jpg"],
  "toyota-chr": ["/fleet/toyota-chr.jpg", "/fleet/toyota-chr-2.jpg"],
  "nissan-serena": ["/fleet/nissan-serena.jpg", "/fleet/nissan-serena-2.jpg"],
  "nissan-serena-e-power": [
    "/fleet/nissan-serena-e-power.jpg",
    "/fleet/nissan-serena-e-power-2.jpg",
  ],
  "suzuki-jimny": ["/fleet/suzuki-jimny.jpg", "/fleet/suzuki-jimny-2.jpg"],
  "mercedes-v-class": [
    "/fleet/mercedes-v-class.jpg",
    "/fleet/mercedes-v-class-2.jpg",
  ],
};

function parseRate(value: string): number | null {
  if (value.trim().toUpperCase() === "ASK") return null;
  const amount = Number.parseFloat(value.replace(/[^\d.]/g, ""));
  return Number.isNaN(amount) ? null : amount;
}

function toTitleCase(name: string): string {
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

type RawPriceRow = {
  car: string;
  "1_day": string;
  "2_3_days": string;
  "4_7_days": string;
  "8_14_days": string;
  "14_plus_days": string;
};

export const fleet: FleetCar[] = (rawPrices as RawPriceRow[]).map((row) => {
  const id = slugify(row.car);
  return {
    id,
    name: toTitleCase(row.car),
    rates: {
      oneDay: parseRate(row["1_day"]) ?? 0,
      twoToThreeDays: parseRate(row["2_3_days"]) ?? 0,
      fourToSevenDays: parseRate(row["4_7_days"]) ?? 0,
      eightToFourteenDays: parseRate(row["8_14_days"]) ?? 0,
      fourteenPlusDays: parseRate(row["14_plus_days"]),
    },
    images: fleetImages[id] ?? [],
  };
});

export const rateTiers: { key: keyof RentalRates; label: string }[] = [
  { key: "oneDay", label: "1 day" },
  { key: "twoToThreeDays", label: "2–3 days" },
  { key: "fourToSevenDays", label: "4–7 days" },
  { key: "eightToFourteenDays", label: "8–14 days" },
  { key: "fourteenPlusDays", label: "14+ days" },
];

export function formatRate(value: number | null): string {
  return value === null ? "Ask" : `€${value.toFixed(2)}`;
}
