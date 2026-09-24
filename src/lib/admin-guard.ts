/**
 * Shared helpers for the admin API routes: independent auth re-check,
 * same-origin (CSRF) check, and a best-effort in-memory rate limiter.
 * Server-only.
 */
import "server-only";
import { headers } from "next/headers";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { redirectBase } from "@/lib/redirect-base";
import { adminFeatures, site } from "@/lib/site.config";

/** Reject cross-origin POSTs (defense-in-depth alongside SameSite=Strict). */
export async function sameOrigin(): Promise<boolean> {
  const origin = (await headers()).get("origin");
  if (!origin) return true; // non-browser callers (cron) send no Origin
  try {
    const host = new URL(origin).hostname;
    return (
      host === new URL(site.domain).hostname ||
      host === "localhost" ||
      host === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

/** 303 to a same-site admin path on the public origin. */
export async function adminRedirect(path: string): Promise<NextResponse> {
  return NextResponse.redirect(
    new URL(path, redirectBase(await headers())),
    303,
  );
}

export async function requireSession(): Promise<boolean> {
  return isAuthenticated();
}

/** False until the client enables AI review-reply management. */
export function reviewRepliesEnabled(): boolean {
  return adminFeatures.reviewReplies;
}

/** Constant-time bearer check for the cron-triggered generator. */
export async function hasCronSecret(): Promise<boolean> {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const h = await headers();
  const auth = h.get("authorization") ?? "";
  const provided = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(secret, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

const hits = new Map<string, { count: number; resetAt: number }>();

/** Best-effort per-key limiter (per instance; fine for a single-owner admin). */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= max;
}
