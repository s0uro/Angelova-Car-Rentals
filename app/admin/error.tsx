"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Couldn&apos;t load this page</h1>
      <p className="mt-2 text-slate-600">
        Something went wrong talking to the database. This is usually temporary — try again in a
        moment. If it keeps happening, check that the database is running.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Try again
        </button>
        <Link
          href="/admin/dashboard"
          className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-800 hover:border-slate-400"
        >
          Back to dashboard
        </Link>
      </div>
      {error.digest && <p className="mt-6 font-mono text-xs text-slate-400">{error.digest}</p>}
    </div>
  );
}
