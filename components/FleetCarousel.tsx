"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fleet, formatRate } from "@/app/lib/fleet-data";
import FleetCarPhoto from "@/components/FleetCarPhoto";
import styles from "@/components/FleetCarousel.module.css";

const AUTOPLAY_MS = 4500;

// Curated spread for the homepage teaser — city, compact, and family sizes.
// The full lineup lives further down the homepage.
const FEATURED_IDS = ["nissan-march", "toyota-chr", "nissan-serena"];
const featuredFleet = FEATURED_IDS.map((id) =>
  fleet.find((car) => car.id === id)
).filter((car): car is (typeof fleet)[number] => Boolean(car));

export default function FleetCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [mobileActive, setMobileActive] = useState(0);

  function scrollToIndex(index: number) {
    const el = trackRef.current;
    const child = el?.children[index] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }

  useEffect(() => {
    if (pausedRef.current) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setMobileActive((i) => (i + 1) % featuredFleet.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const id = setInterval(() => {
      if (pausedRef.current) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth * 0.9, behavior: "smooth" });
      }
    }, AUTOPLAY_MS);

    return () => clearInterval(id);
  }, []);

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
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {/* Mobile: one car at a time, auto-crossfading */}
      <div className="sm:hidden">
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {featuredFleet.map((car, i) => (
            <Link
              key={car.id}
              href={`/#${car.id}`}
              className={`block transition-opacity duration-700 ease-in-out ${
                i === mobileActive
                  ? "relative opacity-100"
                  : "absolute inset-0 opacity-0 pointer-events-none"
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <FleetCarPhoto
                  images={car.images}
                  name={car.name}
                  priority={i === 0}
                  sizes="100vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{car.name}</h3>
                <p className="mt-1 text-sm font-semibold text-brand-dark">
                  From {formatRate(car.rates.oneDay)}/day
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-1.5">
          {featuredFleet.map((car, i) => (
            <button
              key={car.id}
              type="button"
              aria-label={`Go to ${car.name}`}
              onClick={() => setMobileActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === mobileActive ? "w-5 bg-brand" : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tablet & up: horizontal scrolling row of cards */}
      <div className="hidden sm:block">
        <div
          ref={trackRef}
          className={`flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-2 ${styles.track}`}
        >
          {featuredFleet.map((car, index) => (
            <Link
              key={car.id}
              href={`/#${car.id}`}
              className="group block w-[60%] shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-brand/60 hover:shadow-md lg:w-[32%]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <FleetCarPhoto
                  images={car.images}
                  name={car.name}
                  priority={index < 4}
                  className="transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 32vw, 60vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{car.name}</h3>
                <p className="mt-1 text-sm font-semibold text-brand-dark">
                  From {formatRate(car.rates.oneDay)}/day
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-1.5 lg:hidden">
          {featuredFleet.map((car, i) => (
            <button
              key={car.id}
              type="button"
              aria-label={`Go to ${car.name}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-5 bg-brand" : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
