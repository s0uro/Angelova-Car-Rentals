"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const BookingForm = dynamic(() => import("@/components/BookingForm"), {
  ssr: false,
});

/**
 * The booking form is the single heaviest client bundle on the home page
 * (schema + country list + taxi data). It sits well below the fold, so we
 * only load it once the visitor scrolls near it — or immediately if they
 * arrived on a /#booking deep link.
 */
export default function LazyBookingForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Arrived on a /#booking deep link (incl. ?type=taxi params) — load now.
    if (window.location.hash.startsWith("#booking")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {show ? (
        <BookingForm />
      ) : (
        <div
          aria-hidden="true"
          className="mx-auto h-[560px] w-full max-w-3xl animate-pulse rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200"
        />
      )}
    </div>
  );
}
