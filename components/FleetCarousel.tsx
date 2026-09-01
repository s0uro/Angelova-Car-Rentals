"use client";

import { useEffect, useRef, useState } from "react";
import FleetCard from "@/components/FleetCard";
import { fleet } from "@/app/lib/fleet-data";
import styles from "@/components/FleetCarousel.module.css";

const AUTOPLAY_MS = 4500;

// Curated spread for the homepage teaser — city, compact, and family sizes.
// The full lineup lives on the /fleet page.
const FEATURED_IDS = ["nissan-march", "toyota-chr", "nissan-serena"];
const featuredFleet = FEATURED_IDS.map((id) => fleet.find((car) => car.id === id)).filter(
  (car): car is (typeof fleet)[number] => Boolean(car)
);

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function FleetCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [mobileActive, setMobileActive] = useState(0);
  // null until hydrated, so the server renders both layouts.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  function scrollToIndex(index: number) {
    const el = trackRef.current;
    const child = el?.children[index] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }

  // Mobile crossfade
  useEffect(() => {
    if (reducedMotion()) return;
    const id = setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      setMobileActive((i) => (i + 1) % featuredFleet.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  // Desktop auto-scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el || reducedMotion()) return;
    const id = setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: el.clientWidth * 0.9, behavior: "smooth" });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  // Track which card is centred, for the dots
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      const children = Array.from(el.children) as HTMLElement[];
      let closest = 0;
      let closestDist = Infinity;
      children.forEach((child, i) => {
        const dist = Math.abs(child.offsetLeft - el.scrollLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActive(closest);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const cardHref = (name: string) => `/#booking?car=${encodeURIComponent(name)}`;

  return (
    <div
      className="relative"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {/* Both layouts are in the server HTML so the links survive without
          JS; after hydration only the matching one stays mounted. Hiding
          the other with CSS still downloaded its card photos -- about
          285 KB of images a phone never displays. */}
      {isDesktop !== true && (
        <>
        {/* Mobile: one car at a time, auto-crossfading */}
        <div className="sm:hidden">
          <div className="relative">
            {featuredFleet.map((car, i) => (
              <div
                key={car.id}
                aria-hidden={i !== mobileActive}
                className={`transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                  i === mobileActive
                    ? "relative opacity-100"
                    : "pointer-events-none absolute inset-0 opacity-0"
                }`}
              >
                {/* No priority: the hero poster is the LCP element, and
                    preloading carousel photos only stole bandwidth from it --
                    and preloaded BOTH layouts' photos from the server HTML,
                    before hydration could drop the unused one. */}
                <FleetCard
                  car={car}
                  href={cardHref(car.name)}
                  // 70vw rather than the real ~92vw caps the download at ~2.3x
                  // density instead of 3.4x, same trade as the /fleet grid.
                  sizes="70vw"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-1.5">
            {featuredFleet.map((car, i) => (
              <button
                key={car.id}
                type="button"
                aria-label={`Go to ${car.name}`}
                onClick={() => setMobileActive(i)}
                className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  i === mobileActive ? "w-5 bg-brand" : "w-1.5 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
        </>
      )}

      {isDesktop !== false && (
        <>
        {/* Tablet & up: horizontal scrolling row of cards */}
        <div className="hidden sm:block">
          <div
            ref={trackRef}
            className={`flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-2 ${styles.track}`}
          >
            {featuredFleet.map((car, index) => (
              <div key={car.id} className="w-[60%] shrink-0 snap-start lg:w-[32%]">
                <FleetCard
                  car={car}
                  href={cardHref(car.name)}
                  sizes="(min-width: 1024px) 32vw, 60vw"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-1.5 lg:hidden">
            {featuredFleet.map((car, i) => (
              <button
                key={car.id}
                type="button"
                aria-label={`Go to ${car.name}`}
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  i === active ? "w-5 bg-brand" : "w-1.5 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
