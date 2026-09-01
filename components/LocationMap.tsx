import { siteConfig } from "@/app/lib/site-config";

// Keyless Google Maps embed of the Google Business listing -- searching by
// name keeps the pin attached to the business card with its reviews, not
// just a bare coordinate marker. No API key or env var needed.
const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  "S.Angelova Car Rentals, Afroditis Avenue, Pafos"
)}&z=16&hl=en&output=embed`;

/** Google Maps embed for the footer's "Find us" box. */
export default function LocationMap() {
  return (
    <iframe
      src={GOOGLE_MAPS_EMBED_URL}
      title={`Map showing ${siteConfig.shortName}, ${siteConfig.address}`}
      className="h-full w-full border-0"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
