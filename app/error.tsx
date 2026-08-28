"use client";

import { useEffect } from "react";
import { siteConfig } from "@/app/lib/site-config";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-slate-600">
        The page didn&apos;t load. Try again — and if you were booking, call or WhatsApp us and
        we&apos;ll take the details ourselves.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-brand px-8 py-3 font-semibold text-black transition-colors hover:bg-brand-dark"
        >
          Try again
        </button>
        <a
          href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
          className="rounded-full border border-slate-300 px-8 py-3 font-semibold text-slate-900 transition-colors hover:border-brand"
        >
          Call {siteConfig.phone}
        </a>
      </div>
      {error.digest && <p className="mt-6 font-mono text-xs text-slate-400">{error.digest}</p>}
    </div>
  );
}
