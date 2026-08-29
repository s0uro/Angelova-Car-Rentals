import Link from "next/link";
import { getSession } from "@/app/lib/session";
import LogoutButton from "@/components/LogoutButton";

export const metadata = { robots: { index: false, follow: false } };

const nav = [
  { href: "/admin/dashboard", label: "Reservations" },
  { href: "/admin/customers", label: "Customers" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-black text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link
            href={session ? "/admin/dashboard" : "/"}
            className="-skew-x-[20deg] bg-brand px-4 py-1 text-sm font-bold text-black"
          >
            <span className="inline-block skew-x-[20deg]">Angelova · Admin</span>
          </Link>
          {session && (
            <nav className="flex items-center gap-1 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
          <div className="ml-auto flex items-center gap-3 text-sm">
            <Link href="/" className="hidden text-slate-300 hover:text-white sm:inline">
              View site ↗
            </Link>
            {session && (
              <>
                <span className="hidden text-slate-400 sm:inline">{session.name}</span>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
