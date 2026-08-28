import "server-only";
import { prisma } from "@/app/lib/prisma";
import type { Reservation } from "@/app/generated/prisma/client";
export { referenceOf } from "@/app/lib/admin/reference";

export const ADMIN_TABS = ["pending", "upcoming", "past", "rejected", "all"] as const;
export type AdminTab = (typeof ADMIN_TABS)[number];

export const TAB_LABELS: Record<AdminTab, string> = {
  pending: "Pending",
  upcoming: "Upcoming",
  past: "Past",
  rejected: "Rejected",
  all: "All",
};

export const PAGE_SIZE = 25;

/** Digits only (plus leading +) so "+357 99 123456" and "+35799123456" match. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? "+" + digits.slice(1).replace(/\+/g, "") : digits;
}

type Where = Record<string, unknown>;

function tabWhere(tab: AdminTab, now: Date): Where {
  switch (tab) {
    case "pending":
      return { status: "new" };
    case "upcoming":
      return { status: "confirmed", pickupDate: { gte: now } };
    case "past":
      return { status: { in: ["new", "confirmed"] }, pickupDate: { lt: now } };
    case "rejected":
      return { status: { in: ["rejected", "expired"] } };
    default:
      return {};
  }
}

function searchWhere(q: string): Where {
  const term = q.trim();
  if (!term) return {};
  const digits = normalizePhone(term);
  const or: Where[] = [
    { name: { contains: term, mode: "insensitive" } },
    { surname: { contains: term, mode: "insensitive" } },
    { email: { contains: term, mode: "insensitive" } },
    { carName: { contains: term, mode: "insensitive" } },
    { pickupLocation: { contains: term, mode: "insensitive" } },
    { dropoffLocation: { contains: term, mode: "insensitive" } },
    { id: { endsWith: term.toLowerCase() } },
  ];
  if (digits.replace("+", "").length >= 4) {
    or.push({ phone: { contains: digits.replace("+", "") } });
  }
  return { OR: or };
}

export type ListParams = { tab: AdminTab; q: string; page: number };

export async function listReservations({ tab, q, page }: ListParams) {
  const now = new Date();
  const where: Where = { AND: [tabWhere(tab, now), searchWhere(q)] };
  const orderBy =
    tab === "upcoming" ? { pickupDate: "asc" } : { createdAt: "desc" };

  const [items, total]: [Reservation[], number] = await Promise.all([
    prisma.reservation.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.reservation.count({ where }),
  ]);

  return { items, total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function tabCounts(q: string): Promise<Record<AdminTab, number>> {
  const now = new Date();
  const search = searchWhere(q);
  const entries = await Promise.all(
    ADMIN_TABS.map(async (tab) => {
      const n: number = await prisma.reservation.count({
        where: { AND: [tabWhere(tab, now), search] },
      });
      return [tab, n] as const;
    })
  );
  return Object.fromEntries(entries) as Record<AdminTab, number>;
}

export async function dashboardStats() {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const [newToday, pending, pickupsSoon, carsOut]: number[] = await Promise.all([
    prisma.reservation.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.reservation.count({ where: { status: "new" } }),
    prisma.reservation.count({
      where: { status: "confirmed", pickupDate: { gte: now, lte: in48h } },
    }),
    prisma.reservation.count({
      where: {
        type: "car",
        status: "confirmed",
        pickupDate: { lte: now },
        OR: [{ dropoffDate: { gte: now } }, { dropoffDate: null }],
      },
    }),
  ]);

  return { newToday, pending, pickupsSoon, carsOut };
}

export async function getReservation(id: string): Promise<Reservation | null> {
  if (!id || id.length > 64) return null;
  return prisma.reservation.findUnique({ where: { id } });
}

/** Other bookings from the same phone number, newest pickup first. */
export async function customerHistory(phone: string, excludeId?: string): Promise<Reservation[]> {
  const digits = normalizePhone(phone).replace("+", "");
  if (digits.length < 6) return [];
  const rows: Reservation[] = await prisma.reservation.findMany({
    where: { phone: { contains: digits.slice(-9) } },
    orderBy: { pickupDate: "desc" },
    take: 50,
  });
  return rows.filter((r) => r.id !== excludeId);
}

/** Car bookings that overlap this one (should be empty; shown for trust). */
export async function overlappingBookings(r: Reservation): Promise<Reservation[]> {
  if (r.type !== "car" || !r.carName) return [];
  const end = r.dropoffDate ?? new Date(r.pickupDate.getTime() + 24 * 60 * 60 * 1000);
  return prisma.reservation.findMany({
    where: {
      id: { not: r.id },
      type: "car",
      carName: r.carName,
      status: { in: ["new", "confirmed"] },
      pickupDate: { lt: end },
      OR: [{ dropoffDate: { gt: r.pickupDate } }, { dropoffDate: null }],
    },
    orderBy: { pickupDate: "asc" },
  });
}

export type CustomerSummary = {
  phone: string;
  name: string;
  email: string | null;
  bookings: number;
  confirmed: number;
  lastPickup: Date;
};

/** Customers derived from reservations, grouped by normalised phone. */
export async function listCustomers(q: string): Promise<CustomerSummary[]> {
  const rows: Reservation[] = await prisma.reservation.findMany({
    where: searchWhere(q),
    orderBy: { pickupDate: "desc" },
    take: 2000,
  });
  const map = new Map<string, CustomerSummary>();
  for (const r of rows) {
    const key = normalizePhone(r.phone);
    const existing = map.get(key);
    if (existing) {
      existing.bookings += 1;
      if (r.status === "confirmed") existing.confirmed += 1;
      if (!existing.email && r.email) existing.email = r.email;
    } else {
      map.set(key, {
        phone: r.phone,
        name: `${r.name} ${r.surname}`.trim(),
        email: r.email,
        bookings: 1,
        confirmed: r.status === "confirmed" ? 1 : 0,
        lastPickup: r.pickupDate,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.lastPickup.getTime() - a.lastPickup.getTime());
}
