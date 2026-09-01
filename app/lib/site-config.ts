// Every canonical, og:url, sitemap entry and JSON-LD @id is built by appending
// a path to siteConfig.url, so a trailing slash on NEXT_PUBLIC_SITE_URL would
// produce "https://host//fleet" everywhere. Strip it here rather than relying
// on whoever types the value into the Vercel dashboard.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.angelovacarrentals.com"
).replace(/\/+$/, "");

export const siteConfig = {
  name: "Angelova Car Rental & Taxi Services",
  shortName: "Angelova Car Rentals",
  tagline: "Reliable car rentals and taxi rides, wherever you're headed.",
  phone: "+357 99 799 348",
  phone2: "+357 99 804 730",
  email: "stelaangelova53@gmail.com",
  // Address, opening time and map link all mirror the Google Business
  // Profile (place ID ChIJPQ_eissH5xQRyirWlQrDT8s), so the site and the
  // listing agree -- Google weighs that consistency for local ranking.
  address: "Poseidonos 7, Kato Paphos, 8042 Pafos, Cyprus",
  mapsUrl: "https://maps.google.com/?cid=4066856290080280362",
  placeId: "ChIJPQ_eissH5xQRyirWlQrDT8s",
  hours: "Daily, 07:30 – 22:00",
  opens: "07:30",
  closes: "22:00",
  geo: { lat: 34.7453819, lng: 32.4280425 },
  // The live domain, normalised (see SITE_URL above). The fallback must be the
  // real domain: pointing it at the .vercel.app address would tell Google the
  // real site is a duplicate.
  url: SITE_URL,
  whatsapp: "https://wa.me/35799799348",
  telegram: "https://t.me/angelovacarrental",
  viber: "viber://chat?number=%2B35799799348",
};

export const pafosAreas = [
  "Pafos Town Centre",
  "Kato Pafos (Harbour)",
  "Pafos International Airport",
  "Coral Bay",
  "Geroskipou",
  "Chlorakas",
  "Kissonerga",
  "Peyia",
  "Tala",
  "Emba",
  "Tombs of the Kings Area",
  "Universal / Anavargos",
  "Polis Chrysochous",
  "Latchi",
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/fleet", label: "Fleet" },
  { href: "/taxi", label: "Taxi" },
  { href: "/#contact", label: "Contact" },
];
