import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/primitives";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { practices } from "@/lib/site.config";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Practice", path: "/practice" },
];

export const metadata = buildMetadata({
  title: "Practice areas",
  description:
    "Real estate, wills and estates, business, corporate, family law, criminal law, and notary services from Kaizen Law Professional Corporation.",
  path: "/practice",
});

export default function PracticePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd
        data={itemListSchema(
          practices.map((p) => ({
            name: p.title,
            path: `/practice/${p.slug}`,
          })),
        )}
      />
      <PageHero
        eyebrow="Areas of practice"
        title="Law for the"
        italic="whole picture."
        lede="From a first home to a complex family matter, we bring focused attention to the details that move your matter forward."
        crumbs={crumbs}
        meta={[
          `${practices.length} practice areas`,
          "Real estate to criminal",
          "GTA & Niagara",
        ]}
      />

      <section className="bg-cream py-24 sm:py-32">
        <Container>
          <div className="max-w-2xl">
            <p className="eyebrow text-gold">How we help</p>
            <h2 className="display mt-6 text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem] lg:text-[3.25rem]">
              Focused counsel across{" "}
              <em className="italic text-gold">seven areas.</em>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Each area draws on the same principle: understand the objective
              first, then translate the detail into a clear path forward. Select
              an area to see how we approach it.
            </p>
          </div>

          <ul className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {practices.map((practice) => (
              <li key={practice.slug}>
                <Link
                  href={`/practice/${practice.slug}`}
                  className="group flex h-full flex-col"
                >
                  <div className="media-frame relative aspect-[4/3]">
                    <Image
                      src={practice.image}
                      alt={practice.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="media-badge absolute left-4 top-4 text-[11px] font-bold tracking-[0.18em] text-cream/90">
                      {practice.number}
                    </span>
                  </div>
                  <h3 className="serif mt-6 text-[1.6rem] text-ink transition-colors group-hover:text-gold">
                    {practice.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {practice.summary}
                  </p>
                  <span className="eyebrow mt-5 inline-flex items-center gap-2 text-gold">
                    View area
                    <span aria-hidden="true" className="text-base leading-none">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        eyebrow="Let's talk"
        title="Not sure which area"
        italic="fits your matter?"
        note="Tell us a little about the situation and we will point you to the right starting place. Information requests are answered by email."
      />
    </>
  );
}
