"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fleet, formatRate } from "@/app/lib/fleet-data";
import FleetCarPhoto from "@/components/FleetCarPhoto";
import styles from "@/components/FleetCarousel.module.css";

const AUTOPLAY_MS = 4500;

export default function FleetCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [active, setActive] = useState(0);

  function scrollByPage(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  }

  function scrollToIndex(index: number) {
    const el = trackRef.current;
    const child = el?.children[index] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }

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
      <div
        ref={trackRef}
        className={`flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-2 ${styles.track}`}
      >
        {fleet.map((car, index) => (
          <Link
            key={car.id}
            href={`/fleet#${car.id}`}
            className="group block w-[78%] shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-brand/60 hover:shadow-md sm:w-[46%] lg:w-[31%] xl:w-[24%]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <FleetCarPhoto
                images={car.images}
                name={car.name}
                priority={index < 4}
                className="transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw"
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

      <button
        type="button"
        aria-label="Previous cars"
        onClick={() => scrollByPage(-1)}
        className="absolute left-0 top-[38%] hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-slate-700 shadow-lg ring-1 ring-slate-200 transition-colors hover:bg-brand hover:text-black sm:flex"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next cars"
        onClick={() => scrollByPage(1)}
        className="absolute right-0 top-[38%] hidden translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-slate-700 shadow-lg ring-1 ring-slate-200 transition-colors hover:bg-brand hover:text-black sm:flex"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="mt-4 flex justify-center gap-1.5 sm:hidden">
        {fleet.map((car, i) => (
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
  );
}
