"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";

const tel = `tel:${siteConfig.phone.replace(/\s+/g, "")}`;

/**
 * Fixed call / WhatsApp / book bar on phones. The two things a visitor wants
 * — reach a human, or book — stay one tap away at any scroll position.
 * Hidden while the booking form itself is on screen.
 */
export default function MobileActionBar() {
  const [hiddenByBooking, setHiddenByBooking] = useState(false);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);

  useEffect(() => {
    const booking = document.getElementById("booking");
    if (!booking) return;
    const io = new IntersectionObserver(([e]) => setHiddenByBooking(e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(booking);
    return () => io.disconnect();
  }, []);

  // Hide while actively scrolling down (like the Navbar), reappear on
  // scroll-up so it's never gone for good.
  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      setHiddenByScroll(y > lastY && y > 120);
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = hiddenByBooking || hiddenByScroll;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/95 backdrop-blur transition-transform duration-300 lg:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3 gap-2 px-3 py-2.5 text-sm font-semibold">
        <a
          href={tel}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/25 py-2.5 text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M4 5c0-.6.4-1 1-1h2.2c.4 0 .8.3.9.7l.9 3c.1.4 0 .8-.3 1l-1.4 1.2a12 12 0 0 0 5.8 5.8l1.2-1.4c.3-.3.7-.4 1-.3l3 .9c.4.1.7.5.7.9V19c0 .6-.4 1-1 1A15 15 0 0 1 4 5Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Call
        </a>
        <a
          href={siteConfig.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border border-white/25 py-2.5 text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#25D366">
            <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.2-.2-.5-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l4.9-1.3A10 10 0 1 0 12 2z" />
          </svg>
          WhatsApp
        </a>
        <Link
          href="/#booking"
          className="flex items-center justify-center rounded-lg bg-brand py-2.5 text-black"
        >
          Book now
        </Link>
      </div>
    </div>
  );
}
