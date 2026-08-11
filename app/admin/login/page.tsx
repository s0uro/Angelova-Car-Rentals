import LoginForm from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="mb-6 text-center text-2xl font-semibold text-slate-900">
        Admin Login
      </h1>
      <LoginForm />
    </main>
  );
}
