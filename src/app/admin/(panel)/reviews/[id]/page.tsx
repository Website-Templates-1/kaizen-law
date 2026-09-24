import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmitAction } from "../../SubmitAction";
import { getReview } from "@/lib/review-api";
import {
  normalizeSentiment,
  reviewStage,
  stageBadgeClass,
  stageLabel,
  starDisplay,
  type ReviewView,
} from "@/lib/reviews-view";
import { formatDate } from "@/lib/format";
import { cardPanel, chipIdle, chipPrimary, eyebrow, fieldInput } from "../../ui";
import { adminFeatures, googleBusiness } from "@/lib/site.config";

export const dynamic = "force-dynamic";

function Stars({ rating }: { rating: number }) {
  const { filled, empty } = starDisplay(rating);
  return (
    <span
      className="text-base text-gold"
      aria-label={`${filled} out of 5 stars`}
    >
      <span aria-hidden="true">{"★".repeat(filled)}</span>
      <span aria-hidden="true" className="text-cream/20">
        {"★".repeat(empty)}
      </span>
    </span>
  );
}

function AnalysisRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className={eyebrow}>{label}</dt>
      <dd className="text-sm text-cream">{children}</dd>
    </div>
  );
}

export default async function ReviewDetailPage({
  params,
  searchParams,
}: PageProps<"/admin/reviews/[id]">) {
  const { id } = await params;
  const sp = await searchParams;

  let review: ReviewView | null = null;
  let loadError: string | null = null;
  try {
    review = await getReview(id);
  } catch (err) {
    loadError =
      err instanceof Error ? err.message : "Could not load this review.";
  }

  if (!loadError && !review) notFound();

  const notice =
    sp.notice === "saved"
      ? "Changes saved."
      : sp.notice === "regenerated"
        ? "A fresh response has been drafted."
        : null;
  const error =
    typeof sp.error === "string" ? sp.error : loadError ? loadError : null;

  if (!review) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/reviews"
          className="text-sm text-cream/55 hover:text-cream"
        >
          ← Back to reviews
        </Link>
        <p className="rounded-[10px] border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      </div>
    );
  }

  const stage = reviewStage(review);
  const managed = adminFeatures.reviewReplies;
  const unanswered = review.approval?.status !== "approved";
  const approved = review.approval?.status === "approved";
  const analysis = review.analysis;
  const sentiment = normalizeSentiment(analysis?.sentiment);
  const topics = (analysis?.topics ?? []).filter((t) => t && t.trim());
  const analysisReady = analysis?.status === "ready";
  const hasAnyAnalysis =
    sentiment !== "—" ||
    topics.length > 0 ||
    Boolean(analysis?.summary?.trim()) ||
    Boolean(analysis?.suggestedTone?.trim());

  return (
    <div className="space-y-6">
      <Link
        href="/admin/reviews"
        className="text-sm text-cream/55 hover:text-cream"
      >
        ← Back to reviews
      </Link>

      {notice && (
        <p className="rounded-[10px] border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {notice}
        </p>
      )}
      {error && (
        <p className="rounded-[10px] border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* Review block */}
      <section className={cardPanel}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Stars rating={review.rating} />
            <span className="font-semibold text-cream">
              {review.author?.name || "Anonymous"}
            </span>
            <span className="text-xs text-cream/45">
              {formatDate(review.reviewedAt)}
            </span>
          </div>
          <span
            className={stageBadgeClass(
              managed ? stage : unanswered ? "needs_review" : "approved",
            )}
          >
            {managed ? stageLabel(stage) : unanswered ? "Unanswered" : "Replied"}
          </span>
        </div>
        {review.text && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-cream/70">
            {review.text}
          </p>
        )}
      </section>

      {/* AI analysis block */}
      <section className={cardPanel}>
        <h2 className={eyebrow}>AI analysis</h2>
        {!analysisReady && (
          <p className="mt-3 text-sm text-cream/55">Analysis in progress…</p>
        )}
        {analysisReady && !hasAnyAnalysis && (
          <p className="mt-3 text-sm text-cream/55">
            No analysis details available for this review.
          </p>
        )}
        {analysisReady && hasAnyAnalysis && (
          <dl className="mt-4 space-y-4">
            {sentiment !== "—" && (
              <AnalysisRow label="Sentiment">{sentiment}</AnalysisRow>
            )}
            {topics.length > 0 && (
              <AnalysisRow label="Key themes">
                <span className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-cream"
                    >
                      {t}
                    </span>
                  ))}
                </span>
              </AnalysisRow>
            )}
            {analysis?.summary?.trim() && (
              <AnalysisRow label="What stood out">{analysis.summary}</AnalysisRow>
            )}
            {analysis?.suggestedTone?.trim() && (
              <AnalysisRow label="Recommended approach">
                {analysis.suggestedTone}
              </AnalysisRow>
            )}
          </dl>
        )}
      </section>

      {/* Suggested response block */}
      <section className={cardPanel}>
        <h2 className={eyebrow}>Suggested response</h2>

        {!managed && (
          <div
            role="status"
            className="mt-4 rounded-[10px] border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-bright"
          >
            <p className="font-semibold">Reply actions aren&apos;t enabled</p>
            <p className="mt-1 text-cream/70">
              You can read the analysis and the drafted reply, but saving,
              regenerating, and approving aren&apos;t enabled yet. Reply from
              your{" "}
              <a
                href={googleBusiness.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gold-bright underline"
              >
                Google Business Profile
              </a>{" "}
              instead.
            </p>
          </div>
        )}

        {approved ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-[10px] border border-emerald-400/30 bg-emerald-400/10 px-4 py-3">
              <p className="font-semibold text-emerald-200">Response approved</p>
              <p className="mt-1 text-sm text-emerald-200/90">
                Your approved response has been added to the review management
                queue.
              </p>
            </div>
            <div className="whitespace-pre-line rounded-[10px] border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-cream">
              {review.reply?.body || "—"}
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <form
              method="post"
              action={
                managed ? `/api/admin/reviews/${review.id}/reply` : undefined
              }
              className="space-y-3"
            >
              <label htmlFor="reply-body" className="sr-only">
                Suggested response
              </label>
              <textarea
                id="reply-body"
                name="body"
                defaultValue={review.reply?.body ?? ""}
                rows={8}
                readOnly={!managed}
                className={`${fieldInput} text-sm`}
                placeholder={
                  review.reply?.status === "failed"
                    ? "Response generation failed — write a reply or try regenerating."
                    : "Your response to this review…"
                }
              />
              <button type="submit" disabled={!managed} className={chipPrimary}>
                Save changes
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
              <SubmitAction
                action={`/api/admin/reviews/${review.id}/regenerate`}
                label="Regenerate"
                pendingLabel="Regenerating…"
                className={chipIdle}
                disabled={!managed}
              />
              <SubmitAction
                action={`/api/admin/reviews/${review.id}/approve`}
                confirm="Approve this response? It will be added to the review management queue."
                label="Approve response"
                pendingLabel="Approving…"
                className={chipPrimary}
                disabled={!managed}
              />
              {managed && (
                <p className="text-xs text-cream/45">
                  Saving or regenerating won&rsquo;t approve — approval is a
                  separate, explicit step.
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
