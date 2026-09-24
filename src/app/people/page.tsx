import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { FoundersPanelSwitch } from "@/components/preview/FoundersPanelSwitch";
import { PeopleProfilesSwitch } from "@/components/preview/PeopleProfilesSwitch";
import { Container } from "@/components/ui/primitives";
import { JsonLd, aboutPageSchema, breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { about, lawyers, glance } from "@/lib/site.config";

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
          "Licensed in Ontario",
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

              <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 border-t border-line pt-8 sm:max-w-xl sm:grid-cols-3">
                {glance.map((item) => (
                  <li key={item.label} className="flex flex-col gap-2">
                    <span className="display text-[2.5rem] leading-none text-ink">
                      {item.value}
                    </span>
                    <span className="eyebrow text-muted">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <FoundersPanelSwitch
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
          <PeopleProfilesSwitch />
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
