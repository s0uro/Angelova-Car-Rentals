import Link from "next/link";
import { verifySession } from "@/app/lib/dal";
import { listCustomers } from "@/app/lib/admin/reservations";
import { formatDate } from "@/app/lib/timezone";

export const metadata = { title: "Customers" };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await verifySession();
  const { q = "" } = await searchParams;
  const customers = await listCustomers(q.slice(0, 80));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Grouped by phone number from all reservations.
          </p>
        </div>
        <form action="/admin/customers" className="flex w-full gap-2 sm:w-auto">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search name or phone…"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 sm:w-72"
          />
          <button type="submit" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Search
          </button>
        </form>
      </div>

      {customers.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          No customers found.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Bookings</th>
                <th className="px-4 py-3 font-medium">Accepted</th>
                <th className="px-4 py-3 font-medium">Last pickup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {customers.map((c) => (
                <tr key={c.phone} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/dashboard?tab=all&q=${encodeURIComponent(c.phone)}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {c.name}
                    </Link>
                    {c.email && <div className="text-slate-400">{c.email}</div>}
                    {c.bookings > 1 && (
                      <span className="mt-1 inline-block rounded-full bg-brand/20 px-2 py-0.5 text-xs font-semibold">
                        Returning
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">{c.phone}</a>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{c.bookings}</td>
                  <td className="px-4 py-3 text-slate-700">{c.confirmed}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(c.lastPickup)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
