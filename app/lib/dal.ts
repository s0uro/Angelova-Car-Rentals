import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";

export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/admin/login");
  }
  return session;
});
