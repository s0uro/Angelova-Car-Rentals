"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useConsent, setConsent } from "@/app/lib/use-consent";

/**
 * Cookie / analytics notice. The site sets no tracking cookies; the only
 * non-essential thing is privacy-friendly visit counting (Vercel Analytics),
 * which AnalyticsGate loads only after "I agree". "I do not agree" keeps it off.
 * It fades in 5–10 seconds (random) after the site is opened or refreshed.
 */
export default function CookieConsent() {
  const consent = useConsent();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const delay = 5000 + Math.random() * 5000;
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, []);

  if (consent !== null || !ready) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-40 animate-[fade-in_.6s_ease-out] px-3 motion-reduce:animate-none pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:px-4 lg:pb-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/95 p-4 text-sm text-slate-200 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:gap-4">
        <p className="flex-1 leading-relaxed">
          We use privacy-friendly analytics to count visits — no tracking cookies,
          no personal profile.{" "}
          <Link
            href="/privacy"
            className="font-medium text-brand underline underline-offset-2"
          >
            More in our privacy note
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent("declined")}
            className="flex-1 rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex-none"
          >
            I do not agree
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="flex-1 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex-none"
          >
            I agree
          </button>
        </div>
      </div>
    </div>
  );
}
