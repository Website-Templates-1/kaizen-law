import Image from "next/image";
import { Enquiry } from "@/components/sections/Enquiry";
import { Reviews } from "@/components/sections/Reviews";
import { PracticeList } from "@/components/sections/PracticeList";
import { FoundersPanelSwitch } from "@/components/preview/FoundersPanelSwitch";
import { LawyerCardsSwitch } from "@/components/preview/LawyerCardsSwitch";
import { GoldButton, SectionIndex, TextLink } from "@/components/ui/primitives";
import { buildMetadata } from "@/lib/seo";
import { about, contact, philosophy, site } from "@/lib/site.config";

export const metadata = buildMetadata({
  title: site.defaultTitle,
  description: site.defaultDescription,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero" id="top">
        <div className="hero-photo" aria-hidden="true">
          <Image src="/photos/hero.jpg" alt="" fill priority quality={90} sizes="100vw" />
        </div>
        <div className="hero-mark" aria-hidden="true">
          K
        </div>
        <div className="hero-copy">
          <p className="eyebrow">
            Precision in practice <span>·</span> Ontario
          </p>
          <h1>
            Clear counsel.
            <br />
            <em>Steady direction.</em>
          </h1>
          <p className="hero-intro">
            Thoughtful, practical legal solutions for the decisions that shape
            your life, your family, and your business.
          </p>
          <GoldButton href="/contact">Discuss your matter</GoldButton>
        </div>
        <div className="hero-foot">
          <span>Kaizen / 01</span>
          <span>Toronto · Niagara · Ontario</span>
        </div>
      </section>

      {/* Philosophy */}
      <section className="philosophy section-light" id="philosophy">
        <SectionIndex n="01" label={philosophy.eyebrow} />
        <div className="split-grid">
          <h2>
            {philosophy.titleLead} <em>{philosophy.titleEm}</em>{" "}
            {philosophy.titleRest}
          </h2>
          <div>
            <p className="lead">{philosophy.paragraphs[0]}</p>
            {philosophy.paragraphs.slice(1).map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* About the firm — who we are, with the founders */}
      <section className="section-light" id="about" style={{ paddingTop: 0 }}>
        <SectionIndex n="02" label={about.eyebrow} />
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
          <FoundersPanelSwitch
            monogram="K"
            photo={about.teamPhoto}
            photoReady={about.teamPhotoReady}
            alt={about.teamPhotoAlt}
            aspect="4 / 5"
            caption="Photograph coming soon"
            sizes="(min-width: 1024px) 44vw, 90vw"
          />
          <div>
            <h2>
              {about.title} <em>{about.titleEm}</em>
            </h2>
            <div className="about-copy">
              <p className="lead">{about.paragraphs[0]}</p>
              {about.paragraphs.slice(1).map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <TextLink href="/people">Meet the team</TextLink>
          </div>
        </div>
      </section>

      {/* Practice */}
      <section className="practice section-dark" id="practice">
        <SectionIndex n="03" label="Areas of practice" on="ink" />
        <div className="section-heading">
          <h2>
            Law for the <em>whole picture.</em>
          </h2>
          <p>
            From a first home to a complex family matter, we bring focused
            attention to the details that move your matter forward.
          </p>
        </div>
        <PracticeList />
      </section>

      {/* People */}
      <section className="people section-light" id="people">
        <SectionIndex n="04" label="The people behind the practice" />
        <div className="people-intro">
          <h2>
            Personal attention.
            <br />
            <em>Professional perspective.</em>
          </h2>
          <p>
            Every matter is different. We believe the relationship between
            lawyer and client should be direct, responsive, and grounded in
            trust.
          </p>
        </div>
        <LawyerCardsSwitch />
      </section>

      {/* Reviews — renders only when live/approved reviews exist */}
      <Reviews />

      {/* Locations */}
      <section className="locations section-gold" id="locations">
        <div className="location-layout">
          <div>
            <SectionIndex n="05" label="Where we work" />
            <h2>
              Close to
              <br />
              <em>what matters.</em>
            </h2>
          </div>
          <div>
            <p className="lead">
              Serving clients across the Greater Toronto and Niagara regions.
            </p>
            <p>
              Our offices and client relationships span{" "}
              {contact.areas.map((area) => area.name).join(", ")}.
            </p>
            <TextLink href="/contact">Get in touch</TextLink>
          </div>
        </div>
        <div className="media-frame relative mt-14 aspect-[3/4] w-full sm:mt-16 sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image
            src="/photos/toronto.jpg"
            alt="The Toronto skyline at golden hour"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 12%" }}
          />
        </div>
      </section>

      {/* Contact */}
      <Enquiry />
    </>
  );
}
