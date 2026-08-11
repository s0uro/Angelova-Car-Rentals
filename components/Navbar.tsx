import Link from "next/link";
import Image from "next/image";
import { siteConfig, navLinks } from "@/app/lib/site-config";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt={siteConfig.shortName}
            width={806}
            height={419}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-700 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-brand-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/booking"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-black hover:bg-brand-dark"
        >
          Book now
        </Link>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 text-sm font-medium text-slate-700 sm:hidden">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap hover:text-brand-dark">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
