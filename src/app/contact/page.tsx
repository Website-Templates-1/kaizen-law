import { Enquiry } from "@/components/sections/Enquiry";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { contact } from "@/lib/site.config";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export const metadata = buildMetadata({
  title: "Contact",
  description: `Reach Kaizen Law Professional Corporation at ${contact.addressLine}, ${contact.phoneDisplay}, or ${contact.email}. Meetings are by appointment.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Enquiry asPage crumbs={crumbs} />
    </>
  );
}
