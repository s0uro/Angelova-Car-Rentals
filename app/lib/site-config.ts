export const siteConfig = {
  name: "Angelova Car Rental & Taxi Services",
  shortName: "Angelova Car Rentals",
  tagline: "Reliable car rentals and taxi rides, wherever you're headed.",
  phone: "+357 99 799 348",
  phone2: "+357 99 804 730",
  email: "stelaangelova53@gmail.com",
  address: "Afroditis Avenue 14-15, Neapolis, 8042 Pafos, Cyprus",
  mapsUrl: "https://maps.app.goo.gl/ZvXzoccxEjwPGfKQA",
  hours: "Daily, 07:00 – 22:00",
  opens: "07:00",
  closes: "22:00",
  geo: { lat: 34.7453819, lng: 32.4280425 },
  // The live domain. Every canonical, og:url, sitemap entry and JSON-LD @id is
  // built from this, so the fallback must be the real domain: pointing them at
  // the .vercel.app address tells Google the real site is a duplicate.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.angelovacarrentals.com",
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
