import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Portrait } from "@/components/media/Portrait";
import { Container } from "@/components/ui/primitives";
import { JsonLd, aboutPageSchema, breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { about, lawyers, practices } from "@/lib/site.config";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "People", path: "/people" },
];

export const metadata = buildMetadata({
  title: "Our people",
  description:
    "Meet Gourav Sharma, founder, and Nitika Thapar, co-founder, of Kaizen Law Professional Corporation in St. Catharines.",
  path: "/people",
});

const languages = Array.from(
  new Set(lawyers.flatMap((lawyer) => lawyer.languages)),
);

const glance = [
  { label: "Lawyers", value: String(lawyers.length) },
  { label: "Admissions", value: "Ontario" },
  { label: "Languages", value: languages.join(", ") },
  { label: "Focus areas", value: String(practices.length) },
];

export default function PeoplePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={aboutPageSchema({ path: "/people", people: lawyers })} />
      <PageHero
        eyebrow="The people behind the practice"
        title="Personal attention."
        italic="Professional perspective."
        lede="Every matter is different. The relationship between lawyer and client should be direct, responsive, and grounded in trust."
        crumbs={crumbs}
        meta={[
          `${lawyers.length} lawyers`,
          "Called in Ontario",
          languages.join(" · "),
        ]}
      />

      {/* Approach + founders photo + at a glance */}
      <section className="bg-cream py-24 sm:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
            <div>
              <p className="eyebrow text-gold">Our approach</p>
              <h2 className="display mt-6 text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem] lg:text-[3.25rem]">
                Direct, responsive,{" "}
                <em className="italic text-gold">grounded in trust.</em>
              </h2>
              <div className="prose-firm mt-8 max-w-2xl">
                <p>
                  Kaizen Law is a boutique practice by design. You work directly
                  with the lawyer handling your matter, not a rotating team, so
                  the advice you receive is considered, consistent, and shaped
                  around your objectives from the first conversation to the last.
                </p>
                <p>
                  Between us we advise across real estate, wills and estates,
                  business, corporate, family, and criminal matters, and we speak
                  English, Punjabi, Hindi, and Urdu, so more of our community can
                  be understood in their own words.
                </p>
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:max-w-lg">
                {glance.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1.5">
                    <dt className="eyebrow text-muted">{item.label}</dt>
                    <dd className="text-[15px] text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Portrait
              monogram="K"
              photo={about.teamPhoto}
              photoReady={about.teamPhotoReady}
              alt={about.teamPhotoAlt}
              aspect="4 / 5"
              caption="Photograph coming soon"
              sizes="(min-width: 1024px) 42vw, 90vw"
            />
          </div>
        </Container>
      </section>

      {/* Lawyer profiles */}
      <section className="bg-cream pb-24 sm:pb-32">
        <Container>
          <div className="space-y-20 sm:space-y-28">
            {lawyers.map((lawyer, i) => (
              <article
                key={lawyer.name}
                className="grid items-start gap-10 border-t border-line pt-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <Portrait
                    monogram={lawyer.monogram}
                    photo={lawyer.photo}
                    photoReady={lawyer.photoReady}
                    alt={`${lawyer.name}, ${lawyer.role} of Kaizen Law`}
                    aspect="4 / 5"
                    sizes="(min-width: 1024px) 34vw, 90vw"
                  />
                </div>

                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-gold">
                    {lawyer.role}
                  </p>
                  <h3 className="display mt-3 text-[2rem] text-ink sm:text-[2.5rem]">
                    {lawyer.name}
                  </h3>
                  <p className="mt-3 text-[13px] tracking-[0.04em] text-muted">
                    Called to the Ontario bar in {lawyer.called}
                  </p>
                  <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-muted">
                    {lawyer.bio.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>

                  <dl className="mt-8 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
                    <div>
                      <dt className="eyebrow text-gold">Practice</dt>
                      <dd className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-ink">
                        {lawyer.practice.map((item) => (
                          <Link
                            key={item.slug}
                            href={`/practice/${item.slug}`}
                            className="underline decoration-line underline-offset-4 hover:text-gold hover:decoration-gold"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-gold">Languages</dt>
                      <dd className="mt-3 text-ink">{lawyer.languages.join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-gold">Admissions</dt>
                      <dd className="mt-3 text-ink">
                        {lawyer.jurisdiction}, {lawyer.called}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        eyebrow="Work with us"
        title="Speak directly"
        italic="with your lawyer."
        note="Tell us about your matter and we will connect you with the right person. Information requests are answered by email."
      />
    </>
  );
}
