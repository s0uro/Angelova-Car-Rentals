"use client";

import { useState } from "react";
import FleetCard from "@/components/FleetCard";
import { fleet, activeCategories } from "@/app/lib/fleet-data";

/** /fleet grid with category filter chips (no page reload). */
export default function FleetGrid() {
  const [category, setCategory] = useState<string>("All");
  const shown = category === "All" ? fleet : fleet.filter((c) => c.category === category);
  const chips = ["All", ...activeCategories];

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        {chips.map((chip) => {
          const count = chip === "All" ? fleet.length : fleet.filter((c) => c.category === chip).length;
          const active = chip === category;
          return (
            <button
              key={chip}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(chip)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                active
                  ? "border-black bg-black text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-brand"
              }`}
            >
              {chip}
              <span className={`ml-1.5 text-xs ${active ? "text-slate-300" : "text-slate-400"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((car, i) => (
          <FleetCard
            key={car.id}
            car={car}
            href={`/fleet/${car.id}`}
            // Only the first card is above the fold on a phone; making three
            // of them priority just made them compete for bandwidth with the
            // one that decides LCP.
            priority={i === 0}
            // The mobile figure is deliberately below the real ~91vw: the card
            // is 356px wide, so 70vw caps the download at ~2.3x density
            // instead of 3.4x. Half the bytes, no visible difference.
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 70vw"
            showAllRates
          />
        ))}
      </div>
    </>
  );
}
