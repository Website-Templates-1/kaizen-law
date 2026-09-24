import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { PeopleAlsoSearch } from "@/components/sections/PeopleAlsoSearch";
import { Container, GoldButton } from "@/components/ui/primitives";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";
import {
  JsonLd,
  breadcrumbSchema,
  faqPageSchema,
  serviceSchema,
} from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import {
  contact,
  engagementNote,
  engagementSteps,
  getPractice,
  practices,
} from "@/lib/site.config";

export function generateStaticParams() {
  return practices.map((practice) => ({ slug: practice.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/practice/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const practice = getPractice(slug);
  if (!practice) return { title: "Practice area" };
  return buildMetadata({
    title: practice.title,
    description: practice.metaDescription,
    path: `/practice/${practice.slug}`,
    image: practice.image,
  });
}

export default async function PracticeDetailPage({
  params,
}: PageProps<"/practice/[slug]">) {
  const { slug } = await params;
  const practice = getPractice(slug);
  if (!practice) notFound();

  const path = `/practice/${practice.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Practice", path: "/practice" },
    { name: practice.title, path },
  ];
  const others = practices.filter((item) => item.slug !== practice.slug).slice(0, 3);
  const relatedSearches = [
    ...practices
      .filter((item) => item.slug !== practice.slug)
      .map((item) => ({ label: item.title, href: `/practice/${item.slug}` })),
    { label: "Meet our lawyers", href: "/people" },
    { label: "Contact Kaizen Law", href: "/contact" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd
        data={serviceSchema({
          name: practice.title,
          description: practice.summary,
          path,
        })}
      />
      {practice.faqs.length > 0 && (
        <JsonLd data={faqPageSchema(practice.faqs)} />
      )}
      <PageHero
        eyebrow={`Practice ${practice.number}`}
        title={practice.title}
        lede={practice.summary}
        crumbs={crumbs}
        image={practice.image}
        imageAlt={practice.imageAlt}
      />

      {/* What we handle + a sticky contact rail */}
      <section className="bg-cream py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
          <div>
            <p className="eyebrow text-gold">What we handle</p>
            <h2 className="serif mt-6 text-[2rem] text-ink">
              {practice.includedHeading}
            </h2>
            <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {practice.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 border-t border-line pt-4 text-[15px] leading-relaxed text-ink"
                >
                  <span className="mt-px text-gold" aria-hidden="true">
                    +
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact rail */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-cream-deep/50 p-8 lg:p-10">
              <p className="eyebrow text-gold">Speak with us</p>
              <h2 className="serif mt-4 text-[1.6rem] leading-tight text-ink">
                Discuss your {practice.title.toLowerCase()} matter.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Share a little about your situation and we will be in touch.
                Information requests are answered by email.
              </p>
              <div className="mt-7">
                <GoldButton href="/contact">Start a conversation</GoldButton>
              </div>
              <dl className="mt-8 space-y-5 border-t border-line pt-7 text-[14px]">
                <div>
                  <dt className="flex items-center gap-2 eyebrow text-muted">
                    <MailIcon className="h-4 w-4 shrink-0 text-gold" />
                    Email
                  </dt>
                  <dd className="mt-2">
                    <a href={contact.emailHref} className="text-ink hover:text-gold">
                      {contact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 eyebrow text-muted">
                    <PhoneIcon className="h-4 w-4 shrink-0 text-gold" />
                    Phone
                  </dt>
                  <dd className="mt-2">
                    <a href={contact.phoneHref} className="text-ink hover:text-gold">
                      {contact.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 eyebrow text-muted">
                    <PinIcon className="h-4 w-4 shrink-0 text-gold" />
                    Office
                  </dt>
                  <dd className="mt-2 leading-relaxed text-ink">
                    {contact.address.street}
                    <br />
                    {contact.address.city}, {contact.address.region}{" "}
                    {contact.address.postalCode}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </Container>
      </section>

      {/* Overview */}
      <section className="bg-cream-deep/40 py-20 sm:py-28">
        <Container className="max-w-3xl">
          <p className="eyebrow text-gold">Overview</p>
          <p className="mt-6 text-[21px] leading-[1.5] text-ink">
            {practice.intro}
          </p>
          <div className="prose-firm mt-6">
            {practice.overview.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
          <p className="mt-10 border-t border-line pt-6 text-[13px] leading-relaxed text-muted">
            {engagementNote}
          </p>
        </Container>
      </section>

      {/* Who it's for */}
      <section className="bg-cream py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow text-gold">Who it&apos;s for</p>
            <h2 className="display mt-6 text-[2rem] leading-[1.14] text-ink sm:text-[2.5rem]">
              Is this the <em className="italic text-gold">right fit?</em>
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-muted">
              Every matter is different. If any of the following sound like your
              situation, a short conversation will tell us both whether we are
              the right fit.
            </p>
          </div>
          <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {practice.whoFor.map((item) => (
              <li
                key={item}
                className="flex gap-3 border-t border-line pt-5 text-[16px] leading-relaxed text-ink"
              >
                <span className="mt-px text-gold" aria-hidden="true">
                  +
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* How we work */}
      <section className="bg-ink py-20 text-cream sm:py-28">
        <Container>
          <div className="max-w-2xl">
            <p className="eyebrow text-gold-bright">How we work</p>
            <h2 className="display mt-6 text-[2rem] leading-[1.14] text-white sm:text-[2.5rem]">
              A measured process,{" "}
              <em className="italic text-gold-bright">every time.</em>
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-cream/60">
              The same measured process guides every matter, so you always know
              what is happening and what comes next.
            </p>
          </div>
          <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {engagementSteps.map((step, i) => (
              <li key={step.title} className="border-t border-dark-line pt-6">
                <span className="text-[11px] uppercase tracking-[0.16em] text-gold-bright">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="serif mt-4 text-[1.5rem] text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#aca9a2]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-cream py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow text-gold">Questions</p>
            <h2 className="display mt-6 text-[2rem] leading-[1.14] text-ink sm:text-[2.5rem]">
              {practice.title},{" "}
              <em className="italic text-gold">answered.</em>
            </h2>
          </div>
          <dl className="divide-y divide-line border-t border-line">
            {practice.faqs.map((faq) => (
              <div key={faq.q} className="py-7">
                <dt className="serif text-[1.3rem] text-ink">{faq.q}</dt>
                <dd className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
                  {faq.a}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* People also search for — internal-linking chip cloud */}
      <section className="bg-cream-deep/40 py-16 sm:py-20">
        <Container>
          <PeopleAlsoSearch items={relatedSearches} />
        </Container>
      </section>

      {/* Related areas + CTA */}
      <section className="bg-gold py-20 text-ink sm:py-28">
        <Container className="grid gap-y-12 gap-x-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow" style={{ color: "#6b5a2f" }}>
              Other areas
            </p>
            <h2 className="display mt-6 text-[2.25rem] leading-[1.14] sm:text-[2.75rem]">
              Explore the <em className="italic">full practice.</em>
            </h2>
          </div>
          <div>
            <ul className="divide-y" style={{ borderColor: "rgba(21,21,19,0.2)" }}>
              {others.map((item) => (
                <li key={item.slug} style={{ borderColor: "rgba(21,21,19,0.2)" }}>
                  <Link
                    href={`/practice/${item.slug}`}
                    className="flex items-baseline justify-between gap-4 py-5 text-ink transition-opacity hover:opacity-70"
                  >
                    <span className="serif text-2xl">{item.title}</span>
                    <span className="text-[11px] uppercase tracking-[0.16em]">
                      {item.number}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <Link
                href="/practice"
                className="text-link"
                style={{ borderColor: "var(--ink)", color: "var(--ink)" }}
              >
                All practice areas
                <span aria-hidden="true">+</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
