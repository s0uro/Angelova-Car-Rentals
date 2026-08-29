"use client";

import { Analytics } from "@vercel/analytics/next";
import { useConsent } from "@/app/lib/use-consent";

/** Loads Vercel Analytics only once the visitor has accepted in CookieConsent. */
export default function AnalyticsGate() {
  return useConsent() === "accepted" ? <Analytics /> : null;
}
