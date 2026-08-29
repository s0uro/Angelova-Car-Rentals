import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const session = await getSession();
  if (session?.userId) redirect("/admin/dashboard");
  const { reason } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">Admin Login</h1>
      {reason === "expired" ? (
        <p className="mb-6 text-center text-sm text-amber-700">
          Your session expired. Please sign in again.
        </p>
      ) : (
        <p className="mb-6 text-center text-sm text-slate-500">
          Sign in to see reservations and customers.
        </p>
      )}
      <LoginForm />
      <p className="mt-6 text-center text-xs text-slate-400">
        Forgot the password? It is reset by the developer (<code>npm run db:seed</code>).
      </p>
    </main>
  );
}
