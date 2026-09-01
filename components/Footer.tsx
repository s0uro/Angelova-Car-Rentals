import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";
import { dancingScript } from "@/app/lib/fonts";
import LocationMap from "@/components/LocationMap";
import { WhatsAppIcon, TelegramIcon, ViberIcon } from "@/components/BrandIcons";

const socials = [
  { href: siteConfig.whatsapp, label: "WhatsApp", color: "#25D366", Icon: WhatsAppIcon },
  { href: siteConfig.telegram, label: "Telegram", color: "#26A5E4", Icon: TelegramIcon },
  { href: siteConfig.viber, label: "Viber", color: "#7360F2", Icon: ViberIcon },
];

export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-32 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <span
            className={`${dancingScript.className} inline-block -skew-x-[20deg] bg-brand px-5 py-1.5 text-2xl text-white`}
          >
            <span className="inline-block skew-x-[20deg]">{siteConfig.shortName}</span>
          </span>
          <p className="mt-3 text-sm text-slate-600">{siteConfig.tagline}</p>
        </div>

        <div className="text-center text-sm text-slate-600 sm:text-left">
          <p className="font-semibold text-slate-900">Contact</p>
          <ul className="mt-2 space-y-1.5">
            <li>
              <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`} className="hover:text-brand-dark hover:underline">
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={`tel:${siteConfig.phone2.replace(/\s+/g, "")}`} className="hover:text-brand-dark hover:underline">
                {siteConfig.phone2}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-brand-dark hover:underline">
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-dark hover:underline"
              >
                {siteConfig.address}
              </a>
            </li>
            <li className="pt-1 font-medium text-slate-900">{siteConfig.hours}</li>
          </ul>
          <div className="mt-3 flex justify-center gap-3 text-sm sm:justify-start">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 transition-colors hover:border-brand hover:text-brand-dark"
              >
                <span style={{ color: s.color }}>
                  <s.Icon className="h-4 w-4" />
                </span>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Find us</p>
          <div className="mt-2 aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-200">
            <LocationMap />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-900 hover:underline">
              Privacy
            </Link>
            <a
              href="/angelova-terms-and-conditions.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 hover:underline"
            >
              Terms
            </a>
            <Link href="/admin/login" className="hover:text-slate-900 hover:underline">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
