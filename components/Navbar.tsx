"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { siteConfig, navLinks } from "@/app/lib/site-config";
import { dancingScript } from "@/app/lib/fonts";
import uiverseBtn from "@/components/UiverseButton.module.css";

const socials = [
  {
    href: siteConfig.whatsapp,
    label: "WhatsApp",
    path: "M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.2-.2-.5-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l4.9-1.3A10 10 0 1 0 12 2z",
  },
  {
    href: siteConfig.telegram,
    label: "Telegram",
    path: "M21.9 4.4 18.6 20c-.2 1.1-.9 1.4-1.9.9l-5.2-3.8-2.5 2.4c-.3.3-.5.5-1 .5l.4-5.3L18 6.5c.4-.4-.1-.6-.6-.2L7.5 12.9l-5.1-1.6c-1.1-.3-1.1-1.1.2-1.6L20.5 3c.9-.3 1.7.2 1.4 1.4z",
  },
  {
    href: siteConfig.instagram,
    label: "Instagram",
    path: "M12 2c2.7 0 3.1 0 4.1.1 1.1 0 1.8.2 2.5.5.7.3 1.2.6 1.8 1.2.6.6.9 1.1 1.2 1.8.3.7.5 1.4.5 2.5.1 1 .1 1.4.1 4.1s0 3.1-.1 4.1c0 1.1-.2 1.8-.5 2.5-.3.7-.6 1.2-1.2 1.8-.6.6-1.1.9-1.8 1.2-.7.3-1.4.5-2.5.5-1 .1-1.4.1-4.1.1s-3.1 0-4.1-.1c-1.1 0-1.8-.2-2.5-.5-.7-.3-1.2-.6-1.8-1.2-.6-.6-.9-1.1-1.2-1.8-.3-.7-.5-1.4-.5-2.5C2 15.1 2 14.7 2 12s0-3.1.1-4.1c0-1.1.2-1.8.5-2.5.3-.7.6-1.2 1.2-1.8.6-.6 1.1-.9 1.8-1.2.7-.3 1.4-.5 2.5-.5C9.9 2 10.3 2 12 2zm0 1.8c-2.6 0-3 0-4 .1-.9 0-1.4.2-1.7.3-.4.2-.7.3-1 .6-.3.3-.5.6-.6 1-.1.3-.3.8-.3 1.7-.1 1-.1 1.4-.1 4s0 3 .1 4c0 .9.2 1.4.3 1.7.2.4.3.7.6 1 .3.3.6.5 1 .6.3.1.8.3 1.7.3 1 .1 1.4.1 4 .1s3 0 4-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.3 1-.6.3-.3.5-.6.6-1 .1-.3.3-.8.3-1.7.1-1 .1-1.4.1-4s0-3-.1-4c0-.9-.2-1.4-.3-1.7-.2-.4-.3-.7-.6-1-.3-.3-.6-.5-1-.6-.3-.1-.8-.3-1.7-.3-1-.1-1.4-.1-4-.1zm0 3.5a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8zm5-2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z",
  },
];

const primaryLinks = navLinks.slice(0, 2);
const serviceLinks = navLinks.slice(2, 4);
const trailingLinks = navLinks.slice(4);

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
          className={`flex ${button} items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-brand`}
        >
          <svg className={icon} viewBox="0 0 24 24" fill="currentColor">
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </>
  );
}

function BrandBadge() {
  return (
    <Link
      href="/"
      className="ml-4 flex shrink-0 -skew-x-[20deg] items-center bg-brand px-7 py-2 transition-colors hover:bg-brand-dark"
    >
      <span
        className={`${dancingScript.className} inline-block skew-x-[20deg] whitespace-nowrap text-3xl text-white`}
      >
        {siteConfig.shortName}
      </span>
    </Link>
  );
}

function ServicesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (serviceLinks.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1 border-b border-transparent pb-0.5 text-base text-slate-200 transition-colors hover:border-brand hover:text-brand"
      >
        Services
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <nav
        role="menu"
        className={`absolute left-1/2 top-full mt-2 w-44 -translate-x-1/2 overflow-hidden rounded-xl bg-black shadow-lg ring-1 ring-white/10 transition-all duration-200 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        {serviceLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 hover:text-brand"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    function onScroll() {
      const currentY = window.scrollY;
      setVisible(currentY < lastScrollY.current || currentY < 80);
      lastScrollY.current = currentY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-4 z-50 mx-4 sm:top-8 sm:mx-8 lg:top-12 lg:mx-40 ${
        visible || open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        transitionProperty: "opacity",
        transitionTimingFunction: "ease-in-out",
        transitionDuration: visible || open ? "300ms" : "1000ms",
      }}
    >
      <div className="relative flex w-full items-center gap-6 rounded-2xl bg-black px-6 py-5 shadow-lg shadow-black/20 sm:px-8 sm:py-6 lg:px-10">
        <BrandBadge />

        <nav className="hidden items-center gap-8 lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-transparent pb-0.5 text-base text-slate-200 transition-colors hover:border-brand hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <ServicesDropdown />
          {trailingLinks.map((link) => (
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
          <div className="flex items-center gap-3">
            <SocialIcons />
          </div>

          <div className="h-8 w-px bg-white/15" />

          <div className="text-right">
            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              className="block text-base font-bold leading-tight text-white transition-colors hover:text-brand"
            >
              {siteConfig.phone}
            </a>
            <p className="text-xs text-slate-400">{siteConfig.hours}</p>
          </div>

          <Link href="/booking" className={uiverseBtn.btn}>
            Book now
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="ml-auto flex h-9 w-9 items-center justify-center text-slate-100 lg:hidden"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Full-screen mobile overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-black transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <BrandBadge />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center text-slate-100"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
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
          <Link href="/booking" onClick={() => setOpen(false)} className={`mt-4 ${uiverseBtn.btn}`}>
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
          <p className="text-xs uppercase tracking-widest text-slate-400">{siteConfig.hours}</p>
        </div>
      </div>
    </header>
  );
}
