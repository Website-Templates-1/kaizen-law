import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container, TextLink } from "@/components/ui/primitives";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/lib/jsonld";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Insights", path: "/blog" },
];

export const metadata: Metadata = buildMetadata({
  title: "Insights",
  description:
    "Plain-language legal insights for individuals, families, and businesses in Ontario, from the team at Kaizen Law Professional Corporation.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Clear reading on"
        italic="the law that touches you."
        lede="Plain-language guidance on the moments that shape a life or a business — buying a home, planning an estate, running a company, and more."
        crumbs={crumbs}
        meta={[`${posts.length} article${posts.length === 1 ? "" : "s"}`, "Ontario law", "General information"]}
      />

      <section className="bg-cream py-20 sm:py-28">
        <Container>
          {posts.length === 0 ? (
            <div className="mx-auto max-w-xl border border-line bg-cream-deep/40 p-10 text-center">
              <h2 className="serif text-[1.6rem] text-ink">
                Articles coming soon
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                We are preparing practical articles on the areas we practise. In
                the meantime, reach out with any question and we will point you
                in the right direction.
              </p>
              <div className="mt-7 flex justify-center">
                <TextLink href="/contact">Ask us a question</TextLink>
              </div>
            </div>
          ) : (
            <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col gap-3 border-t border-line pt-6"
                  >
                    <time
                      dateTime={post.publishedAt}
                      className="eyebrow text-muted"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                    <h2 className="serif text-[1.5rem] leading-tight text-ink transition-colors group-hover:text-gold">
                      {post.title}
                    </h2>
                    <p className="text-[15px] leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                    <span className="eyebrow mt-2 inline-flex items-center gap-2 text-gold">
                      Read article
                      <span aria-hidden="true" className="text-base leading-none">
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <CtaBand
        eyebrow="Have a question?"
        title="Discuss your"
        italic="matter with us."
      />

      <JsonLd data={breadcrumbSchema(crumbs)} />
      {posts.length > 0 && (
        <JsonLd
          data={itemListSchema(
            posts.map((p) => ({ name: p.title, path: `/blog/${p.slug}` })),
          )}
        />
      )}
    </>
  );
}
