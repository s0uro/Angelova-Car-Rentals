import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/app/lib/site-config";
import "./globals.css";

const geistSans = { variable: "" }; const geistMono = { variable: "" };

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
