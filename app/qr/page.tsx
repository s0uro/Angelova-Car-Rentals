import QrCard from "@/components/QrCard";
import { siteConfig } from "@/app/lib/site-config";

/* Standalone (outside the (site) group) so the card renders without the
   navbar/footer chrome — it is meant to be shown on a screen or printed. */

export const metadata = {
  title: "Scan to visit",
  description: `QR code linking to ${siteConfig.shortName}.`,
  robots: { index: false, follow: false },
};

export default function QrPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-8 print:bg-white">
      <QrCard />
    </div>
  );
}
