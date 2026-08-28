import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 sm:pt-28 lg:pt-32">{children}</main>
      <Footer />
      {/* Space so the fixed bar never covers the footer's last line. */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
      <MobileActionBar />
    </>
  );
}
