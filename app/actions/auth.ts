"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { createSession, deleteSession } from "@/app/lib/session";

export type LoginState = { error?: string } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !password) {
    return { error: "Name and password are required." };
  }

  const admin = await prisma.adminUser.findUnique({ where: { name } });
  if (!admin) {
    return { error: "Invalid name or password." };
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) {
    return { error: "Invalid name or password." };
  }

  await createSession(admin.id, admin.name);
  redirect("/admin/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
