"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";

const DESKTOP = "(min-width: 640px)";

/**
 * Hero background: the poster is the LCP element (rendered immediately with
 * next/image); ONE video (mobile or desktop) is attached only after the page
 * has loaded, and never when the visitor prefers reduced motion.
 */
// Optimised srcSets for both crops, built once at module scope.
const posterProps = (src: string) =>
  getImageProps({ src, alt: "", width: 1600, height: 1618, quality: 75, sizes: "100vw" }).props;
const desktopPoster = posterProps("/videos/background-poster.jpg");
const mobilePoster = posterProps("/videos/background-mobile-poster.jpg");

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
      {/* Art direction: the two posters are different crops (1600x870 vs
          900x1618). Rendering both as <Image> and hiding one with CSS made
          every visitor download BOTH, and the two competing preloads left
          Lighthouse unable to settle on an LCP element (NO_LCP). A <picture>
          with media conditions fetches exactly one. */}
      <picture>
        <source media={DESKTOP} srcSet={desktopPoster.srcSet} sizes={desktopPoster.sizes} />
        <source srcSet={mobilePoster.srcSet} sizes={mobilePoster.sizes} />
        <img
          src={mobilePoster.src}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
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
