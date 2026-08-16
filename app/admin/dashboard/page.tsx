import { verifySession } from "@/app/lib/dal";
import { prisma } from "@/app/lib/prisma";
import ReservationsTable from "@/components/ReservationsTable";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminDashboardPage() {
  const session = await verifySession();

  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Reservations
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Signed in as {session.name}
          </p>
        </div>
        <LogoutButton />
      </div>
      <ReservationsTable reservations={reservations} />
    </div>
  );
}
