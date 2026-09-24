import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyCredentials, startSession } from "@/lib/auth";
import { rateLimit, sameOrigin, adminRedirect } from "@/lib/admin-guard";

export async function POST(request: NextRequest) {
  if (!(await sameOrigin()))
    return new NextResponse("Bad origin", { status: 403 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(`login:${ip}`, 5, 60_000)) {
    return adminRedirect("/admin/login?error=rate");
  }

  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");

  if (await verifyCredentials(username, password)) {
    await startSession(username);
    return adminRedirect("/admin");
  }
  return adminRedirect("/admin/login?error=1");
}
