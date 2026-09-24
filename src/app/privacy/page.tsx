import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/primitives";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { contact, site } from "@/lib/site.config";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy", path: "/privacy" },
];

export const metadata = buildMetadata({
  title: "Privacy",
  description:
    "How Kaizen Law Professional Corporation collects, uses, and protects personal information sent through this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero
        eyebrow="Privacy"
        title="Privacy policy"
        lede="Effective September 2026. How we handle personal information you send through this website."
        crumbs={crumbs}
      />
      <section className="bg-cream py-16 sm:py-24">
        <Container>
          <div className="prose-firm mx-auto max-w-3xl">
            <p>
              {site.legalName} (&ldquo;Kaizen Law&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;) respects your privacy. This policy describes the
              personal information this website collects and how we use it,
              consistent with applicable Canadian privacy law.
            </p>

            <h2>Information we collect</h2>
            <p>
              If you use the enquiry form, we collect your name, email address,
              phone number if you provide one, the matter type you select, and
              the message you write. We also receive the same kinds of details
              if you email or call us directly.
            </p>

            <h2>How we use it</h2>
            <ul>
              <li>To read your enquiry and reply by email.</li>
              <li>To decide whether we can assist with the matter you describe.</li>
              <li>To meet professional and legal obligations that apply to our practice.</li>
            </ul>
            <p>
              We do not sell personal information. We do not use this website to
              run advertising cookies or third-party analytics.
            </p>

            <h2>A message is not a retainer</h2>
            <p>
              Sending a form, email, or voicemail does not create a lawyer-client
              relationship. Until we confirm that we can act for you, do not
              include confidential or sensitive details in a website message.
            </p>

            <h2>How long we keep it</h2>
            <p>
              We keep enquiry information for as long as we need it to respond
              and to meet our professional obligations, then delete or de-identify
              it when we no longer need it.
            </p>

            <h2>Contact</h2>
            <p>
              Privacy questions can be sent to{" "}
              <a href={contact.emailHref}>{contact.email}</a> or by mail to{" "}
              {contact.addressLine}.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
