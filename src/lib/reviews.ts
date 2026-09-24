import { googleBusiness } from "@/lib/site.config";
import { testimonials } from "@/lib/content";

/**
 * Google reviews via the Places API (New).
 *
 * Server-only. Fetched with a 24h ISR cache (well within Google's caching
 * terms). Displayed as visible HTML with Google attribution — we do NOT emit
 * Review/AggregateRating JSON-LD (Google's policy discourages marking up
 * third-party reviews as first-party structured data).
 *
 * Activates when GOOGLE_MAPS_API_KEY is set (Places API "New" enabled on the
 * key) and googleBusiness.placeId is filled. Otherwise returns the
 * owner-approved static testimonials as fallback (empty by default), so builds
 * and local dev always work.
 */

export interface Review {
  author: string;
  authorUrl?: string;
  photoUrl?: string;
  rating: number;
  text: string;
  relativeTime?: string;
  publishTime?: string;
}

export interface ReviewsResult {
  source: "google" | "fallback";
  /** Aggregate rating (live only). */
  rating?: number;
  /** Total rating count (live only). */
  total?: number;
  /** Link to the Google profile for attribution / "read more". */
  profileUrl: string;
  reviews: Review[];
}

const ENDPOINT = "https://places.googleapis.com/v1/places";
const FIELD_MASK = "displayName,rating,userRatingCount,googleMapsUri,reviews";
const CACHE_SECONDS = 60 * 60 * 24; // 24h

interface PlacesReview {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
}

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
}

function fallback(): ReviewsResult {
  return {
    source: "fallback",
    profileUrl: googleBusiness.profileUrl,
    reviews: testimonials.map((t) => ({
      author: t.name,
      rating: 5,
      text: t.quote,
    })),
  };
}

export async function getReviews(): Promise<ReviewsResult> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || !googleBusiness.placeId) return fallback();

  try {
    const res = await fetch(`${ENDPOINT}/${googleBusiness.placeId}`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": FIELD_MASK },
      next: { revalidate: CACHE_SECONDS },
    });

    if (!res.ok) {
      console.warn(`[reviews] Places API ${res.status}; using fallback.`);
      return fallback();
    }

    const data = (await res.json()) as PlacesResponse;

    const reviews: Review[] = (data.reviews ?? [])
      .map(
        (r): Review => ({
          author: r.authorAttribution?.displayName ?? "Google reviewer",
          authorUrl: r.authorAttribution?.uri,
          photoUrl: r.authorAttribution?.photoUri,
          rating: r.rating ?? 0,
          text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
          relativeTime: r.relativePublishTimeDescription,
          publishTime: r.publishTime,
        }),
      )
      .filter((r) => r.text.length > 0 && r.rating >= googleBusiness.minRating)
      .sort(
        (a, b) =>
          Date.parse(b.publishTime ?? "") - Date.parse(a.publishTime ?? ""),
      )
      .slice(0, googleBusiness.count);

    if (reviews.length === 0) return fallback();

    return {
      source: "google",
      rating: data.rating,
      total: data.userRatingCount,
      profileUrl: data.googleMapsUri ?? googleBusiness.profileUrl,
      reviews,
    };
  } catch (err) {
    console.warn("[reviews] fetch failed; using fallback.", err);
    return fallback();
  }
}
