"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const DESKTOP = "(min-width: 640px)";

/**
 * Hero background: the poster is the LCP element (rendered immediately with
 * next/image); ONE video (mobile or desktop) is attached only after the page
 * has loaded, and never when the visitor prefers reduced motion.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pick = () =>
      window.matchMedia(DESKTOP).matches ? "/videos/background.mp4" : "/videos/background-mobile.mp4";

    let cancelled = false;
    const start = () => {
      if (!cancelled) setSrc(pick());
    };
    if (document.readyState === "complete") {
      // Give the poster and fonts a head start before pulling ~1–2 MB of video.
      const id = window.setTimeout(start, 300);
      return () => {
        cancelled = true;
        window.clearTimeout(id);
      };
    }
    window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
    };
  }, []);

  // Pause when the hero scrolls out of view (saves CPU/battery on mobile).
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !src) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <>
      <Image
        src="/videos/background-poster.jpg"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="hidden object-cover sm:block"
      />
      <Image
        src="/videos/background-mobile-poster.jpg"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover sm:hidden"
      />
      {src && (
        <video
          ref={videoRef}
          key={src}
          src={src}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
