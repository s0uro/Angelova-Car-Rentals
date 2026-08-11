import Image from "next/image";
import { siteConfig } from "@/app/lib/site-config";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
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
          <p>{siteConfig.email}</p>
          <p>{siteConfig.address}</p>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Hours</p>
          <p className="mt-2">{siteConfig.hours}</p>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
