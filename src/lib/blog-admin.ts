/**
 * Admin-side blog operations against the live content store (GitHub or local
 * fallback). Unlike `posts.ts` (build-time, published-only), this reads drafts
 * too and performs writes. Server-only.
 */
import "server-only";
import matter from "gray-matter";
import {
  parsePost,
  renderMarkdown,
  filterAllowedSearches,
  type Post,
  type PostFaq,
  type PostFrontmatter,
  type PostRelatedSearch,
} from "@/lib/posts";
import { deleteFile, listDir, readFile, writeFile } from "@/lib/github";
import { blog } from "@/lib/site.config";

const DIR = "content/blog";
const filePath = (slug: string) => `${DIR}/${slug}.md`;

/** Every post (incl. drafts), read live from the store. */
export async function listAllPosts(): Promise<Post[]> {
  const names = (await listDir(DIR)).filter((n) => n.endsWith(".md"));
  const posts = await Promise.all(
    names.map(async (name) => {
      const slug = name.replace(/\.md$/, "");
      const file = await readFile(filePath(slug));
      if (!file) return null;
      try {
        return parsePost(file.text, slug);
      } catch {
        return null; // skip malformed files in listings
      }
    }),
  );
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export async function getPostForEdit(slug: string): Promise<Post | null> {
  const file = await readFile(filePath(slug));
  if (!file) return null;
  try {
    return parsePost(file.text, slug);
  } catch {
    return null;
  }
}

function serialize(fm: PostFrontmatter, body: string): string {
  // Keep a stable key order in the front matter.
  const ordered: Record<string, unknown> = {
    title: fm.title,
    slug: fm.slug,
    metaDescription: fm.metaDescription,
    excerpt: fm.excerpt,
    publishedAt: fm.publishedAt,
    ...(fm.updatedAt ? { updatedAt: fm.updatedAt } : {}),
    ...(fm.author ? { author: fm.author } : {}),
    status: fm.status,
    ...(fm.faqs && fm.faqs.length ? { faqs: fm.faqs } : {}),
    ...(fm.peopleAlsoSearch && fm.peopleAlsoSearch.length
      ? { peopleAlsoSearch: fm.peopleAlsoSearch }
      : {}),
    ...(fm.tags && fm.tags.length ? { tags: fm.tags } : {}),
  };
  return matter.stringify(`\n${body.trim()}\n`, ordered);
}

/* ---- editor <-> text helpers (one entry per line) ---- */

/** FAQs as `question | answer` lines. */
export function faqsToText(faqs?: PostFaq[]): string {
  return (faqs ?? []).map((f) => `${f.question} | ${f.answer}`).join("\n");
}
export function parseFaqsText(text: string): PostFaq[] {
  return text
    .split("\n")
    .map((line) => {
      const i = line.indexOf("|");
      if (i === -1) return null;
      const question = line.slice(0, i).trim();
      const answer = line.slice(i + 1).trim();
      return question && answer ? { question, answer } : null;
    })
    .filter((f): f is PostFaq => f !== null);
}

/** People-also-search as `label | /path` lines. */
export function searchesToText(items?: PostRelatedSearch[]): string {
  return (items ?? []).map((s) => `${s.label} | ${s.href}`).join("\n");
}
export function parseSearchesText(text: string): PostRelatedSearch[] {
  const items = text
    .split("\n")
    .map((line) => {
      const i = line.indexOf("|");
      if (i === -1) return null;
      const label = line.slice(0, i).trim();
      const href = line.slice(i + 1).trim();
      return label && href ? { label, href } : null;
    })
    .filter((s): s is PostRelatedSearch => s !== null);
  // Drop any link not in the allowlist (no broken internal links).
  return filterAllowedSearches(items);
}

export function parseTagsText(text: string): string[] {
  return Array.from(
    new Set(
      text
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

/** Validate + persist an edited post. Throws on invalid content. */
export async function savePost(
  slug: string,
  fm: PostFrontmatter,
  body: string,
  message: string,
): Promise<void> {
  const withUpdate: PostFrontmatter = {
    ...fm,
    slug,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  const text = serialize(withUpdate, body);
  parsePost(text, slug); // throws if the result is invalid
  renderMarkdown(body); // surfaces any Markdown parse error early
  await writeFile(filePath(slug), text, message);
}

/** Slug that would shadow the create route or is otherwise reserved. */
const RESERVED_SLUGS = new Set(["new"]);

/** Derive a kebab-case slug from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Create a brand-new draft from the admin panel. Enforces a valid, unique,
 * non-reserved slug so a manual post can never overwrite an existing file.
 * Returns the slug of the created draft.
 */
export async function createPost(input: {
  title: string;
  slug?: string;
  metaDescription: string;
  excerpt: string;
  body: string;
  author?: string;
}): Promise<string> {
  const slug = slugify(input.slug?.trim() || input.title);
  if (!slug) throw new Error("Could not derive a slug — add a title or slug.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new Error(
      "Slug must be kebab-case (lowercase letters, numbers, hyphens).",
    );
  if (RESERVED_SLUGS.has(slug))
    throw new Error(`"${slug}" is a reserved slug — choose another.`);

  const existing = await readFile(filePath(slug));
  if (existing) throw new Error(`A post with the slug "${slug}" already exists.`);

  const today = new Date().toISOString().slice(0, 10);
  const fm: PostFrontmatter = {
    title: input.title.trim(),
    slug,
    metaDescription: input.metaDescription.trim(),
    excerpt: input.excerpt.trim(),
    publishedAt: today,
    author: input.author?.trim() || blog.author,
    status: "draft",
  };
  // savePost validates via parsePost and refuses to write invalid content.
  await savePost(slug, fm, input.body, `Create draft: ${slug}`);
  return slug;
}

/**
 * Delete a post (draft or published). Deleting a published post removes its
 * live page — the caller (admin UI) is responsible for confirming that.
 * Internal links self-heal: related content + the search allowlist are
 * computed from published posts, so the removed slug drops out on rebuild.
 */
export async function deletePost(slug: string): Promise<void> {
  const file = await readFile(filePath(slug));
  if (!file) throw new Error(`Post "${slug}" not found.`);
  const { data } = matter(file.text);
  const status = (data as PostFrontmatter).status;
  const label = status === "published" ? "published post" : "draft";
  await deleteFile(filePath(slug), `Delete ${label}: ${slug}`);
}

/** Flip a draft to published (the approval action). */
export async function approvePost(slug: string): Promise<void> {
  const file = await readFile(filePath(slug));
  if (!file) throw new Error(`Post "${slug}" not found.`);
  const { data, content } = matter(file.text);
  const fm = data as PostFrontmatter;
  fm.status = "published";
  fm.slug = slug;
  await savePost(slug, fm, content, `Approve & publish: ${slug}`);
}
