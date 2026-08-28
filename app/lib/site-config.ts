export const siteConfig = {
  name: "Angelova Car Rental & Taxi Services",
  shortName: "Angelova Car Rentals",
  tagline: "Reliable car rentals and taxi rides, wherever you're headed.",
  phone: "+357 99 799 348",
  phone2: "+357 99 804 730",
  email: "stelaangelova53@gmail.com",
  address: "Afroditis Avenue 14-15, Neapolis, 8042 Pafos, Cyprus",
  mapsUrl: "https://maps.app.goo.gl/ZvXzoccxEjwPGfKQA",
  // The old `/maps?q=...&output=embed` form 301-redirects to this same URL,
  // and that redirect response carries X-Frame-Options: SAMEORIGIN, which
  // makes several browsers refuse to follow it inside an <iframe> -- the map
  // just came up blank. Linking directly to the final embed URL skips that.
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m3!2m1!1s34.7453819,32.4280425!6i17",
  hours: "Daily, 07:00 – 22:00",
  opens: "07:00",
  closes: "22:00",
  geo: { lat: 34.7453819, lng: 32.4280425 },
  // Switch to the real domain when it is bought (also update Vercel env NEXT_PUBLIC_SITE_URL).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://angelova-car-rentals.vercel.app",
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
  { href: "/#home", label: "Home" },
  { href: "/#fleet", label: "Fleet" },
  { href: "/#taxi", label: "Taxi" },
  { href: "/#contact", label: "Contact" },
];
