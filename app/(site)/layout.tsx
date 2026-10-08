import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import CookieConsent from "@/components/CookieConsent";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* Clears the fixed header: hamburger button below xl, full bar from xl.
          The home hero pulls itself back up by the same amount (-mt-*). */}
      <main className="flex-1 pt-20 sm:pt-24 xl:pt-36">{children}</main>
      <Footer />
      {/* Space so the fixed bar never covers the footer's last line. Must
          match MobileActionBar's actual height, including the safe-area
          inset it pads for on phones with a home indicator. */}
      <div
        className="xl:hidden"
        style={{ height: "calc(4rem + env(safe-area-inset-bottom))" }}
        aria-hidden="true"
      />
      <MobileActionBar />
      <CookieConsent />
    </>
  );
}
