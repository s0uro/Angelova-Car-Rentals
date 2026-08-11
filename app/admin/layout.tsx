import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Back to site
        </Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
