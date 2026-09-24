import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  requireSession,
  sameOrigin,
  rateLimit,
  adminRedirect,
} from "@/lib/admin-guard";
import {
  verifyPassword,
  passwordPolicyError,
  replaceOwnerPassword,
} from "@/lib/auth";
import { loadOwnerRecord } from "@/lib/credentials";

export async function POST(request: NextRequest) {
  if (!(await requireSession()))
    return new NextResponse("Unauthorized", { status: 401 });
  if (!(await sameOrigin()))
    return new NextResponse("Bad origin", { status: 403 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(`password:${ip}`, 8, 15 * 60_000)) {
    return adminRedirect("/admin/account?error=rate");
  }

  const form = await request.formData();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  const fail = (code: string) =>
    adminRedirect(`/admin/account?error=${encodeURIComponent(code)}`);

  const stored = await loadOwnerRecord();
  if (!stored) return fail("config");
  if (!verifyPassword(current, stored.passwordHash)) return fail("current");
  if (next !== confirm) return fail("mismatch");
  if (current === next) return fail("same");
  const policy = passwordPolicyError(next);
  if (policy) {
    return adminRedirect(`/admin/account?error=${encodeURIComponent(policy)}`);
  }

  try {
    await replaceOwnerPassword(stored.username, next);
  } catch {
    return fail("save");
  }

  return adminRedirect("/admin/account?saved=1");
}
