import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy. `unsafe-inline` for scripts is required by Next.js
// (inline hydration scripts) unless nonces are wired up; `unsafe-eval` only in
// dev for React Fast Refresh. Widen a directive only when something breaks —
// check the browser console on the Vercel preview after any change.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://api.mapbox.com",
  "media-src 'self'",
  "font-src 'self' data:",
  // No iframes on the page anymore (the footer map is Mapbox GL, rendered
  // to a canvas, not embedded) -- default-src 'self' already covers it.
  "worker-src 'self' blob:",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://api.mapbox.com https://events.mapbox.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // These used to be page files that rendered an RSC only to redirect.
  async redirects() {
    return [
      { source: "/booking", destination: "/#booking", permanent: false },
      { source: "/pricing", destination: "/#taxi", permanent: false },
      { source: "/taxi", destination: "/#taxi", permanent: false },
      { source: "/contact", destination: "/#contact", permanent: false },
      { source: "/faq", destination: "/#faq", permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
