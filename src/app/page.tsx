import Image from "next/image";
import { Enquiry } from "@/components/sections/Enquiry";
import { Reviews } from "@/components/sections/Reviews";
import { PracticeList } from "@/components/sections/PracticeList";
import { FoundersPanelSwitch } from "@/components/preview/FoundersPanelSwitch";
import { LawyerCardsSwitch } from "@/components/preview/LawyerCardsSwitch";
import { GoldButton, SectionIndex, TextLink } from "@/components/ui/primitives";
import { buildMetadata } from "@/lib/seo";
import {
  about,
  contact,
  homeDisclaimer,
  peopleIntro,
  philosophy,
  site,
  whyKaizen,
} from "@/lib/site.config";

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
            Your Matter.
            <br />
            <em>Our Commitment.</em>
          </h1>
          <p className="hero-intro">
            Strategic legal advice. Dedicated representation. A commitment to
            what matters most to you.
          </p>
          <GoldButton href="/contact">Request a Consultation</GoldButton>
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
            {philosophy.title} <em>{philosophy.titleEm}</em>
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

      {/* Why Kaizen */}
      <section className="section-light" id="why-kaizen" style={{ paddingTop: 0 }}>
        <SectionIndex n="03" label={whyKaizen.eyebrow} />
        <div className="split-grid">
          <h2>
            {whyKaizen.title} <em>{whyKaizen.titleEm}</em>
          </h2>
          <div>
            <p className="lead">{whyKaizen.paragraphs[0]}</p>
            {whyKaizen.paragraphs.slice(1).map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Practice */}
      <section className="practice section-dark" id="practice">
        <SectionIndex n="04" label="Areas of practice" on="ink" />
        <div className="section-heading">
          <h2>
            Comprehensive Legal Services.
            <br />
            <em>Personalized Attention.</em>
          </h2>
        </div>
        <PracticeList />
      </section>

      {/* People */}
      <section className="people section-light" id="people">
        <SectionIndex n="05" label="The people behind the practice" />
        <div className="people-intro">
          <h2>
            {peopleIntro.title}
            <br />
            <em>{peopleIntro.titleEm}</em>
          </h2>
          <div className="people-intro-copy">
            {peopleIntro.paragraphs.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </div>
        <LawyerCardsSwitch />
      </section>

      {/* Reviews — renders only when live/approved reviews exist */}
      <Reviews />

      {/* Locations */}
      <section className="locations section-gold" id="locations">
        <div className="location-layout">
          <div>
            <SectionIndex n="06" label="Where we work" />
            <h2>
              Close to
              <br />
              <em>what matters.</em>
            </h2>
          </div>
          <div>
            <p className="lead">{contact.areasLead}</p>
            <p>
              Our office and client relationships span{" "}
              {contact.areas.map((area) => area.name).join(", ")}.
            </p>
            <TextLink href="/contact">Get in touch</TextLink>
          </div>
        </div>
      </section>

      {/* Contact */}
      <Enquiry index="07" />

      {/* Legal disclaimer — home page only */}
      <aside className="home-disclaimer" role="note">
        <p>{homeDisclaimer}</p>
      </aside>
    </>
  );
}
