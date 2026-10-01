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
    "Kaizen Law Professional Corporation provides thoughtful, practical legal counsel in real estate, wills and estates, business and corporate law, family law, criminal law, and civil litigation across the GTA and Niagara.",
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
  /** Lead line for the "where we work" sections. */
  areasLead: "Serving clients across the Greater Toronto Area and Niagara Region.",
  /** Cities and regions named by the firm. Niagara is a region, not a city. */
  areas: [
    { name: "Brampton", type: "City" },
    { name: "Mississauga", type: "City" },
    { name: "Toronto", type: "City" },
    { name: "Hamilton", type: "City" },
    { name: "St. Catharines", type: "City" },
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
    "Kaizen Law Professional Corporation is a boutique firm serving individuals, families, and businesses across the Greater Toronto Area and the Niagara region. We handle real estate, wills and estates, business and corporate law, family law, criminal law, and civil litigation. We bring the same care to a first home purchase as we do to a complex commercial file.",
    "Because we are small by design, you work directly with the lawyer handling your matter, with a direct line of communication throughout your file.",
  ],
  /** Intended source for the "both founders together" photograph. */
  teamPhoto: "/photos/founders.jpg",
  teamPhotoAlt:
    "Nitika Thapar and Gourav Sharma, founders of Kaizen Law, at their St. Catharines office",
  /** Flip to true once the real photograph is added at teamPhoto. */
  teamPhotoReady: false,
} as const;

/** Short "Why Kaizen?" note, shown on the home page. */
export const whyKaizen = {
  eyebrow: "Why Kaizen?",
  title: "The person behind",
  titleEm: "the matter.",
  body: "We believe good legal service starts with understanding the person behind the matter. Our practice is intentionally focused, allowing us to work closely with our clients and approach each file with care, preparation and attention to detail.",
} as const;

/** Shown on practice pages and the contact form. Not legal advice, and not a retainer. */
export const engagementNote =
  "Sending a message does not create a lawyer-client relationship. Please avoid sensitive details until we confirm we can act for you. Information on this site is general, not legal advice.";

/** Full disclaimer shown at the bottom of the home page only. */
export const homeDisclaimer =
  "Sending a message does not create a lawyer-client relationship. Please avoid including confidential or sensitive information until we have confirmed that we can act for you. Information on this website is provided for general information only and does not constitute legal advice.";

/** Short confidentiality warning shown directly above the contact form. */
export const contactFormWarning =
  "Please do not include confidential or sensitive information. Submitting this form does not create a lawyer-client relationship.";

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
  /** Plain-language questions and answers. Visible copy only — no FAQPage schema. */
  faqs: { q: string; a: string }[];
  image: string;
  imageAlt: string;
}

/** Practice areas, listed in alphabetical order by title. */
export const practices: PracticeArea[] = [
  {
    slug: "business-corporate",
    number: "01",
    title: "Business & Corporate Law",
    navLabel: "Business & Corporate",
    metaDescription:
      "Business and corporate counsel for founders and companies: contracts, structure, shareholder arrangements, incorporation, and transactions. Kaizen Law, Ontario.",
    summary:
      "Practical counsel for founders and companies on contracts, structure, ownership, and the decisions that shape a business.",
    intro:
      "Running a business involves decisions that can have lasting legal and practical consequences. Whether you are starting a new venture, bringing in a business partner, entering into an agreement, or changing the way your business is structured, having the right legal framework in place can make those decisions easier to navigate.",
    overview: [
      "We work with business owners at different stages of their businesses. Our work may include helping establish or restructure a business, preparing and reviewing shareholder or partnership agreements, negotiating and drafting commercial contracts, and assisting with the purchase or sale of a business.",
      "As a business develops, its legal needs can change as well. New owners, new arrangements, changes in operations, or a sale of the business may require existing agreements and corporate documents to be revisited. We help clients understand those changes and put the appropriate documentation in place for the circumstances.",
      "Our approach is practical and straightforward: understand the business, identify the legal considerations, and provide advice you can use to make informed decisions.",
    ],
    includedHeading: "What this can include",
    points: [
      "Business purchases and sales",
      "Business formation and structuring",
      "Shareholder and partnership agreements",
      "Commercial contracts and agreements",
      "Corporate records and changes",
      "Corporate reorganizations and share transactions",
      "Incorporation and corporate structuring",
    ],
    faqs: [
      {
        q: "Should I have a contract reviewed before signing?",
        a: "It can be helpful to have significant agreements reviewed before you sign them, particularly where the agreement involves substantial financial commitments, ongoing obligations, or important business relationships. We can review the terms, explain the legal considerations, and identify provisions that may warrant further discussion or negotiation.",
      },
      {
        q: "Can you help me set up a partnership or shareholder arrangement?",
        a: "Yes. We can assist with preparing partnership or shareholder agreements that set out the agreed arrangements between the parties. Depending on the circumstances, an agreement may address matters such as decision-making, ownership, responsibilities, and what happens if circumstances change.",
      },
      {
        q: "Do you work with new and early-stage businesses?",
        a: "Yes. We work with businesses at different stages, including those that are just getting started. Depending on your circumstances, we can assist with matters such as business structure, agreements between owners, commercial contracts, and other legal documentation as the business develops.",
      },
      {
        q: "Should I incorporate my business?",
        a: "Incorporation may be appropriate depending on your business, how it is structured, and your plans for the future. We can explain the legal considerations involved in incorporating and the ongoing corporate requirements, so you can make an informed decision about the structure that suits your circumstances. If you decide to incorporate, we can assist with the incorporation process and related documentation.",
      },
    ],
    image: "/photos/business.jpg",
    imageAlt: "A modern office corridor",
  },
  {
    slug: "civil-litigation",
    number: "02",
    title: "Civil Litigation",
    navLabel: "Civil Litigation",
    metaDescription:
      "Civil litigation counsel for contract, property, debt, construction, shareholder, and estate disputes. Kaizen Law, serving the GTA and Niagara.",
    summary:
      "Clear, practical representation in disputes over contracts, property, debts, construction, and estates.",
    intro:
      "Civil disputes can affect your business, property, finances, and relationships, often at a time when the legal issues are already difficult to navigate. We help clients understand the dispute, the issues involved, and the options available to them.",
    overview: [
      "Our work may involve contractual and commercial disputes, real estate and property matters, construction and lien issues, mortgage enforcement, debt recovery, shareholder disputes, and estate and trust litigation. We assess the circumstances of each matter carefully and advise on the legal and practical considerations that may arise.",
      "Where a dispute can be addressed through negotiation or another form of resolution, we can assist with that process. Where litigation or a court application is required, we can advise you on the applicable procedure and represent you through the relevant stages of the matter.",
      "Our approach is focused and practical: understand the dispute, identify the issues that matter, and provide advice that allows you to make informed decisions about how to proceed.",
    ],
    includedHeading: "What this can include",
    points: [
      "Contract and commercial disputes",
      "Real estate litigation",
      "Construction and lien matters",
      "Mortgage enforcement, power of sale, and foreclosure",
      "Debt recovery and collection",
      "Shareholder and partnership disputes",
      "Estate and trust litigation",
      "Property and ownership disputes",
    ],
    faqs: [
      {
        q: "Do I need to go to court to resolve a civil dispute?",
        a: "Not necessarily. Depending on the circumstances, a dispute may be addressed through negotiation, mediation, or another form of resolution without proceeding to a trial. We can advise you on the options available in your circumstances.",
      },
      {
        q: "When should I speak with a lawyer about a dispute?",
        a: "It can be helpful to seek legal advice early, particularly where there are deadlines, contractual obligations, property interests, or other legal issues involved. Early advice can help you understand your position and the steps that may be available to you.",
      },
      {
        q: "What happens if someone is suing me?",
        a: "If you have been served with a claim, it is important to understand what has been filed, whether a response is required, and what deadlines may apply. We can review the claim with you, explain the process, and advise you on the available options.",
      },
      {
        q: "Can you help me recover money that someone owes me?",
        a: "We can assist with certain debt recovery matters, including reviewing the circumstances, relevant agreements and documentation, and advising on available options for pursuing the amount owing.",
      },
    ],
    image: "/photos/corporate.jpg",
    imageAlt: "Glass office towers seen from street level",
  },
  {
    slug: "criminal-law",
    number: "03",
    title: "Criminal Law",
    navLabel: "Criminal Law",
    metaDescription:
      "Criminal law representation with a clear view of the process when the stakes are high. Kaizen Law, Ontario.",
    summary:
      "Focused representation and a clear understanding of the process when the stakes are high.",
    intro:
      "When you are facing a criminal charge, the first thing you need is not a promise. It is a clear understanding of the process, the issues involved, and what may be at stake. We provide that understanding and give careful attention to the matter before you.",
    overview: [
      "A criminal charge can be difficult to navigate, particularly when you are unsure what happens next, what your options are, or what consequences may follow. We take the time to explain the process, review the disclosure and circumstances of your matter, and identify the legal issues that may be relevant to your defence.",
      "From bail through to resolution, we advise you on the steps involved, the options available, and the decisions that may need to be made along the way. Our role is to provide informed legal advice and representation while keeping you involved in the decisions concerning your matter.",
    ],
    includedHeading: "What this can include",
    points: [
      "Criminal charges and defence",
      "Bail hearings and release conditions",
      "Assault and violent offences",
      "Drug offences",
      "Sexual offences",
      "Theft, fraud, and property offences",
      "Driving and motor vehicle offences",
      "Warrants, searches, and arrest matters",
      "Criminal law motions and Charter issues",
      "Guilty pleas, trials, and sentencing",
      "Youth criminal justice matters",
    ],
    faqs: [
      {
        q: "I have just been charged. What should I do first?",
        a: "If you have been charged with a criminal offence, it is generally helpful to speak with a lawyer as early as possible. The appropriate next steps can depend on the nature of the charge, whether you have been released or detained, and the circumstances of your matter.",
      },
      {
        q: "What does the criminal process actually look like?",
        a: "The process can vary depending on the charge and the circumstances of the case. It may involve an initial court appearance, disclosure, pre-trial steps, motions, negotiations, a guilty plea or trial, and sentencing where applicable. We can explain the stages that may apply to your matter and what to expect at each step.",
      },
      {
        q: "What is bail, and what happens at a bail hearing?",
        a: "Bail is the process through which a person charged with an offence may be released while their matter is before the court, subject to any applicable terms and conditions. Where a person is not released by police, a bail hearing may be required. At a bail hearing, the court considers the circumstances of the case and the applicable legal requirements in deciding whether the person should be released and, if so, on what terms. We can explain the bail process, advise you on the issues that may arise, and represent you at a bail hearing where appropriate.",
      },
    ],
    image: "/photos/counsel.jpg",
    imageAlt: "A person signing a document at a desk",
  },
  {
    slug: "family-law",
    number: "04",
    title: "Family Law",
    navLabel: "Family Law",
    metaDescription:
      "Family law guidance for sensitive matters, with care and precision. Kaizen Law serves the GTA and Niagara.",
    summary:
      "Steady, informed guidance through sensitive family matters with care and precision.",
    intro:
      "Family law matters can involve important decisions about relationships, children, finances, and the future. We provide clear, practical legal guidance to help you understand the issues involved and the options available in your circumstances.",
    overview: [
      "Whether you are separating, making arrangements for your children, addressing support, or putting an agreement in place, we take the time to understand your situation and explain the legal considerations that may apply. Our role is to help you understand the process and the decisions that may need to be made along the way.",
      "We assist with separation, parenting arrangements, child and spousal support, property and financial matters, and family law agreements. Where an agreement can be reached, we can assist with documenting the terms. Where a dispute requires a more formal process, we can advise you on the available steps and represent you as appropriate.",
    ],
    includedHeading: "What this can include",
    points: [
      "Separation and divorce",
      "Parenting arrangements and decision-making",
      "Child and spousal support",
      "Property division and equalization",
      "Separation agreements and domestic contracts",
      "Marriage and cohabitation agreements",
      "Family law disputes and litigation",
      "Mobility and parenting across jurisdictions",
    ],
    faqs: [
      {
        q: "What should I do if I am separating from my spouse?",
        a: "Separation can involve a number of legal and practical decisions, including arrangements for children, support, property, and living arrangements. The steps that may be appropriate will depend on your circumstances. We can help you understand the issues that may need to be addressed and discuss the options available to you.",
      },
      {
        q: "How are parenting and support arrangements decided?",
        a: "Parenting arrangements and support are determined based on the circumstances of the family and the applicable legal framework. This may include considerations relating to the best interests of the child and the applicable child or spousal support rules. We can explain the factors that may apply to your situation and assist with putting appropriate arrangements in place.",
      },
      {
        q: "What happens to our home and other property when we separate?",
        a: "Separation can raise questions about the family home, other property, debts, and the division of family property. The legal considerations can vary depending on factors such as how property is owned, the circumstances of the relationship, and the applicable rules. We can review your circumstances and explain the legal issues that may affect you.",
      },
      {
        q: "Can you review a separation agreement before I sign it?",
        a: "Yes. We can review a separation agreement and explain its terms and the legal considerations that may be relevant to you before you decide whether to sign. Depending on the circumstances, we can also advise you about provisions that may require clarification or further discussion.",
      },
    ],
    image: "/photos/family.jpg",
    imageAlt: "A sunlit living room",
  },
  {
    slug: "notary",
    number: "05",
    title: "Notary Services",
    navLabel: "Notary",
    metaDescription:
      "Notary services in St. Catharines for documents that need professional witnessing. Kaizen Law Professional Corporation.",
    summary:
      "Convenient, professional notary services for documents that require trusted witnessing.",
    intro:
      "Some documents need to be notarized, certified, commissioned, or properly witnessed before they can be used for their intended purpose. We provide notary services by appointment at our St. Catharines office.",
    overview: [
      "We assist with a range of document-related services, including notarizing documents, certifying copies of original documents, commissioning affidavits and statutory declarations, and witnessing signatures where appropriate.",
      "The requirements can vary depending on the document and how it will be used. If you are unsure what service you need, we can discuss the document with you when arranging your appointment and let you know what to bring.",
      "Please bring valid government-issued identification and the complete document. If the document requires a signature in the presence of a notary or commissioner, please do not sign it in advance.",
    ],
    includedHeading: "What this can include",
    points: [
      "Notarizing documents",
      "Certifying copies of original documents",
      "Commissioning affidavits and statutory declarations",
      "Witnessing signatures where appropriate",
      "Notary services by appointment",
    ],
    faqs: [
      {
        q: "What should I bring to a notary appointment?",
        a: "Please bring valid government-issued identification and the complete document. If you need a copy certified, bring the original document as well. If the document requires you to sign in the presence of the notary, please leave it unsigned until your appointment.",
      },
      {
        q: "Can I sign the document before I arrive?",
        a: "If the document is to be signed in the presence of the notary, it should be signed during the appointment. If you are unsure, it is best to leave the document unsigned and confirm when arranging your appointment.",
      },
      {
        q: "How do I arrange notary services?",
        a: "Notary services are available by appointment at our St. Catharines office. Contact us with some information about the document and the service you are looking for, and we can let you know how to arrange an appointment.",
      },
    ],
    image: "/photos/notary.jpg",
    imageAlt: "A fountain pen resting on an open notebook",
  },
  {
    slug: "real-estate",
    number: "06",
    title: "Real Estate",
    navLabel: "Real Estate",
    metaDescription:
      "Real estate counsel for purchases, sales, refinancing, and the decisions that shape property ownership. Kaizen Law, St. Catharines.",
    summary:
      "Practical guidance for purchases, sales, refinancing, and the decisions that shape property ownership.",
    intro:
      "A real estate transaction is often one of the largest financial decisions a person will make. The details matter from what is being bought or sold, to the terms of the Agreement of Purchase and Sale, to the legal and financial considerations that can affect the transaction long after closing.",
    overview: [
      "At Kaizen Law, we help clients understand those details and navigate their transactions with clarity and confidence. We provide practical, responsive legal guidance from the initial review of your transaction through to closing.",
      "Whether you are purchasing your first home, selling a property, refinancing your mortgage, or entering into a commercial transaction, we work to make the legal process clear and predictable. We review agreements, conduct the necessary searches and due diligence, coordinate with lenders and other professionals, and ensure that the legal requirements for closing are addressed carefully and on time.",
      "We also advise clients on the important considerations that come with property ownership, including title structure, surveys, condominium status certificates, financing, and other matters that may affect your interests before or after a transaction is completed.",
      "Our approach is straightforward: understand the transaction, identify potential issues early, explain your options clearly, and work toward a smooth closing. Our goal is for you to understand exactly what you are buying, selling, or committing to, and to move forward with confidence.",
    ],
    includedHeading: "What this can include",
    points: [
      "Residential purchases and sales",
      "First-time homebuyers",
      "Mortgage refinancing",
      "Title transfers and survivorship applications",
      "Agreements of Purchase and Sale",
      "Private transactions and assignments",
      "Commercial real estate transactions",
      "Real estate due diligence and title searches",
      "Condominium transactions",
      "New construction and pre-construction purchases",
      "Private mortgage transactions",
      "Property transfers and changes in ownership",
    ],
    faqs: [
      {
        q: "When should I involve a lawyer in my purchase or sale?",
        a: "Real estate matters can take many forms, and the legal considerations can vary depending on the property, the parties involved, and the terms of the transaction. Legal guidance may be helpful when you are entering into a purchase or sale, arranging financing, changing ownership on title, dealing with a condominium property, or entering into a commercial or private transaction. At Kaizen Law, we work with clients at different stages of a real estate matter, from reviewing an agreement before it is signed to assisting with the legal steps required to complete a transaction.",
      },
      {
        q: "What happens between signing the agreement and closing?",
        a: "There is significant legal work between signing and closing. We conduct title and off-title searches, review the transaction and closing requirements, communicate with your lender and the other party's lawyer, prepare the necessary closing documentation, and coordinate the transfer of funds and title.",
      },
      {
        q: "Can you review my Agreement of Purchase and Sale before I sign it?",
        a: "Yes. Having a lawyer review an Agreement of Purchase and Sale before signing can help you understand your obligations and identify issues that may affect the transaction. Where appropriate, we can also assist with negotiating or proposing revisions to the agreement.",
      },
      {
        q: "Do I need a lawyer if I am refinancing my mortgage?",
        a: "Yes. A refinance involves a number of legal steps, from reviewing the new mortgage documents and lender requirements to addressing the existing mortgage, completing the necessary title work, and registering the new mortgage. A lawyer can handle these legal requirements and coordinate the closing process with the lender and other parties involved. The specific steps will depend on the terms of the refinance and the circumstances of the property.",
      },
      {
        q: "How much does a real estate lawyer charge for a closing?",
        a: "Legal fees can vary depending on the type of transaction, the property, and the work required. A straightforward residential transaction may differ in cost from a refinance, private transaction, or commercial matter. Before proceeding, we can explain the anticipated legal fees and other applicable costs based on the circumstances of your transaction.",
      },
    ],
    image: "/photos/real-estate.jpg",
    imageAlt: "A modern house exterior in warm light",
  },
  {
    slug: "wills-estates",
    number: "07",
    title: "Wills & Estates",
    navLabel: "Wills & Estates",
    metaDescription:
      "Wills and estates counsel for planning and administration. Kaizen Law Professional Corporation, serving Ontario clients.",
    summary:
      "Thoughtful planning and administration designed to protect what matters and clarify what comes next.",
    intro:
      "Estate planning is about more than preparing documents. It is about making thoughtful decisions about your future, your family, and the way your affairs will be managed when you are no longer able to manage them yourself.",
    overview: [
      "Whether you are putting a plan in place for the years ahead or helping administer the estate of someone close to you, we provide clear, practical legal guidance at every stage. We take the time to understand your circumstances and explain what your documents mean, what decisions need to be made, and what may need to happen next.",
      "A will can set out how you wish your estate to be distributed and who you want to take on important responsibilities. Powers of attorney can address who may make financial or personal care decisions on your behalf during your lifetime. Together with broader estate planning, these documents can help create greater clarity for you and those who may be called upon to act for you.",
      "When a loved one passes away, administering an estate can bring a different set of responsibilities. We assist executors and estate trustees with the legal steps involved, from probate and dealing with estate assets and liabilities to the eventual distribution of the estate, depending on the circumstances.",
    ],
    includedHeading: "What this can include",
    points: [
      "Wills",
      "Powers of attorney",
      "Estate planning",
      "Estate administration and probate",
      "Survivorship applications",
    ],
    faqs: [
      {
        q: "Do I need a will if my estate is relatively simple?",
        a: "A will can be useful regardless of the size of your estate. It allows you to set out how you want your estate to be distributed and who you wish to appoint to administer it. Without a will, the distribution of your estate and the administration of your estate are generally governed by Ontario law, which may not reflect your wishes. If you are unsure whether you need a will or what should be included, we can discuss your circumstances and the options available to you.",
      },
      {
        q: "What is a Power of Attorney?",
        a: "A Power of Attorney is a legal document that allows you to give another person authority to make certain decisions on your behalf while you are alive. A Power of Attorney for Property generally concerns financial and property matters, while a Power of Attorney for Personal Care concerns personal care decisions. The appropriate documents and provisions depend on your circumstances.",
      },
      {
        q: "I have been named an executor. What should I do first?",
        a: "Administering an estate can involve a number of legal and practical steps. The appropriate starting point will depend on the circumstances of the estate, the terms of the will, and the assets and liabilities involved. We can assist executors and estate trustees in understanding their responsibilities and the steps that may be required.",
      },
      {
        q: "What is probate, and is it always required?",
        a: "Probate is the court process through which an estate trustee may obtain a Certificate of Appointment of Estate Trustee. Whether an application is necessary depends on the circumstances of the estate and the assets involved. We can advise you on whether an application may be required and assist with the process where appropriate.",
      },
      {
        q: "Can you help with an estate after someone has passed away?",
        a: "Yes. We assist with estate administration and can advise on matters such as probate, estate assets and liabilities, required documentation, and distribution of the estate, depending on the circumstances.",
      },
    ],
    image: "/photos/wills.jpg",
    imageAlt: "A fountain pen writing on paper",
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
  /** One-line summary for compact cards. */
  summary: string;
  /** Full bio paragraphs for the profile. */
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
    summary:
      "A founding partner of Kaizen Law, Gourav focuses on criminal and family law, bringing a practical, personable approach to every matter.",
    bio: [
      "Gourav Sharma is a founding partner of Kaizen Law, with a practice focused primarily on criminal and family law. He brings a practical and personable approach to his work, taking the time to understand each client's circumstances and objectives and providing clear, thoughtful advice throughout the legal process.",
      "Gourav studied Criminology at York University before obtaining his law degree from the University of Leicester in the United Kingdom.",
      "Outside of law, Gourav enjoys working out, running, and travelling.",
    ],
    photo: "/photos/gourav-sharma.jpg",
    photoReady: false,
  },
  {
    name: "Nitika Thapar",
    role: "Co-Founder",
    monogram: "NT",
    jurisdiction: "Ontario",
    summary:
      "A co-founder of Kaizen Law, Nitika practises across real estate, wills and estates, business and corporate law, and family law.",
    bio: [
      "Nitika Thapar is a co-founder of Kaizen Law, with a practice encompassing real estate, wills and estates, business and corporate law, and family law. She takes a thoughtful and detail-oriented approach to her practice, with a focus on understanding each client's circumstances and providing practical legal guidance tailored to their needs.",
      "Nitika completed her undergraduate studies at the University of Waterloo, majoring in Legal Studies, before obtaining her law degree from the University of Leicester in the United Kingdom.",
      "Outside of her legal practice, Nitika enjoys travelling, spending time with her dog, discovering new places to eat, and spending time with family and friends.",
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
  // Business and Corporate were merged into a single practice area.
  { source: "/practice/business", destination: "/practice/business-corporate", permanent: true },
  { source: "/practice/corporate", destination: "/practice/business-corporate", permanent: true },
];

export function absoluteUrl(path = "/"): string {
  const clean = "/" + path.replace(/^\/+/, "").replace(/\/+$/, "");
  return clean === "/" ? site.domain + "/" : site.domain + clean;
}

export function canonical(path = "/"): string {
  return absoluteUrl(path);
}
