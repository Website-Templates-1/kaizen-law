import { ContactForm } from "@/components/contact/ContactForm";
import { Crumbs, SectionIndex } from "@/components/ui/primitives";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";
import type { Crumb } from "@/lib/jsonld";
import { contact } from "@/lib/site.config";

export function Enquiry({
  asPage = false,
  crumbs,
}: {
  asPage?: boolean;
  crumbs?: Crumb[];
}) {
  const Title = asPage ? "h1" : "h2";

  return (
    <section className="contact section-dark" id="contact">
      {crumbs && (
        <div style={{ marginBottom: 32 }}>
          <Crumbs items={crumbs} />
        </div>
      )}
      <SectionIndex n="06" label="Start a conversation" on="ink" />
      <div className="contact-grid">
        <div className="contact-info">
          <Title>
            Let&apos;s discuss
            <br />
            <em>your next step.</em>
          </Title>
          <p className="contact-note">{contact.response}</p>

          <dl className="contact-details">
            <div className="contact-row">
              <dt>
                <PinIcon className="contact-icon" />
                Office
              </dt>
              <dd>
                {contact.address.street}
                <br />
                {contact.address.city}, {contact.address.regionName}{" "}
                {contact.address.postalCode}
              </dd>
            </div>
            <div className="contact-row">
              <dt>
                <MailIcon className="contact-icon" />
                Email
              </dt>
              <dd>
                <a href={contact.emailHref}>{contact.email}</a>
              </dd>
            </div>
            <div className="contact-row">
              <dt>
                <PhoneIcon className="contact-icon" />
                Call
              </dt>
              <dd>
                <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
                <a href={contact.faxHref} className="muted-line">
                  Fax {contact.faxDisplay}
                </a>
              </dd>
            </div>
            <div className="contact-row">
              <dt>
                <ClockIcon className="contact-icon" />
                Hours
              </dt>
              <dd>{contact.hours}</dd>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
