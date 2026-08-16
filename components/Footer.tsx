import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";

export default function Footer() {
  return (
    <footer id="contact" className="mt-16 scroll-mt-32 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <Image
            src="/logo.png"
            alt={siteConfig.shortName}
            width={806}
            height={419}
            className="h-12 w-auto"
          />
          <p className="mt-3 text-sm text-slate-600">{siteConfig.tagline}</p>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Contact</p>
          <p className="mt-2">{siteConfig.phone}</p>
          <p>{siteConfig.phone2}</p>
          <p>{siteConfig.email}</p>
          <a
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block underline-offset-2 hover:text-brand-dark hover:underline"
          >
            {siteConfig.address}
          </a>
        </div>
        <div className="flex gap-4 text-sm text-slate-600">
          <div>
            <p className="font-semibold text-slate-900">Hours</p>
            <p className="mt-2">{siteConfig.hours}</p>
          </div>
          <div className="ml-auto aspect-square w-36 shrink-0 overflow-hidden rounded-lg border border-slate-200">
            <iframe
              src={siteConfig.mapEmbedUrl}
              title={`Map to ${siteConfig.shortName}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="relative border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <Link
          href="/admin/login"
          className="mt-1 inline-block text-brand-dark underline-offset-2 hover:underline sm:absolute sm:right-4 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
        >
          Login as Angelova
        </Link>
      </div>
    </footer>
  );
}
