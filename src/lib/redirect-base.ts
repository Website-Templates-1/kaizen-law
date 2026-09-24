/**
 * Base origin for admin 303s. Never use `request.url` — on some hosts that is
 * the deploy host, not the custom domain.
 *
 * Production always uses `site.domain`. Localhost stays local.
 */
import { site } from "@/lib/site.config";

export function redirectBase(h: { get(name: string): string | null }): string {
  const origin = h.get("origin");
  const host = h.get("host") ?? "";
  const local = [origin, host].some(
    (v) => v?.includes("localhost") || v?.includes("127.0.0.1"),
  );
  if (local) {
    if (origin) return new URL(origin).origin;
    return `http://${host}`;
  }
  return site.domain;
}
