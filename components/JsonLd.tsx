import { siteConfig } from "@/app/lib/site-config";
import { fleet } from "@/app/lib/fleet-data";
import { taxiRoutes, taxiTiers } from "@/app/lib/taxi-data";
import { faqs } from "@/components/Faq";
import { reviewsSummary } from "@/app/lib/reviews-data";

// Structured data for Google (LocalBusiness rich results). Kept in one place
// so it stays in sync with site-config, prices.json and taxi-rates.json.
export default function JsonLd() {
  const address = {
    "@type": "PostalAddress",
    streetAddress: "Afroditis Avenue 14-15, Neapolis",
    addressLocality: "Pafos",
    postalCode: "8042",
    addressCountry: "CY",
  };
  const geo = { "@type": "GeoCoordinates", latitude: siteConfig.geo.lat, longitude: siteConfig.geo.lng };
  const hours = {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: siteConfig.opens,
    closes: siteConfig.closes,
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoRental",
        "@id": `${siteConfig.url}/#rental`,
        name: siteConfig.name,
        url: siteConfig.url,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        image: `${siteConfig.url}/opengraph-image`,
        address,
        geo,
        openingHoursSpecification: [hours],
        areaServed: ["Pafos", "Paphos", "Coral Bay", "Pegeia", "Polis", "Cyprus"],
        priceRange: "€€",
        // Only published once the owner has confirmed the figures against the
        // live Google profile (see reviewsSummary.confirmed) -- unverified
        // review markup risks a Google manual action.
        ...(reviewsSummary.confirmed
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: reviewsSummary.rating,
                reviewCount: reviewsSummary.count,
                bestRating: 5,
              },
            }
          : {}),
        makesOffer: fleet.map((car) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Car", name: car.name },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: car.rates.oneDay,
            priceCurrency: "EUR",
            unitText: "DAY",
          },
        })),
      },
      {
        "@type": "TaxiService",
        "@id": `${siteConfig.url}/#taxi`,
        name: `${siteConfig.shortName} — Taxi & Minibus Transfers`,
        provider: { "@id": `${siteConfig.url}/#rental` },
        url: `${siteConfig.url}/taxi`,
        telephone: siteConfig.phone,
        areaServed: "Cyprus",
        availableLanguage: ["en", "ru"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Fixed-price transfers from Pafos",
          itemListElement: taxiRoutes.map((route) => ({
            "@type": "Offer",
            name: `Pafos → ${route.destination} (taxi, ${taxiTiers[0].label} people)`,
            price: route.prices[taxiTiers[0].key],
            priceCurrency: "EUR",
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteConfig.url}/#faq`,
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
