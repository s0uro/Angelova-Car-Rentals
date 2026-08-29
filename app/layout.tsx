import type { Metadata } from "next";

import AnalyticsGate from "@/components/AnalyticsGate";
import { siteConfig } from "@/app/lib/site-config";
import "./globals.css";

const geistSans = { variable: "" }; const geistMono = { variable: "" };

const description =
  "Car rental and taxi in Paphos, Cyprus. Rent a car from a day to a month, or book a fixed-price taxi or minibus transfer to Pafos Airport, Larnaca, Limassol, Nicosia and Ayia Napa. English and Russian spoken. Open daily 07:00–22:00.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Car Rental & Taxi in Paphos | ${siteConfig.shortName}`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description,
  applicationName: siteConfig.shortName,
  keywords: [
    "car rental Paphos",
    "car hire Pafos",
    "taxi Paphos",
    "Paphos airport transfer",
    "minibus transfer Cyprus",
    "השכרת רכב פאפוס",
    "аренда авто Пафос",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    title: `Car Rental & Taxi in Paphos | ${siteConfig.shortName}`,
    description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  verification: {
    google: "M0qE14iZwBu976xDT1ffx14CZ8PYIZD9L-cer1EPfkE",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <AnalyticsGate />
      </body>
    </html>
  );
}
