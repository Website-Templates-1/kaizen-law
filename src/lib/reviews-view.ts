/**
 * Pure, framework-free view helpers for the client-facing Review Management UI.
 *
 * Intentionally NO `server-only` and NO `next/*` imports: these are pure
 * functions that derive display state from the ReviewView data model, so they
 * can be reasoned about (and unit-tested) in isolation. Rendering code in the
 * server components/pages consumes these; the central API is never touched
 * here.
 *
 * The types mirror the CENTRAL REVIEW API contract exactly — the server
 * deliberately omits all internal/Google/publishing fields, so this is the
 * complete shape the client may ever see.
 */

export type ReplyStatus =
  | "draft"
  | "pending"
  | "generating"
  | "failed"
  | (string & {});

export type AnalysisStatus = "ready" | (string & {});

export type ApprovalStatus = "awaiting_client" | "approved";

export interface ReviewAnalysis {
  status: AnalysisStatus;
  sentiment: string;
  topics: string[];
  summary: string;
  suggestedTone: string;
}

export interface ReviewReply {
  status: ReplyStatus;
  body: string;
  generatedAt: string | null;
  editedAt: string | null;
}

export interface ReviewApproval {
  status: ApprovalStatus;
  approvedAt: string | null;
}

export interface ReviewView {
  id: string;
  author: { name: string };
  rating: number;
  text: string;
  reviewedAt: string;
  language: string;
  analysis: ReviewAnalysis;
  reply: ReviewReply;
  approval: ReviewApproval;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Stage — a single client-facing label derived from real state.       */
/* ------------------------------------------------------------------ */

export type ReviewStage = "approved" | "needs_review" | "preparing" | "attention";

/**
 * Collapse the raw reply/approval state into one client-facing stage.
 * Approval always wins; then a draft awaiting the client needs review;
 * an in-flight reply is "preparing"; a failed reply needs attention.
 */
export function reviewStage(review: ReviewView): ReviewStage {
  const replyStatus = review.reply?.status;
  const approvalStatus = review.approval?.status;

  if (approvalStatus === "approved") return "approved";
  if (replyStatus === "draft" && approvalStatus === "awaiting_client")
    return "needs_review";
  if (replyStatus === "pending" || replyStatus === "generating")
    return "preparing";
  if (replyStatus === "failed") return "attention";
  // Safe fallback for any not-yet-classified state: treat as preparing so the
  // client isn't prompted to act on something that isn't ready.
  return "preparing";
}

export function stageLabel(stage: ReviewStage): string {
  switch (stage) {
    case "approved":
      return "Approved";
    case "needs_review":
      return "Needs your review";
    case "attention":
      return "Needs attention";
    case "preparing":
    default:
      return "Preparing";
  }
}

/** Classes for a stage pill in the Kaizen (black + gold) admin palette. */
export function stageBadgeClass(stage: ReviewStage): string {
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold";
  switch (stage) {
    case "approved":
      return `${base} border-emerald-400/30 bg-emerald-400/10 text-emerald-300`;
    case "needs_review":
      return `${base} border-gold/40 bg-gold/10 text-gold-bright`;
    case "attention":
      return `${base} border-red-400/30 bg-red-400/10 text-red-300`;
    case "preparing":
    default:
      return `${base} border-white/12 bg-white/5 text-cream/55`;
  }
}

/* ------------------------------------------------------------------ */
/* Filters                                                             */
/* ------------------------------------------------------------------ */

/** No approved reply yet — the owner still needs to respond (on Google, or here if the package is on). */
export function isUnanswered(review: ReviewView): boolean {
  return review.approval?.status !== "approved";
}

export type ReviewFilter =
  | "all"
  | "needs_review"
  | "approved"
  | "unanswered"
  | "replied";

/** Filters when AI reply management is enabled. */
export const REVIEW_FILTERS: readonly ReviewFilter[] = [
  "all",
  "needs_review",
  "approved",
] as const;

/** Filters when the client can view reviews but not draft/post replies. */
export const REVIEW_FILTERS_READONLY: readonly ReviewFilter[] = [
  "all",
  "unanswered",
  "replied",
] as const;

export function isReviewFilter(value: unknown): value is ReviewFilter {
  return (
    value === "all" ||
    value === "needs_review" ||
    value === "approved" ||
    value === "unanswered" ||
    value === "replied"
  );
}

/** Map a UI filter to the central API `status` query value (or none for all). */
export function statusFilterToParam(
  filter: ReviewFilter,
): "needs_review" | "approved" | undefined {
  switch (filter) {
    case "needs_review":
      return "needs_review";
    case "approved":
    case "replied":
      return "approved";
    case "all":
    case "unanswered":
    default:
      return undefined;
  }
}

export function filterLabel(filter: ReviewFilter): string {
  switch (filter) {
    case "needs_review":
      return "Needs review";
    case "approved":
      return "Approved";
    case "unanswered":
      return "Unanswered";
    case "replied":
      return "Replied";
    case "all":
    default:
      return "All";
  }
}

/* ------------------------------------------------------------------ */
/* Presentation helpers                                                */
/* ------------------------------------------------------------------ */

export type Sentiment = "Positive" | "Neutral" | "Negative" | "—";

/** Normalize a free-form sentiment string to a fixed display label. */
export function normalizeSentiment(s: string | null | undefined): Sentiment {
  const v = (s ?? "").trim().toLowerCase();
  if (v === "positive") return "Positive";
  if (v === "neutral") return "Neutral";
  if (v === "negative") return "Negative";
  return "—";
}

/** Derive filled/empty star counts for a 1–5 rating (clamped, integer). */
export function starDisplay(rating: number): { filled: number; empty: number } {
  const n = Number.isFinite(rating) ? Math.round(rating) : 0;
  const filled = Math.max(0, Math.min(5, n));
  return { filled, empty: 5 - filled };
}

/** A short single-line snippet of the review text for list rows. */
export function snippet(text: string, max = 160): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + "…";
}
