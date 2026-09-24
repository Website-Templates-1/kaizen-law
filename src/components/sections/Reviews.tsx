import { Container, TextLink } from "@/components/ui/primitives";
import { getReviews, type Review } from "@/lib/reviews";

/**
 * Testimonials sourced from the firm's Google Business Profile (live via the
 * Places API when configured; owner-approved static reviews otherwise).
 * Visible HTML only — no Review/AggregateRating JSON-LD. Renders nothing until
 * real reviews exist, so it never shows an empty block.
 */
export async function Reviews() {
  const data = await getReviews();
  if (data.reviews.length === 0) return null;

  return (
    <section className="section-light">
    <Container>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-gold">Client voices</p>
          <h2 className="display mt-5 text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem] lg:text-[3.25rem]">
            In their <em className="italic text-gold">own words.</em>
          </h2>
        </div>
        <div className="flex flex-col items-start gap-2">
          {data.source === "google" && data.rating != null && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Stars rating={Math.round(data.rating)} />
              <span className="font-semibold text-ink">
                {data.rating.toFixed(1)}
              </span>
              {data.total != null && <span>· {data.total} Google reviews</span>}
            </div>
          )}
          <TextLink href={data.profileUrl}>
            {data.source === "google"
              ? "Read our reviews on Google"
              : "See us on Google"}
          </TextLink>
        </div>
      </div>

      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.reviews.map((r, i) => (
          <li key={`${r.author}-${i}`}>
            <ReviewCard review={r} />
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-muted">Reviews sourced from Google.</p>
    </Container>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col gap-6 border border-line bg-white p-8">
      <Stars rating={review.rating} />
      <blockquote className="serif text-[1.15rem] leading-relaxed text-ink">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-6">
        {review.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.photoUrl}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <span className="grid h-11 w-11 place-items-center rounded-full bg-ink font-serif text-gold">
            {review.author.charAt(0)}
          </span>
        )}
        <span className="min-w-0">
          {review.authorUrl ? (
            <a
              href={review.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate font-bold text-ink hover:text-gold"
            >
              {review.author}
            </a>
          ) : (
            <span className="block truncate font-bold text-ink">
              {review.author}
            </span>
          )}
          <span className="block text-sm text-muted">
            {review.relativeTime ?? "Verified client"}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex gap-1" role="img" aria-label={`${full} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={i < full ? "h-5 w-5 text-gold" : "h-5 w-5 text-line"}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </div>
  );
}
