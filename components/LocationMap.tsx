"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { siteConfig } from "@/app/lib/site-config";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Interactive map for the footer. Starts zoomed out and tilted, then flies
 * in to the business location once the map scrolls into view -- skipped in
 * favour of an instant jump when the visitor prefers reduced motion.
 */
export default function LocationMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const target: [number, number] = [siteConfig.geo.lng, siteConfig.geo.lat];
    const reduced = prefersReducedMotion();

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: reduced ? target : [target[0], target[1] - 6],
      zoom: reduced ? 15 : 2,
      pitch: reduced ? 0 : 40,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    new mapboxgl.Marker({ color: "#c8a008" }).setLngLat(target).addTo(map);

    let io: IntersectionObserver | null = null;
    let flown = false;

    function flyIn() {
      if (flown) return;
      flown = true;
      if (reduced) {
        map.jumpTo({ center: target, zoom: 15, pitch: 0 });
      } else {
        map.flyTo({
          center: target,
          zoom: 15,
          pitch: 45,
          bearing: -15,
          duration: 2500,
          essential: true,
        });
      }
    }

    if (reduced) {
      flyIn();
    } else {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) flyIn();
        },
        { threshold: 0.4 }
      );
      io.observe(containerRef.current);
    }

    return () => {
      io?.disconnect();
      map.remove();
    };
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <a
        href={siteConfig.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-600 hover:text-brand-dark"
      >
        View on Google Maps
      </a>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
