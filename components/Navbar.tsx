"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig, navLinks } from "@/app/lib/site-config";
import { dancingScript } from "@/app/lib/fonts";
import uiverseBtn from "@/components/UiverseButton.module.css";
import { WhatsAppIcon, TelegramIcon, ViberIcon } from "@/components/BrandIcons";

const socials = [
  { href: siteConfig.whatsapp, label: "WhatsApp", color: "#25D366", Icon: WhatsAppIcon },
  { href: siteConfig.telegram, label: "Telegram", color: "#26A5E4", Icon: TelegramIcon },
  { href: siteConfig.viber, label: "Viber", color: "#7360F2", Icon: ViberIcon },
];

function SocialIcons({ button = "h-8 w-8", icon = "h-4 w-4" }: { button?: string; icon?: string }) {
  return (
    <>
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          style={{ color: s.color }}
          className={`flex ${button} items-center justify-center rounded-full transition-colors hover:bg-white/10`}
        >
          <s.Icon className={icon} />
        </a>
      ))}
    </>
  );
}

function BrandBadge({ className = "ml-4" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex shrink-0 -skew-x-[20deg] items-center bg-brand px-7 py-2 transition-colors hover:bg-brand-dark ${className}`}
    >
      <span
        className={`${dancingScript.className} inline-block skew-x-[20deg] whitespace-nowrap text-3xl text-white`}
      >
        {siteConfig.shortName}
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Shrink past the hero, hide when scrolling down, come straight back on
  // scroll-up — the phone numbers and Book button should never be more than a
  // flick away.
  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      setCompact(y > 80);
      setVisible(y < 120 || y < lastY);
      lastY = y;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      role="banner"
      className={`fixed inset-x-0 z-50 mx-4 flex justify-end transition-all duration-300 ease-in-out motion-reduce:transition-none sm:mx-8 lg:block ${
        compact ? "top-2 lg:mx-8 lg:top-3" : "top-4 sm:top-8 lg:mx-40 lg:top-12"
      } ${visible || open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"}`}
    >
      <div
        className={`relative hidden w-full items-center gap-6 rounded-2xl bg-black shadow-lg shadow-black/20 transition-all duration-300 motion-reduce:transition-none lg:flex ${
          compact ? "px-6 py-2.5" : "px-6 py-5 sm:px-8 sm:py-6 lg:px-10"
        }`}
      >
        <BrandBadge />

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-transparent pb-0.5 text-base text-slate-200 transition-colors hover:border-brand hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-5 lg:flex">
          <div className="text-right">
            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              className="block text-base font-bold leading-tight text-white transition-colors hover:text-brand"
            >
              {siteConfig.phone}
            </a>
            <a
              href={`tel:${siteConfig.phone2.replace(/\s+/g, "")}`}
              className="block text-base font-bold leading-tight text-white transition-colors hover:text-brand"
            >
              {siteConfig.phone2}
            </a>
            {!compact && <p className="text-xs text-slate-400">{siteConfig.hours}</p>}
          </div>

          {!compact && (
            <>
              <div className="h-8 w-px bg-white/15" />
              <div className="flex items-center gap-3">
                <SocialIcons />
              </div>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/70 text-white shadow-lg shadow-black/30 ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-black lg:hidden"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

    </header>

      {/* Mobile menu overlay, deliberately a sibling of <header> rather than
          nested inside it: <header> carries a translate-y-* class for the
          scroll-hide animation, and any transform -- even translateY(0) --
          makes an element the containing block for its position:fixed
          descendants. Nested here, this overlay's "fixed inset-0" would
          resolve against header's own small box instead of the viewport,
          collapsing it to a thin strip instead of covering the screen. */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex flex-col overflow-y-auto bg-black/40 backdrop-blur-2xl backdrop-saturate-150 transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-3 flex h-11 w-11 items-center justify-center text-slate-100"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex justify-center px-4 pb-3 pt-16">
          <BrandBadge className="" />
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-lg font-semibold text-slate-100 hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/#booking" onClick={() => setOpen(false)} className={`mt-4 ${uiverseBtn.btn}`}>
            Book now
          </Link>
        </nav>

        <div className="flex flex-col items-center gap-4 px-4 py-6">
          <div className="flex items-center gap-5">
            <SocialIcons button="h-10 w-10" icon="h-5 w-5" />
          </div>
          <a
            href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
            className="text-sm font-bold text-white hover:text-brand"
          >
            {siteConfig.phone}
          </a>
          <a
            href={`tel:${siteConfig.phone2.replace(/\s+/g, "")}`}
            className="text-sm font-bold text-white hover:text-brand"
          >
            {siteConfig.phone2}
          </a>
          <p className="text-xs uppercase tracking-widest text-slate-400">{siteConfig.hours}</p>
        </div>
      </div>
    </>
  );
}
