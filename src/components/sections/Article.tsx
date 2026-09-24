import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { PeopleAlsoSearch } from "@/components/sections/PeopleAlsoSearch";
import {
  JsonLd,
  breadcrumbSchema,
  blogPostingSchema,
  faqPageSchema,
} from "@/lib/jsonld";
import { formatDate } from "@/lib/format";
import {
  filterAllowedSearches,
  getRelatedPosts,
  internalPathAllowlist,
  sanitizeBodyHtml,
  type Post,
} from "@/lib/posts";

/**
 * Canonical article renderer shared by the public route (`/blog/[slug]`) and
 * the auth-gated admin preview (`/admin/preview/[slug]`), so "what you approve
 * is what ships". In `preview` mode it shows a draft banner and omits JSON-LD.
 */
export function Article({
  post,
  preview = false,
}: {
  post: Post;
  preview?: boolean;
}) {
  const path = `/blog/${post.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/blog" },
    { name: post.title, path },
  ];

  const allow = internalPathAllowlist();
  const bodyHtml = sanitizeBodyHtml(post.bodyHtml, allow);
  const faqs = post.faqs ?? [];
  const searches = filterAllowedSearches(post.peopleAlsoSearch);
  const related = getRelatedPosts(post.slug);

  const meta = [formatDate(post.publishedAt), post.author].filter(
    (v): v is string => Boolean(v),
  );

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={post.title}
        lede={post.excerpt}
        crumbs={crumbs}
        meta={meta}
      />

      {preview && (
        <div className="bg-gold/15 py-3 text-center text-[12px] uppercase tracking-[0.16em] text-ink">
          {post.status} preview — not published
        </div>
      )}

      <section className="bg-cream py-16 sm:py-24">
        <Container className="max-w-3xl">
          <div
            className="prose-kaizen"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </Container>
      </section>

      {faqs.length > 0 && (
        <section className="bg-cream-deep/40 py-16 sm:py-20">
          <Container className="max-w-3xl">
            <p className="eyebrow text-gold">Questions</p>
            <h2 className="display mt-5 text-[1.9rem] leading-[1.14] text-ink sm:text-[2.25rem]">
              Answered.
            </h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {faqs.map((f) => (
                <details key={f.question} className="group py-5">
                  <summary className="serif flex cursor-pointer list-none items-baseline justify-between gap-4 text-[1.2rem] text-ink marker:hidden">
                    {f.question}
                    <span
                      aria-hidden="true"
                      className="text-gold transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-cream py-16 sm:py-24">
          <Container>
            <p className="eyebrow text-gold">Keep reading</p>
            <h2 className="display mt-5 text-[1.9rem] leading-[1.14] text-ink sm:text-[2.25rem]">
              Related insights.
            </h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group flex h-full flex-col gap-3 border-t border-line pt-5"
                  >
                    <time
                      dateTime={r.publishedAt}
                      className="eyebrow text-muted"
                    >
                      {formatDate(r.publishedAt)}
                    </time>
                    <h3 className="serif text-[1.4rem] text-ink transition-colors group-hover:text-gold">
                      {r.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-muted">
                      {r.excerpt}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {searches.length > 0 && (
        <section className="bg-cream-deep/40 py-14 sm:py-16">
          <Container>
            <PeopleAlsoSearch items={searches} />
          </Container>
        </section>
      )}

      <CtaBand
        eyebrow="Have a question?"
        title="Discuss your"
        italic="matter with us."
      />

      {!preview && (
        <>
          <JsonLd data={breadcrumbSchema(crumbs)} />
          <JsonLd
            data={blogPostingSchema({
              title: post.title,
              description: post.metaDescription,
              path,
              datePublished: post.publishedAt,
              dateModified: post.updatedAt,
              author: post.author,
            })}
          />
          {faqs.length > 0 && (
            <JsonLd
              data={faqPageSchema(
                faqs.map((f) => ({ q: f.question, a: f.answer })),
              )}
            />
          )}
        </>
      )}
    </>
  );
}
