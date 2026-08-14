import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 sm:pt-28 lg:pt-32">{children}</main>
      <Footer />
    </>
  );
}
