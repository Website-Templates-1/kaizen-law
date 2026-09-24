/**
 * Kaizen Law — single source of truth.
 *
 * Brand, NAP, navigation, practice areas, and people all live here.
 * Metadata, JSON-LD, the sitemap, and the redirect table read this module.
 */

export const site = {
  brand: "Kaizen Law",
  shortBrand: "Kaizen Law",
  legalName: "Kaizen Law Professional Corporation",
  /** Canonical origin: https, www, no trailing slash. */
  domain: "https://www.kaizenlaw.ca",
  locale: "en_CA",
  htmlLang: "en-CA",
  defaultTitle: "Kaizen Law | Clear counsel. Steady direction.",
  titleTemplate: "%s | Kaizen Law",
  defaultDescription:
    "Kaizen Law Professional Corporation provides thoughtful, practical legal counsel in real estate, wills and estates, business, corporate, family, and criminal matters across the GTA and Niagara.",
  ogImage: "/photos/hero.jpg",
  logo: "/brand/logo.png",
  studio: {
    name: "Mintek",
    url: "https://minteksoftware.com",
  },
} as const;

export const contact = {
  phoneDisplay: "905-641-7003",
  phoneHref: "tel:+19056417003",
  phoneE164: "+1-905-641-7003",
  faxDisplay: "905-641-7004",
  faxHref: "tel:+19056417004",
  faxE164: "+1-905-641-7004",
  email: "info@kaizenlaw.ca",
  emailHref: "mailto:info@kaizenlaw.ca",
  address: {
    street: "#504 - 43 Church St",
    city: "St. Catharines",
    region: "ON",
    regionName: "Ontario",
    postalCode: "L2R 7E1",
    country: "CA",
    countryName: "Canada",
  },
  addressLine: "#504 - 43 Church St, St. Catharines, ON L2R 7E1",
  hours: "By appointment",
  response:
    "Information requests are answered by email. Please share a little about your matter and we will be in touch.",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=43+Church+Street+Suite+504+St.+Catharines+ON+L2R+7E1",
  /** Cities and regions named by the firm. Niagara is a region, not a city. */
  areas: [
    { name: "Toronto", type: "City" },
    { name: "Brampton", type: "City" },
    { name: "Mississauga", type: "City" },
    { name: "St. Catharines", type: "City" },
    { name: "Hamilton", type: "City" },
    { name: "Niagara", type: "AdministrativeArea" },
  ],
  /**
   * Office coordinates for LocalBusiness geo. APPROXIMATE — confirm against the
   * actual Google Maps pin for 43 Church St, Suite 504, St. Catharines before launch.
   */
  geo: { latitude: 43.1596, longitude: -79.2468 },
} as const;

/**
 * Public social profile URLs. Drives JSON-LD `sameAs` on Organization and
 * LegalService. Left empty until the firm provides profiles — nothing renders
 * while empty.
 */
export const socialProfiles: string[] = [];

/**
 * Search-console / verification tokens. Wired into root metadata only when a
 * value is present. Paste the Google Search Console token here to verify.
 */
export const analytics = {
  googleSearchConsoleVerification: "",
} as const;

/** Admin-panel feature flags. Flip on once the corresponding service is wired. */
export const adminFeatures = {
  /** AI-drafted review replies via the Central Review Management API. */
  reviewReplies: false,
} as const;

/** Public Google reviews (Places API). placeId empty → static fallback shown. */
export const googleBusiness = {
  placeId: "",
  profileUrl: contact.mapUrl,
  minRating: 4,
  count: 3,
} as const;

/** Blog / Insights. Posts are markdown files under content/blog/*.md. */
export const blog = {
  basePath: "/blog",
  navLabel: "Insights",
  /** Author stamped on generated drafts. */
  author: "Kaizen Law Professional Corporation",
} as const;

export const philosophy = {
  eyebrow: "Our philosophy",
  titleLead: "Built on the idea that",
  titleEm: "better",
  titleRest: "is always possible.",
  paragraphs: [
    "Kaizen means continuous improvement: the steady, deliberate pursuit of doing things a little better each time. It is the principle our firm is named for, and the standard we hold every file to: precision in the detail, strategy in the approach, and integrity in the counsel we give.",
    "We begin by listening. Before a document is drafted or a position is taken, we take the time to understand what you are trying to achieve and what a good outcome looks like for you. From there we translate the complexity of the law into a clear path forward, one you can follow and act on with confidence.",
    "The result is legal counsel that is considered, practical, and genuinely shaped around your objectives. Not louder. Not longer. Better.",
  ],
} as const;

/** Firm-wide "about" narrative, used on the home about band. */
export const about = {
  eyebrow: "About the firm",
  title: "A boutique practice,",
  titleEm: "built around you.",
  paragraphs: [
    "Kaizen Law Professional Corporation is a boutique firm serving individuals, families, and businesses across the Greater Toronto Area and the Niagara region. We handle real estate, wills and estates, business and corporate matters, family law, and criminal law. We bring the same care to a first home purchase as we do to a complex commercial file.",
    "Because we are small by design, you work directly with the lawyer handling your matter. There is no rotating team and no handing your file down the line. That means advice that is consistent, responsive, and answerable to you from the first conversation to the last.",
    "We speak English, Punjabi, Hindi, and Urdu, so more of our community can be understood in their own words, and be certain they understand every decision that affects them.",
  ],
  /** Intended source for the "both founders together" photograph. */
  teamPhoto: "/photos/founders.jpg",
  teamPhotoAlt:
    "Nitika Thapar and Gourav Sharma, founders of Kaizen Law, at their St. Catharines office",
  /** Flip to true once the real photograph is added at teamPhoto. */
  teamPhotoReady: false,
} as const;

/** Shown on practice pages and the contact form. Not legal advice, and not a retainer. */
export const engagementNote =
  "Sending a message does not create a lawyer-client relationship. Please avoid sensitive details until we confirm we can act for you. Information on this site is general, not legal advice.";

export const lsoNote = "Not an LSO Certified Specialist.";

export interface PracticeArea {
  slug: string;
  number: string;
  title: string;
  navLabel: string;
  metaDescription: string;
  summary: string;
  intro: string;
  /** Deeper overview shown on the detail page — one or two paragraphs. */
  overview: string[];
  /** Heading above the scope list. */
  includedHeading: string;
  /** Matters already described by the firm — not a fee schedule and not a results claim. */
  points: string[];
  /** "This may be a fit if…" — situations the area speaks to. */
  whoFor: string[];
  /** Plain-language questions and answers. Visible copy only — no FAQPage schema. */
  faqs: { q: string; a: string }[];
  image: string;
  imageAlt: string;
}

/**
 * Firm-wide engagement steps, shown on every practice page under "How we work".
 * Kept general on purpose: the same measured process applies to every matter.
 */
export const engagementSteps: { title: string; body: string }[] = [
  {
    title: "First conversation",
    body: "You tell us what you are facing. We listen, ask the questions that matter, and give you an honest read on where things stand.",
  },
  {
    title: "A clear plan",
    body: "We set out the options, the likely path, and what each step involves, in plain language, before any work begins.",
  },
  {
    title: "Considered work",
    body: "We handle the drafting, filing, and negotiation with precision, and keep you informed at every point that calls for a decision.",
  },
  {
    title: "A clean resolution",
    body: "We see the matter through to a clear conclusion and make sure you understand what it means and what, if anything, comes next.",
  },
];

export const practices: PracticeArea[] = [
  {
    slug: "real-estate",
    number: "01",
    title: "Real Estate",
    navLabel: "Real Estate",
    metaDescription:
      "Real estate counsel for purchases, sales, refinancing, and the decisions that shape property ownership. Kaizen Law, St. Catharines.",
    summary:
      "Practical guidance for purchases, sales, refinancing, and the decisions that shape property ownership.",
    intro:
      "A property transaction is often the largest one a person makes, and it turns entirely on the details: what is being bought or sold, what the agreement actually says, and what you need the deal to do for you. We explain those details in plain language and keep the path to closing clear from the first review to the final key handover.",
    overview: [
      "Whether you are buying your first home, selling a property, or refinancing to free up equity, the legal side should feel steady rather than stressful. We review your agreement of purchase and sale, conduct the searches that protect you, coordinate with your lender and the other side, and make sure title transfers cleanly and on time.",
      "We also advise on the decisions that come with ownership, including how to hold title, what a survey or status certificate is telling you, and what to watch for before you sign. The aim is simple: no surprises on closing day, and a clear understanding of what you own and what you have committed to.",
    ],
    includedHeading: "What this can include",
    points: [
      "Residential and commercial purchases and sales",
      "Refinancing and mortgage instructions",
      "Title review, searches, and title insurance",
      "Advice on how to hold and transfer title",
      "Reviewing agreements before you commit",
    ],
    whoFor: [
      "First-time buyers who want the process explained clearly",
      "Owners selling or refinancing a home or investment property",
      "Buyers and sellers of commercial or rental property",
      "Anyone who wants an agreement reviewed before signing",
    ],
    faqs: [
      {
        q: "When should I involve a lawyer in my purchase or sale?",
        a: "As early as possible, ideally before you sign the agreement of purchase and sale, or during any conditional period. Reviewing the agreement early lets us flag issues while there is still room to address them.",
      },
      {
        q: "What do you do between the agreement and closing?",
        a: "We conduct title and off-title searches, review the terms, coordinate with your lender and the other party's lawyer, prepare the closing documents, and arrange the transfer of funds and title so closing happens on schedule.",
      },
      {
        q: "Do I need title insurance?",
        a: "In most residential transactions it is standard and we will explain what it covers and why it is recommended for your situation. We will make sure you understand the cost and the protection before anything is arranged.",
      },
    ],
    image: "/photos/real-estate.jpg",
    imageAlt: "A modern house exterior in warm light",
  },
  {
    slug: "wills-estates",
    number: "02",
    title: "Wills & Estates",
    navLabel: "Wills & Estates",
    metaDescription:
      "Wills and estates counsel for planning and administration. Kaizen Law Professional Corporation, serving Ontario clients.",
    summary:
      "Thoughtful planning and administration designed to protect what matters and clarify what comes next.",
    intro:
      "Estate work is about making the next step understandable, for you and for the people who matter to you. Whether you are planning ahead or stepping in to administer what someone has left behind, we focus on clarity, so everyone involved knows exactly what the documents do and what happens next.",
    overview: [
      "Good planning is an act of care. A well-drafted will, power of attorney, and estate plan spare your family from uncertainty at the hardest possible time. We help you put your wishes in writing (who inherits, who decides, and who acts on your behalf if you cannot) in language that will hold up when it matters.",
      "When you are the one administering an estate, the responsibilities can feel overwhelming. We guide executors and family members through the process step by step, from the initial paperwork to the final distribution, so the estate is handled correctly and the people involved are never left guessing.",
    ],
    includedHeading: "What this can include",
    points: [
      "Wills that put your wishes clearly in writing",
      "Powers of attorney for property and personal care",
      "Estate planning tailored to your family and assets",
      "Guidance for executors and estate trustees",
      "Estate administration from start to distribution",
    ],
    whoFor: [
      "Anyone without an up-to-date will or power of attorney",
      "Parents and families planning for what comes next",
      "Executors who need a clear path through their duties",
      "Families administering the estate of someone who has passed",
    ],
    faqs: [
      {
        q: "Do I really need a will if my estate is simple?",
        a: "Yes. Without a will, Ontario law decides who inherits and who administers your estate, which may not reflect your wishes. Even a straightforward estate is far easier on your family when your intentions are clearly documented.",
      },
      {
        q: "What is a power of attorney, and do I need one?",
        a: "A power of attorney lets someone you trust make decisions about your property or personal care if you become unable to. It is a core part of a complete plan, and we usually prepare it alongside your will.",
      },
      {
        q: "I have been named an executor. Where do I start?",
        a: "Start with a conversation. We will walk you through your responsibilities, the documents you need, and the order in which things happen, so you can carry out the role with confidence and without missteps.",
      },
    ],
    image: "/photos/wills.jpg",
    imageAlt: "A fountain pen writing on paper",
  },
  {
    slug: "business",
    number: "03",
    title: "Business",
    navLabel: "Business",
    metaDescription:
      "Business law support for founders and companies navigating agreements, growth, and change. Kaizen Law, Ontario.",
    summary:
      "Clear legal support for founders and businesses navigating agreements, growth, and change.",
    intro:
      "Founders and business owners come to us when an agreement, a period of growth, or a change in the business needs a steady, informed read. We look at the objective first and the paperwork second, because the document only matters if it does what your business actually needs it to do.",
    overview: [
      "Running a business means making decisions that carry legal weight, often under time pressure. We help you get those decisions right: reviewing and drafting the contracts you rely on, advising on how to structure a new venture or partnership, and making sure the agreements you sign protect the business you are building.",
      "As things change, whether a new partner, a new location, or a new line of work, we help you document that change cleanly, so growth strengthens the business rather than exposing it. Practical advice, delivered in language you can act on.",
    ],
    includedHeading: "What this can include",
    points: [
      "Reviewing and drafting commercial contracts",
      "Partnership and shareholder arrangements",
      "Structuring a new business or venture",
      "Documenting growth, partners, and change",
      "Everyday agreements that deserve a careful read",
    ],
    whoFor: [
      "Founders setting up or formalizing a new business",
      "Owners entering a partnership or bringing one on",
      "Businesses signing contracts they want reviewed first",
      "Companies documenting a change or period of growth",
    ],
    faqs: [
      {
        q: "Should I have every contract reviewed before signing?",
        a: "For anything significant, such as a lease, a supplier agreement, a partnership, or a large customer contract, then yes. A short review before you sign is far less costly than untangling a problem afterward.",
      },
      {
        q: "Can you help me set up a partnership the right way?",
        a: "We can. A clear partnership or shareholder arrangement, agreed while everyone is aligned, protects the relationship and the business if circumstances change later. We help you put that foundation in place.",
      },
      {
        q: "Do you work with early-stage businesses?",
        a: "Yes. We work with founders from day one as well as established businesses. We will meet you where you are and scale the advice to what the business actually needs right now.",
      },
    ],
    image: "/photos/business.jpg",
    imageAlt: "A modern office corridor",
  },
  {
    slug: "corporate",
    number: "04",
    title: "Corporate",
    navLabel: "Corporate",
    metaDescription:
      "Corporate counsel for structures, transactions, governance, and ongoing obligations. Kaizen Law Professional Corporation.",
    summary:
      "Strategic counsel for corporate structures, transactions, governance, and ongoing obligations.",
    intro:
      "Corporate work covers how an organization is put together, how a transaction is documented, and what the ongoing obligations are once the ink is dry. We keep that whole picture orderly, so your structure supports your goals and your records stay in good standing.",
    overview: [
      "From incorporation to reorganization, the way a company is structured has real consequences for how it operates, how it is taxed, and how it grows. We advise on the structure that fits your objectives, prepare the documents that put it in place, and make sure transactions are recorded properly.",
      "We also help with the ongoing side of corporate life: governance, resolutions, minute books, and the routine obligations that are easy to let slip and costly to ignore. The result is a company whose paperwork matches its reality and whose foundations are ready for whatever comes next.",
    ],
    includedHeading: "What this can include",
    points: [
      "Incorporation and corporate structuring",
      "Reorganizations and share transactions",
      "Corporate governance and resolutions",
      "Minute book maintenance and annual filings",
      "Documenting ongoing corporate obligations",
    ],
    whoFor: [
      "Owners incorporating or restructuring a company",
      "Corporations that need governance kept in order",
      "Businesses documenting a share or ownership change",
      "Companies whose minute book needs bringing current",
    ],
    faqs: [
      {
        q: "Should I incorporate my business?",
        a: "It depends on your goals, your risk, and your tax situation. We will talk through the advantages and the obligations that come with incorporation so you can decide with a clear picture, and we will handle the setup if it is the right move.",
      },
      {
        q: "What is a minute book and why does it matter?",
        a: "A minute book is the official record of your corporation: its resolutions, registers, and filings. Keeping it current is a legal requirement and it becomes essential during a sale, financing, or audit. We can maintain it or bring a neglected one up to date.",
      },
      {
        q: "Do you work alongside my accountant?",
        a: "Regularly. Corporate structure and tax planning go hand in hand, and we are happy to coordinate with your accountant so the legal and financial sides of a decision line up.",
      },
    ],
    image: "/photos/corporate.jpg",
    imageAlt: "Glass office towers seen from street level",
  },
  {
    slug: "family-law",
    number: "05",
    title: "Family Law",
    navLabel: "Family Law",
    metaDescription:
      "Family law guidance for sensitive matters, with care and precision. Kaizen Law serves the GTA and Niagara.",
    summary:
      "Steady, informed guidance through sensitive family matters with care and precision.",
    intro:
      "Family matters ask for something more than legal skill. They ask for a calm, honest explanation of the process and the choices in front of you. We treat that work with genuine care, and with the same precision we bring to every file, so you can make decisions from a place of clarity rather than crisis.",
    overview: [
      "Whether you are separating, sorting out arrangements for your children, or formalizing an agreement, the road can feel uncertain and personal. We help you understand where you stand, what the law expects, and what a fair, workable outcome could look like, without adding conflict where it is not needed.",
      "We advise on separation, parenting and support arrangements, and the agreements that set them down clearly. Where matters can be resolved by agreement, we work toward that. Where they cannot, we prepare carefully and advocate for your interests with a steady hand.",
    ],
    includedHeading: "What this can include",
    points: [
      "Separation and the issues that come with it",
      "Parenting arrangements and decision-making",
      "Child and spousal support",
      "Separation agreements and domestic contracts",
      "A clear account of the process at every stage",
    ],
    whoFor: [
      "Anyone facing a separation and unsure of the next step",
      "Parents working out arrangements for their children",
      "People negotiating or formalizing an agreement",
      "Anyone who wants the process explained calmly and clearly",
    ],
    faqs: [
      {
        q: "Do we have to go to court?",
        a: "Often, no. Many family matters are resolved by negotiation and a written agreement, which is usually faster, less costly, and less adversarial. Where court is necessary, we prepare thoroughly and represent you with care.",
      },
      {
        q: "How are parenting and support arrangements decided?",
        a: "Parenting decisions are guided by the best interests of the child, and support is guided largely by established guidelines. We will explain how these apply to your circumstances so you know what to reasonably expect.",
      },
      {
        q: "Can you review an agreement someone has already given me?",
        a: "Yes. Before you sign a separation agreement or domestic contract, it is important to understand exactly what it commits you to. We can review it, explain it, and advise you on it.",
      },
    ],
    image: "/photos/family.jpg",
    imageAlt: "A sunlit living room",
  },
  {
    slug: "criminal-law",
    number: "06",
    title: "Criminal Law",
    navLabel: "Criminal Law",
    metaDescription:
      "Criminal law representation with a clear view of the process when the stakes are high. Kaizen Law, Ontario.",
    summary:
      "Focused representation and a clear understanding of the process when the stakes are high.",
    intro:
      "When you are facing a criminal charge, the first thing you need is not a promise. It is a clear understanding of the process and what is genuinely at stake. We give you that, then bring focused, careful attention to the matter in front of you.",
    overview: [
      "A charge is frightening precisely because so much feels unknown: what happens next, what your options are, and what the consequences could be. We take the time to explain all of it plainly, review the disclosure against you, and identify the issues that matter to your defence.",
      "From bail through to resolution, we make sure your rights are understood and protected, that you know where your matter stands at every step, and that the decisions along the way are yours to make with full information. Steady counsel when you need it most.",
    ],
    includedHeading: "What this can include",
    points: [
      "A clear explanation of the charge and the process",
      "Bail and early-stage advice",
      "Review of the disclosure and the issues in your matter",
      "Representation through the stages of the case",
      "Honest counsel on your options at each decision point",
    ],
    whoFor: [
      "Anyone who has been charged and does not know their options",
      "People who need bail or early-stage advice quickly",
      "Anyone wanting the process and consequences explained plainly",
      "Those who want focused attention on their matter",
    ],
    faqs: [
      {
        q: "I have just been charged. What should I do first?",
        a: "Speak to a lawyer before you speak to anyone else about the details. You have the right to counsel, and getting advice early, especially around bail and what not to say, can materially affect how your matter unfolds.",
      },
      {
        q: "What does the process actually look like?",
        a: "Most matters move through defined stages, from first appearance and disclosure to resolution or trial. We will map out those stages for your specific situation so nothing about the process catches you off guard.",
      },
      {
        q: "Will you tell me honestly where I stand?",
        a: "Yes. You will get a straight, realistic assessment, not false comfort and not alarm. Clear information is what lets you make good decisions about your own defence.",
      },
    ],
    image: "/photos/counsel.jpg",
    imageAlt: "A person signing a document at a desk",
  },
  {
    slug: "notary",
    number: "07",
    title: "Notary Services",
    navLabel: "Notary",
    metaDescription:
      "Notary services in St. Catharines for documents that need professional witnessing. Kaizen Law Professional Corporation.",
    summary:
      "Convenient, professional notary services for documents that require trusted witnessing.",
    intro:
      "Some documents simply need to be witnessed, certified, or commissioned properly, and by someone whose signature will be trusted. We provide notary services at our St. Catharines office, handled promptly and correctly, by appointment.",
    overview: [
      "Notarization confirms that a document is genuine and that signatures are authentic, a requirement for many official, financial, and international matters. Whether you need a document notarized, a copy certified as a true copy, or an affidavit commissioned, we take care of it with the attention these documents deserve.",
      "Bring valid identification and the complete, unsigned document, and we will handle the rest. If you are not certain what your document requires, ask when you book and we will tell you what to prepare.",
    ],
    includedHeading: "What this can include",
    points: [
      "Notarizing documents that require it",
      "Certifying true copies of original documents",
      "Commissioning affidavits and statutory declarations",
      "Witnessing signatures on official documents",
      "Available by appointment at our St. Catharines office",
    ],
    whoFor: [
      "Anyone with a document that must be notarized",
      "People needing a certified true copy of an original",
      "Those swearing an affidavit or statutory declaration",
      "Anyone handling official or international paperwork",
    ],
    faqs: [
      {
        q: "What should I bring to a notary appointment?",
        a: "Bring valid government-issued photo identification and the complete document, unsigned. Most documents must be signed in front of the notary. If a copy is being certified, bring the original as well.",
      },
      {
        q: "Can I sign the document before I arrive?",
        a: "Usually not. For notarization, the document typically must be signed in the notary's presence so the signature can be properly witnessed. When in doubt, leave it unsigned and we will guide you.",
      },
      {
        q: "How do I arrange notary services?",
        a: "Notary services are offered by appointment at our St. Catharines office. Get in touch with a short note about the document you need handled and we will arrange a time.",
      },
    ],
    image: "/photos/notary.jpg",
    imageAlt: "A fountain pen resting on an open notebook",
  },
];

export function getPractice(slug: string): PracticeArea | undefined {
  return practices.find((p) => p.slug === slug);
}

export interface Lawyer {
  name: string;
  role: "Founder" | "Co-Founder";
  monogram: string;
  jurisdiction: string;
  languages: string[];
  /** One-line summary for compact cards. */
  summary: string;
  /** Full bio paragraphs for the profile. DRAFT copy — pending each lawyer's approval. */
  bio: string[];
  /** Intended source for this lawyer's portrait. */
  photo: string;
  /** Flip to true once the real portrait is added at `photo`. */
  photoReady: boolean;
}

export const lawyers: Lawyer[] = [
  {
    name: "Gourav Sharma",
    role: "Founder",
    monogram: "GS",
    jurisdiction: "Ontario",
    languages: ["English", "Punjabi", "Hindi", "Urdu"],
    summary:
      "A founder of Kaizen Law, Gourav brings a calm, focused approach to every matter, and steady counsel when the stakes are highest.",
    bio: [
      "Gourav Sharma is a founder of Kaizen Law. He is drawn to the work precisely because it meets people at difficult moments, and he believes the first thing a client deserves is an honest explanation of where they stand.",
      "He brings careful preparation and a composed presence to every matter, and takes the time to make sure clients understand every decision that affects them. He speaks English, Punjabi, Hindi, and Urdu.",
    ],
    photo: "/photos/gourav-sharma.jpg",
    photoReady: false,
  },
  {
    name: "Nitika Thapar",
    role: "Co-Founder",
    monogram: "NT",
    jurisdiction: "Ontario",
    languages: ["English", "Punjabi", "Hindi"],
    summary:
      "A co-founder of Kaizen Law, Nitika is known for translating complex matters into clear, practical guidance her clients can act on with confidence.",
    bio: [
      "Nitika Thapar is a co-founder of Kaizen Law. Clients come to her for the moments that shape a life or a business, and she brings the same precision and care to each one.",
      "She is known for turning complex matters into plain, practical guidance, and for counsel that is responsive, thorough, and genuinely shaped around each client's objectives. She speaks English, Punjabi, and Hindi.",
    ],
    photo: "/photos/nitika-thapar.jpg",
    photoReady: false,
  },
];

export const glance = [
  { value: "4+", label: "Years of experience" },
  { value: "95%", label: "Client satisfaction rate" },
  { value: "24h", label: "Response time with new clients" },
];
export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: "Practice", href: "/practice" },
  { label: "People", href: "/people" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const practiceNav: NavItem[] = practices.map((p) => ({
  label: p.navLabel,
  href: `/practice/${p.slug}`,
}));

export interface StaticRoute {
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
}

export const staticRoutes: StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/practice", changeFrequency: "monthly", priority: 0.9 },
  { path: "/people", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

export interface RedirectDef {
  source: string;
  destination: string;
  permanent: boolean;
}

export const redirects: RedirectDef[] = [
  { source: "/services", destination: "/practice", permanent: true },
  { source: "/services/:slug", destination: "/practice/:slug", permanent: true },
  { source: "/about", destination: "/people", permanent: true },
  { source: "/privacy-policy", destination: "/privacy", permanent: true },
];

export function absoluteUrl(path = "/"): string {
  const clean = "/" + path.replace(/^\/+/, "").replace(/\/+$/, "");
  return clean === "/" ? site.domain + "/" : site.domain + clean;
}

export function canonical(path = "/"): string {
  return absoluteUrl(path);
}
