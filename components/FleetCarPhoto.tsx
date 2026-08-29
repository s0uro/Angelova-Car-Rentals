"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const CYCLE_MS = 2800;

/**
 * Cross-fading car photos. Only the current and next image are mounted, the
 * cycle runs only while visible and the tab is active, and never with
 * prefers-reduced-motion.
 */
export default function FleetCarPhoto({
  images,
  name,
  className = "",
  sizes,
  priority = false,
}: {
  images: string[];
  name: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: "100px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (images.length < 2 || !visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setActive((i) => (i + 1) % images.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [images.length, visible]);

  const src = images[0];

  if (!src) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-slate-100 ${className}`}>
        <div className="px-4 text-center">
          <svg className="mx-auto h-8 w-8 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path
              d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13M4 13h16v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="7.5" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="16.5" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
          </svg>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">Photo coming soon</p>
        </div>
      </div>
    );
  }

  const next = images.length > 1 ? (active + 1) % images.length : null;
  const mounted = next === null ? [active] : [active, next];

  return (
    <div ref={ref} className="absolute inset-0">
      {mounted.map((i) => (
        <Image
          key={images[i]}
          src={images[i]}
          alt={i === 0 ? name : `${name} — photo ${i + 1}`}
          fill
          priority={priority && i === 0}
          loading={priority && i === 0 ? undefined : "lazy"}
          sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
          className={`object-cover transition-opacity duration-700 ease-in-out ${className} ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
