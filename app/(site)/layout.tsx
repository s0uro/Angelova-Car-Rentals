import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import CookieConsent from "@/components/CookieConsent";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 sm:pt-28 lg:pt-32">{children}</main>
      <Footer />
      {/* Space so the fixed bar never covers the footer's last line. Must
          match MobileActionBar's actual height, including the safe-area
          inset it pads for on phones with a home indicator. */}
      <div
        className="lg:hidden"
        style={{ height: "calc(4rem + env(safe-area-inset-bottom))" }}
        aria-hidden="true"
      />
      <MobileActionBar />
      <CookieConsent />
    </>
  );
}
