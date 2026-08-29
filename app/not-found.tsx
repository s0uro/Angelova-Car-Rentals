import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        That page isn&apos;t here
      </h1>
      <p className="mt-2 max-w-md text-slate-600">
        The link may be old or mistyped. Our cars, transfer prices and booking form are all on
        the home page.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-brand px-8 py-3 font-semibold text-black transition-colors hover:bg-brand-dark"
        >
          Back home
        </Link>
        <a
          href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
          className="rounded-full border border-slate-300 px-8 py-3 font-semibold text-slate-900 transition-colors hover:border-brand"
        >
          Call {siteConfig.phone}
        </a>
      </div>
    </div>
  );
}
