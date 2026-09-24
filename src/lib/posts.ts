/**
 * In-repo blog/insights registry — "Git is the database".
 *
 * Posts are Markdown files with front matter under `content/blog/*.md`.
 * Adding/approving a post is a file change committed to the repo; the public
 * accessors below drive the route, metadata, JSON-LD, and sitemap with no other
 * wiring. Drafts live in the same folder, marked `status: draft`, and are
 * excluded from every public accessor.
 *
 * This module is build-time + server-only (reads the filesystem, renders
 * Markdown). It must never be imported by a Client Component.
 */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { practices, staticRoutes } from "@/lib/site.config";

// Allow only web-safe URL schemes on Markdown links/images. Anything with a
// scheme other than http/https/mailto (e.g. `javascript:`, `data:`) is dropped;
// relative, root-relative, and anchor URLs pass through untouched.
function safeUrl(href: string): string {
  // Strip control chars (incl. embedded newlines/tabs used to smuggle schemes).
  const cleaned = href.trim().replace(/[\x00-\x1F]/g, "");
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(cleaned)?.[1]?.toLowerCase();
  if (scheme && scheme !== "http" && scheme !== "https" && scheme !== "mailto") {
    return "";
  }
  return cleaned;
}

// Drop raw HTML blocks/inline HTML so authored or AI content cannot inject
// <script> or arbitrary markup. Markdown syntax still renders normally.
// walkTokens sanitizes link/image hrefs before the default renderer runs.
marked.use({
  gfm: true,
  renderer: { html: () => "" },
  walkTokens: (token) => {
    if (token.type === "link" || token.type === "image") {
      token.href = safeUrl(token.href ?? "");
    }
  },
});

export type PostStatus = "draft" | "published";

/** Visible-HTML FAQ entry. NOTE: FAQPage JSON-LD is emitted separately. */
export interface PostFaq {
  question: string;
  answer: string;
}

/** A "People also search for" internal link (root-relative href only). */
export interface PostRelatedSearch {
  label: string;
  href: string;
}

/** Enrichment fields shared by Post + PostFrontmatter. */
interface PostEnrichment {
  faqs?: PostFaq[];
  peopleAlsoSearch?: PostRelatedSearch[];
  tags?: string[];
}

export interface Post extends PostEnrichment {
  slug: string;
  title: string;
  /** ~140–160 char meta description. */
  metaDescription: string;
  /** Short summary for the Insights index. */
  excerpt: string;
  /** ISO date. Future-dated or draft posts never reach production. */
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  status: PostStatus;
  /** Raw Markdown body (used by the admin editor). */
  bodyMarkdown: string;
  /** Sanitized HTML rendered from the Markdown (used by the renderer). */
  bodyHtml: string;
}

/** Front matter shape as stored on disk (body is separate). */
export interface PostFrontmatter extends PostEnrichment {
  title: string;
  slug: string;
  metaDescription: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  status: PostStatus;
}

export const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/* ------------------------------------------------------------------ */
/* Markdown rendering — raw HTML disabled so authored/AI content can    */
/* never inject <script> or arbitrary markup.                           */
/* ------------------------------------------------------------------ */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/**
 * Neutralize unsafe/broken links in rendered post HTML — the guarantee behind
 * inline internal linking. For every anchor:
 *  - internal path in the allowlist → kept,
 *  - internal path NOT in the allowlist (broken / deleted target) → unwrapped
 *    to plain text (so a link never 404s),
 *  - http(s) external → kept but marked rel="noopener nofollow" target,
 *  - mailto:/tel: → kept,
 *  - anything else (relative, bare, javascript:) → unwrapped to text.
 * Runs at render time (Article), where the full allowlist is available.
 */
export function sanitizeBodyHtml(html: string, allow: Set<string>): string {
  return html.replace(
    /<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    (_m, href: string, inner: string) => {
      const h = href.trim();
      if (/^https?:\/\//i.test(h))
        return `<a href="${h}" rel="noopener nofollow" target="_blank">${inner}</a>`;
      if (/^(mailto:|tel:)/i.test(h)) return `<a href="${h}">${inner}</a>`;
      const norm = normalizeInternalHref(h);
      if (norm && allow.has(norm)) return `<a href="${norm}">${inner}</a>`;
      return inner; // broken/disallowed → drop the link, keep the text
    },
  );
}

/* ------------------------------------------------------------------ */
/* Parsing + validation (throws on bad data → fails the build loudly)   */
/* ------------------------------------------------------------------ */
const isStatus = (v: unknown): v is PostStatus =>
  v === "draft" || v === "published";

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/** A safe root-relative path: starts with "/", no protocol, no "//", no spaces. */
export function normalizeInternalHref(href: string): string | null {
  const h = str(href).replace(/\/+$/, "") || "/";
  if (!/^\/(?:[A-Za-z0-9\-._~/]*)$/.test(h)) return null;
  if (h.includes("//")) return null;
  return h;
}

/* Enrichment sanitizers — "sanitize, don't throw": malformed entries are      */
/* dropped so a bad generation can never fail the build.                       */
function sanitizeFaqs(v: unknown): PostFaq[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v
    .map((it) => {
      const o = (it ?? {}) as Record<string, unknown>;
      // accept {question,answer} (our shape) or {q,a} (FAQ section shape)
      return {
        question: str(o.question) || str(o.q),
        answer: str(o.answer) || str(o.a),
      };
    })
    .filter((f) => f.question && f.answer);
  return out.length ? out : undefined;
}

function sanitizeSearches(v: unknown): PostRelatedSearch[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: PostRelatedSearch[] = [];
  for (const it of v) {
    const o = (it ?? {}) as Record<string, unknown>;
    const label = str(o.label);
    const href = normalizeInternalHref(str(o.href));
    if (label && href) out.push({ label, href });
  }
  return out.length ? out : undefined;
}

function sanitizeTags(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = Array.from(
    new Set(v.map((t) => str(t).toLowerCase()).filter(Boolean)),
  );
  return out.length ? out : undefined;
}

/** Parse one Markdown file's contents into a Post. `expectedSlug` is the filename. */
export function parsePost(raw: string, expectedSlug: string): Post {
  const { data, content } = matter(raw);
  const fm = data as Partial<PostFrontmatter>;
  const where = expectedSlug || fm.slug || "(unknown)";

  if (!fm.title?.trim()) throw new Error(`Post "${where}" is missing a title.`);
  if (!fm.slug?.trim()) throw new Error(`Post "${where}" is missing a slug.`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fm.slug))
    throw new Error(`Post "${where}" slug must be kebab-case.`);
  if (fm.slug !== expectedSlug)
    throw new Error(
      `Post "${where}": front-matter slug "${fm.slug}" must match filename "${expectedSlug}".`,
    );
  if (!fm.metaDescription?.trim())
    throw new Error(`Post "${where}" is missing a metaDescription.`);
  if (!fm.excerpt?.trim())
    throw new Error(`Post "${where}" is missing an excerpt.`);
  if (!fm.publishedAt || Number.isNaN(Date.parse(fm.publishedAt)))
    throw new Error(`Post "${where}" has an invalid publishedAt date.`);
  if (!isStatus(fm.status))
    throw new Error(`Post "${where}" status must be "draft" or "published".`);

  return {
    slug: fm.slug,
    title: fm.title,
    metaDescription: fm.metaDescription,
    excerpt: fm.excerpt,
    publishedAt: fm.publishedAt,
    updatedAt: fm.updatedAt,
    author: fm.author,
    status: fm.status,
    bodyMarkdown: content.trim(),
    bodyHtml: renderMarkdown(content),
    faqs: sanitizeFaqs(fm.faqs),
    peopleAlsoSearch: sanitizeSearches(fm.peopleAlsoSearch),
    tags: sanitizeTags(fm.tags),
  };
}

/* ------------------------------------------------------------------ */
/* Filesystem loader (build time + server render)                       */
/* ------------------------------------------------------------------ */
function loadAll(): Post[] {
  let files: string[];
  try {
    files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  } catch {
    return []; // no content dir yet — empty blog
  }
  const seen = new Set<string>();
  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const post = parsePost(raw, slug);
    if (seen.has(post.slug))
      throw new Error(`Duplicate post slug: "${post.slug}".`);
    seen.add(post.slug);
    return post;
  });
  return posts;
}

const all = loadAll();

const isPublished = (p: Post) =>
  p.status === "published" && Date.parse(p.publishedAt) <= Date.now();

const byNewest = (a: Post, b: Post) =>
  Date.parse(b.publishedAt) - Date.parse(a.publishedAt);

/* ------------------------------------------------------------------ */
/* Public accessors (same contract the router + sitemap depend on)      */
/* ------------------------------------------------------------------ */

export function getAllPosts(): Post[] {
  return all.filter(isPublished).sort(byNewest);
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Admin/preview only — includes drafts and future-dated posts. */
export function getPostBySlugIncludingDrafts(slug: string): Post | undefined {
  return all.find((p) => p.slug === slug);
}

export function getSitemapPosts(): {
  slug: string;
  publishedAt: string;
  updatedAt?: string;
}[] {
  return getAllPosts().map(({ slug, publishedAt, updatedAt }) => ({
    slug,
    publishedAt,
    updatedAt,
  }));
}

/* ------------------------------------------------------------------ */
/* Internal-link allowlist + related content                            */
/* ------------------------------------------------------------------ */

/**
 * Every internal path a post may link to: static routes + practice detail
 * pages + published post slugs. Used to guarantee no broken internal links
 * (render-time filter, generation, and editor save all consult this).
 */
export function internalPathAllowlist(): Set<string> {
  const set = new Set<string>();
  for (const r of staticRoutes) set.add(r.path);
  for (const p of practices) set.add(`/practice/${p.slug}`);
  for (const p of getAllPosts()) set.add(`/blog/${p.slug}`);
  return set;
}

/** Drop any "people also search" link whose href isn't in the allowlist. */
export function filterAllowedSearches(
  items?: PostRelatedSearch[],
): PostRelatedSearch[] {
  if (!items || items.length === 0) return [];
  const allow = internalPathAllowlist();
  return items.filter((i) => {
    const h = normalizeInternalHref(i.href);
    return h !== null && allow.has(h);
  });
}

/**
 * Related published posts for a given slug: ranked by shared-tag count, then
 * newest. Falls back to newest posts when there are no tag overlaps, so the
 * section is never empty when other posts exist.
 */
export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const self = all.find((p) => p.slug === slug);
  const selfTags = new Set(self?.tags ?? []);
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      p,
      shared: (p.tags ?? []).filter((t) => selfTags.has(t)).length,
    }))
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        Date.parse(b.p.publishedAt) - Date.parse(a.p.publishedAt),
    )
    .slice(0, limit)
    .map((x) => x.p);
}
