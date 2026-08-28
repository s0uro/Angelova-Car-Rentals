import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt, SESSION_COOKIE, SESSION_DURATION_MS } from "@/app/lib/session";

const protectedPrefixes = ["/admin/dashboard", "/admin/reservations", "/admin/customers", "/admin/export"];

// Re-issue the session cookie when it has less than this long left, so the
// owner isn't logged out mid-week while actively using the dashboard.
const RENEW_BEFORE_MS = 2 * 24 * 60 * 60 * 1000;

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedPrefixes.some((route) => path.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    const login = new URL("/admin/login", req.nextUrl);
    if (cookie) login.searchParams.set("reason", "expired");
    return NextResponse.redirect(login);
  }

  const res = NextResponse.next();
  const expiresAtMs = (session.exp ?? 0) * 1000;
  if (expiresAtMs && expiresAtMs - Date.now() < RENEW_BEFORE_MS) {
    const fresh = await encrypt({ userId: session.userId, name: session.name });
    res.cookies.set(SESSION_COOKIE, fresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + SESSION_DURATION_MS),
      sameSite: "lax",
      path: "/",
    });
  }
  return res;
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/reservations/:path*",
    "/admin/customers/:path*",
    "/admin/export/:path*",
  ],
};
