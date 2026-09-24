import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PreviewProvider } from "@/components/preview/PreviewMode";
import {
  JsonLd,
  legalServiceSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/jsonld";
import { analytics, site } from "@/lib/site.config";

export const viewport: Viewport = {
  themeColor: "#151513",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: site.defaultTitle,
    template: site.titleTemplate,
  },
  description: site.defaultDescription,
  applicationName: site.legalName,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: site.legalName,
    locale: site.locale,
    url: site.domain,
  },
  twitter: { card: "summary_large_image" },
  ...(analytics.googleSearchConsoleVerification
    ? {
        verification: {
          other: {
            "google-site-verification":
              analytics.googleSearchConsoleVerification,
          },
        },
      }
    : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.htmlLang} className="h-full">
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={legalServiceSchema()} />
        <PreviewProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </PreviewProvider>
      </body>
    </html>
  );
}
