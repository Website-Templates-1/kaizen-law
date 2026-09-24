/**
 * Server-only client for the CENTRAL Review Management API.
 *
 * This portal is a single client of a shared, multi-tenant service. Project
 * isolation is enforced by the API using a per-project bearer key — so this
 * module NEVER sends or trusts a project id, and there is no way to request
 * another project's data.
 *
 * SECURITY:
 *  - `import "server-only"` guarantees this never ends up in a client bundle.
 *  - REVIEW_API_KEY is read here (server) and sent as `Authorization: Bearer`.
 *    It must never be exposed to the browser (no NEXT_PUBLIC_, never returned
 *    to a client component). The browser never calls the central API directly;
 *    it talks only to our own guarded /api/admin/reviews/* route handlers.
 *  - Env is read at call time (not module load) so an unconfigured environment
 *    can't crash the build — the reviews pages are force-dynamic and only
 *    evaluated at request time.
 */
import "server-only";
import { isUnanswered, type ReviewView } from "@/lib/reviews-view";

interface ReviewApiConfig {
  baseUrl: string;
  apiKey: string;
}

/** Read + validate env at call time. Throws a clear error when unconfigured. */
function config(): ReviewApiConfig {
  const baseUrl = process.env.REVIEW_API_URL?.trim();
  const apiKey = process.env.REVIEW_API_KEY?.trim();
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Review API not configured — set REVIEW_API_URL and REVIEW_API_KEY.",
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

async function request<T>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const { baseUrl, apiKey } = config();
  let res: Response;
  try {
    res = await fetch(`${baseUrl}${path}`, {
      method: init?.method ?? "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      // Reviews are always live; never cache the central API response.
      cache: "no-store",
    });
  } catch {
    throw new Error("Could not reach the review service. Try again shortly.");
  }

  if (!res.ok) {
    // Surface a clean, non-leaky message; the raw body may contain internals.
    let detail = "";
    try {
      const data = (await res.json()) as { error?: string; message?: string };
      detail = data.error || data.message || "";
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new Error(
      detail
        ? `Review service error (${res.status}): ${detail}`
        : `Review service error (${res.status}).`,
    );
  }

  return (await res.json()) as T;
}

/** GET /v1/reviews?status=…&limit=… — list reviews for this project. */
export async function listReviews(
  status?: "needs_review" | "approved",
  limit?: number,
): Promise<ReviewView[]> {
  const qs = new URLSearchParams();
  if (status) qs.set("status", status);
  if (typeof limit === "number") qs.set("limit", String(limit));
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return request<ReviewView[]>(`/v1/reviews${suffix}`);
}

/** Reviews with no approved reply yet. */
export async function countUnansweredReviews(): Promise<number> {
  const reviews = await listReviews();
  return reviews.filter(isUnanswered).length;
}

/** GET /v1/reviews/:id — a single review. */
export async function getReview(id: string): Promise<ReviewView> {
  return request<ReviewView>(`/v1/reviews/${encodeURIComponent(id)}`);
}

/** PUT /v1/reviews/:id/reply — save an edited draft (does NOT approve). */
export async function updateReply(id: string, body: string): Promise<ReviewView> {
  return request<ReviewView>(`/v1/reviews/${encodeURIComponent(id)}/reply`, {
    method: "PUT",
    body: { body },
  });
}

/** POST /v1/reviews/:id/reply/regenerate — ask for a fresh draft. */
export async function regenerateReply(id: string): Promise<ReviewView> {
  return request<ReviewView>(
    `/v1/reviews/${encodeURIComponent(id)}/reply/regenerate`,
    { method: "POST" },
  );
}

/** POST /v1/reviews/:id/reply/approve — client approves the response. */
export async function approveReply(id: string): Promise<ReviewView> {
  return request<ReviewView>(
    `/v1/reviews/${encodeURIComponent(id)}/reply/approve`,
    { method: "POST" },
  );
}
