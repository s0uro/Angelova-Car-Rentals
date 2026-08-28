import localFont from "next/font/local";

export const dancingScript = localFont({
  // Subset to the brand wordmark characters only (see scripts/subset-font.py).
  src: "../../fonts/dancing-script/DancingScript-subset.woff2",
  variable: "--font-dancing-script",
  display: "swap",
});
