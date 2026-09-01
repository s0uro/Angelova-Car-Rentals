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
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self' data:",
  // The footer map is a Google Maps embed (components/LocationMap.tsx).
  "frame-src https://www.google.com",
  "worker-src 'self' blob:",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
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
  // Next 16 only serves the qualities listed here. 60 is for the car cards:
  // at card size the difference from 75 is invisible, the bytes are not.
  images: { qualities: [60, 75] },
  // These used to be page files that rendered an RSC only to redirect.
  async redirects() {
    return [
      { source: "/booking", destination: "/#booking", permanent: false },
      { source: "/pricing", destination: "/taxi", permanent: false },
      { source: "/contact", destination: "/#contact", permanent: false },
      { source: "/faq", destination: "/#faq", permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
