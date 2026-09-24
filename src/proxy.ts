/**
 * Edge gate for the admin area (Next 16 renamed `middleware` → `proxy`;
 * defaults to the Node.js runtime, so Node `crypto` verification works here).
 *
 * This is a convenience redirect, NOT the security boundary — every
 * /api/admin/* handler and admin/layout.tsx re-verify independently.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redirectBase } from "@/lib/redirect-base";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The cron-triggered generator authenticates with a bearer secret, not a
  // session cookie — let it through to do its own auth in the handler.
  if (pathname === "/api/admin/generate") return NextResponse.next();
  if (PUBLIC_ADMIN_PATHS.includes(pathname)) return NextResponse.next();

  const valid =
    verifySession(request.cookies.get(SESSION_COOKIE)?.value) !== null;
  if (valid) return NextResponse.next();

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(
    new URL("/admin/login", redirectBase(request.headers)),
  );
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
