import Image from "next/image";
import { Container, Crumbs } from "@/components/ui/primitives";
import type { Crumb } from "@/lib/jsonld";

export function PageHero({
  eyebrow,
  title,
  italic,
  lede,
  crumbs,
  image,
  imageAlt,
  meta,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  lede: string;
  crumbs: Crumb[];
  image?: string;
  imageAlt?: string;
  /** Optional bottom meta row, shown only on the text-forward (image-less) hero. */
  meta?: string[];
}) {
  const goldLines = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.14]"
      style={{
        background:
          "linear-gradient(125deg, transparent 48%, var(--gold) 49%, transparent 50%), linear-gradient(35deg, transparent 48%, var(--gold) 49%, transparent 50%)",
      }}
    />
  );

  // Text-forward hero — no photo. Larger headline carries the section.
  if (!image) {
    return (
      <section className="relative overflow-hidden bg-ink text-cream">
        {goldLines}
        <Container className="relative flex min-h-[68vh] flex-col justify-center pb-24 pt-40 lg:pb-28 lg:pt-48">
          <Crumbs items={crumbs} />
          <p className="eyebrow mt-10 text-gold-bright">{eyebrow}</p>
          <h1 className="display mt-7 max-w-[16ch] text-[2.75rem] leading-[1.0] sm:text-[4rem] lg:text-[4.75rem]">
            {title}
            {italic && (
              <span className="mt-1 block italic text-gold-bright">{italic}</span>
            )}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-[1.7] text-cream/70">
            {lede}
          </p>
          {meta && meta.length > 0 && (
            <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-3 border-t border-white/12 pt-6">
              {meta.map((item) => (
                <span
                  key={item}
                  className="text-[10px] uppercase tracking-[0.16em] text-cream/45"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </Container>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      {goldLines}
      <Container className="relative grid items-center gap-14 pb-20 pt-36 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-44">
        <div>
          <Crumbs items={crumbs} />
          <p className="eyebrow mt-10 text-gold-bright">{eyebrow}</p>
          <h1 className="display mt-6 max-w-[18ch] text-[2.5rem] leading-[1.02] sm:text-[3.25rem] lg:text-[3.75rem]">
            {title}
            {italic && (
              <span className="mt-1 block italic text-gold-bright">{italic}</span>
            )}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-[1.7] text-cream/70 sm:text-lg">
            {lede}
          </p>
        </div>
        <div className="media-frame relative aspect-[4/3] lg:aspect-[5/6]">
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            priority
            sizes="(min-width: 1024px) 34rem, 100vw"
            className="object-cover object-center"
          />
        </div>
      </Container>
    </section>
  );
}
