"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";
import { contact, practiceNav, site } from "@/lib/site.config";

const exploreLinks = [
  { label: "Practice areas", href: "/practice" },
  { label: "Our people", href: "/people" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();

  // The admin panel provides its own chrome — no marketing footer.
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" aria-label="Kaizen Law home">
            <Logo size="footer" />
          </Link>
          <p className="footer-tagline">Precision, strategy, integrity.</p>
        </div>

        <nav className="footer-col" aria-label="Explore">
          <p className="footer-heading">Explore</p>
          {exploreLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="footer-col" aria-label="Practice areas">
          <p className="footer-heading">Practice</p>
          {practiceNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="footer-col">
          <p className="footer-heading">Get in touch</p>
          <address className="footer-contact">
            <span className="footer-contact-item">
              <PinIcon className="footer-icon" />
              <span>
                {contact.address.street}
                <br />
                {contact.address.city}, {contact.address.regionName},{" "}
                {contact.address.postalCode}
              </span>
            </span>
            <a href={contact.emailHref} className="footer-contact-item footer-email">
              <MailIcon className="footer-icon" />
              <span>{contact.email}</span>
            </a>
            <a href={contact.phoneHref} className="footer-contact-item">
              <PhoneIcon className="footer-icon" />
              <span>{contact.phoneDisplay}</span>
            </a>
          </address>
        </div>
      </div>

      <p className="footer-areas">
        Serving {contact.areas.map((area) => area.name).join(" · ")}
      </p>

      <div className="footer-bottom">
        <span>
          © {year} {site.legalName}
        </span>
        <span>
          Site by{" "}
          <a href={site.studio.url} target="_blank" rel="noopener noreferrer">
            {site.studio.name}
          </a>
        </span>
      </div>
    </footer>
  );
}
