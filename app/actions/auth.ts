"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { createSession, deleteSession } from "@/app/lib/session";
import { checkRateLimit } from "@/app/lib/rate-limit";

export type LoginState = { error?: string } | undefined;

const INVALID = "Invalid name or password.";

// Compared against when the user doesn't exist, so a wrong name takes the
// same time as a wrong password (no username enumeration via timing).
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const password = String(formData.get("password") ?? "").slice(0, 200);

  if (!name || !password) {
    return { error: "Name and password are required." };
  }

  if (!(await checkRateLimit("login"))) {
    return { error: "Too many sign-in attempts. Please wait 15 minutes and try again." };
  }

  const admin: { id: string; name: string; passwordHash: string } | null =
    await prisma.adminUser.findUnique({ where: { name } });

  const passwordMatches = await bcrypt.compare(
    password,
    admin?.passwordHash ?? DUMMY_HASH
  );
  if (!admin || !passwordMatches) {
    return { error: INVALID };
  }

  await createSession(admin.id, admin.name);
  redirect("/admin/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
