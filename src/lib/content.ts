/**
 * Owner-approved static site copy that isn't part of the config/NAP.
 *
 * `testimonials` is the fallback for the public reviews section when live
 * Google reviews aren't available. It ships EMPTY on purpose: publishing
 * fabricated testimonials for a law firm would breach LSO advertising rules.
 * Add real, client-approved quotes here (or set GOOGLE_MAPS_API_KEY +
 * googleBusiness.placeId for live Google reviews) and the section appears.
 */

export interface Testimonial {
  name: string;
  quote: string;
  role?: string;
}

export const testimonials: Testimonial[] = [];
