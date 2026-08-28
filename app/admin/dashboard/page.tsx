import Link from "next/link";
import { verifySession } from "@/app/lib/dal";
import {
  ADMIN_TABS,
  TAB_LABELS,
  PAGE_SIZE,
  type AdminTab,
  listReservations,
  tabCounts,
  dashboardStats,
} from "@/app/lib/admin/reservations";
import ReservationsTable from "@/components/ReservationsTable";

export const metadata = { title: "Reservations" };

type Search = { tab?: string; q?: string; page?: string };

function href(params: Partial<Search>, base: Search) {
  const merged = { ...base, ...params };
  const sp = new URLSearchParams();
  if (merged.tab && merged.tab !== "pending") sp.set("tab", merged.tab);
  if (merged.q) sp.set("q", merged.q);
  if (merged.page && merged.page !== "1") sp.set("page", merged.page);
  const s = sp.toString();
  return `/admin/dashboard${s ? `?${s}` : ""}`;
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  await verifySession();
  const raw = await searchParams;
  const tab: AdminTab = ADMIN_TABS.includes(raw.tab as AdminTab) ? (raw.tab as AdminTab) : "pending";
  const q = (raw.q ?? "").slice(0, 80);
  const page = Math.max(1, Number.parseInt(raw.page ?? "1", 10) || 1);
  const current: Search = { tab, q, page: String(page) };

  const [{ items, total, pages }, counts, stats] = await Promise.all([
    listReservations({ tab, q, page }),
    tabCounts(q),
    dashboardStats(),
  ]);

  const statCards = [
    { label: "New today", value: stats.newToday, to: href({ tab: "all", page: "1" }, { q }) },
    { label: "Pending", value: stats.pending, to: href({ tab: "pending", page: "1" }, { q }) },
    { label: "Pickups next 48h", value: stats.pickupsSoon, to: href({ tab: "upcoming", page: "1" }, { q }) },
    { label: "Cars out now", value: stats.carsOut, to: href({ tab: "upcoming", page: "1" }, { q }) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Reservations</h1>
        <form action="/admin/dashboard" className="flex w-full gap-2 sm:w-auto">
          <input type="hidden" name="tab" value={tab} />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search name, phone, car, reference…"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 sm:w-72"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((s) => (
          <Link
            key={s.label}
            href={s.to}
            className="rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-brand"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200">
        {ADMIN_TABS.map((t) => (
          <Link
            key={t}
            href={href({ tab: t, page: "1" }, { q })}
            aria-current={t === tab ? "page" : undefined}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              t === tab
                ? "border-brand text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {TAB_LABELS[t]}
            <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
              {counts[t]}
            </span>
          </Link>
        ))}
      </div>

      {q && (
        <p className="mt-4 text-sm text-slate-600">
          {total} result{total === 1 ? "" : "s"} for “{q}” ·{" "}
          <Link href={href({ q: "", page: "1" }, current)} className="text-brand-dark underline">
            clear
          </Link>
        </p>
      )}

      <div className="mt-4">
        <ReservationsTable reservations={items} emptyHint={tab === "pending" ? "No pending reservations — nice and quiet." : "Nothing here."} />
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={href({ page: String(page - 1) }, current)} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 hover:border-brand">
                ← Previous
              </Link>
            )}
            {page < pages && (
              <Link href={href({ page: String(page + 1) }, current)} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 hover:border-brand">
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
