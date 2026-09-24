import {
  absoluteUrl,
  contact,
  lawyers,
  site,
  socialProfiles,
  type Lawyer,
} from "@/lib/site.config";

/** Serializes trusted, static data. Escapes `<` so a value cannot close the script. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const address = {
  "@type": "PostalAddress",
  streetAddress: contact.address.street,
  addressLocality: contact.address.city,
  addressRegion: contact.address.region,
  postalCode: contact.address.postalCode,
  addressCountry: contact.address.country,
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand,
    legalName: site.legalName,
    url: site.domain,
    logo: absoluteUrl(site.logo),
    email: contact.email,
    telephone: contact.phoneE164,
    faxNumber: contact.faxE164,
    address,
    ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
  };
}

/** Name and url only. No SearchAction — there is no site search. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.brand,
    url: site.domain,
  };
}

/**
 * LegalService for a real office. No priceRange, reviews, or opening hours:
 * fees are unpublished and meetings are by appointment.
 */
export function legalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: site.legalName,
    url: site.domain,
    image: absoluteUrl(site.ogImage),
    logo: absoluteUrl(site.logo),
    email: contact.email,
    telephone: contact.phoneE164,
    faxNumber: contact.faxE164,
    hasMap: contact.mapUrl,
    address,
    geo: {
      "@type": "GeoCoordinates",
      latitude: contact.geo.latitude,
      longitude: contact.geo.longitude,
    },
    areaServed: contact.areas.map((area) => ({
      "@type": area.type,
      name: area.name,
    })),
    employee: lawyers.map((lawyer) => ({
      "@type": "Person",
      name: lawyer.name,
      jobTitle: lawyer.role,
      knowsLanguage: [...lawyer.languages],
    })),
    ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** Service only. No Offer — the firm does not publish fees. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    serviceType: opts.name,
    areaServed: contact.areas.map((area) => area.name).join(", "),
    provider: {
      "@type": "LegalService",
      name: site.legalName,
      url: site.domain,
    },
  };
}

/** FAQPage from a page's question/answer pairs. */
export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/** A single lawyer as a Person. Used nested inside aboutPageSchema. */
function personSchema(lawyer: Lawyer) {
  return {
    "@type": "Person",
    name: lawyer.name,
    jobTitle: lawyer.role,
    worksFor: {
      "@type": "LegalService",
      name: site.legalName,
      url: site.domain,
    },
    knowsLanguage: [...lawyer.languages],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: `Called to the ${lawyer.jurisdiction} bar (${lawyer.called})`,
    },
    ...(lawyer.photoReady ? { image: absoluteUrl(lawyer.photo) } : {}),
  };
}

/** AboutPage whose mainEntity is the firm's lawyers. */
export function aboutPageSchema(opts: { path: string; people: Lawyer[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: absoluteUrl(opts.path),
    about: {
      "@type": "Organization",
      name: site.legalName,
      url: site.domain,
    },
    mainEntity: opts.people.map(personSchema),
  };
}

/** ItemList for a hub page (e.g. the practice-areas index). */
export function itemListSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

/** BlogPosting for an Insights article. The firm authors posts (Organization). */
export function blogPostingSchema(opts: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    mainEntityOfPage: absoluteUrl(opts.path),
    datePublished: opts.datePublished,
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    image: absoluteUrl(opts.image ?? site.ogImage),
    author: {
      "@type": "Organization",
      name: opts.author?.trim() || site.brand,
      url: site.domain,
    },
    publisher: {
      "@type": "Organization",
      name: site.brand,
      logo: { "@type": "ImageObject", url: absoluteUrl(site.logo) },
    },
  };
}
