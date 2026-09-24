/**
 * Pure generation logic, framework-free: read system prompt + topic backlog,
 * ask OpenAI for one post, validate it, and return the files to commit
 * (the new draft + the updated backlog). Callable from a Route Handler, a
 * manual button, or a CLI/GitHub Action — none of them differ here.
 * Server-only.
 */
import "server-only";
import matter from "gray-matter";
import {
  parsePost,
  internalPathAllowlist,
  filterAllowedSearches,
  type PostFrontmatter,
} from "@/lib/posts";
import { readFile } from "@/lib/github";
import { generateBlogPost } from "@/lib/generation/openai";
import {
  readBacklog,
  serializeBacklog,
  BACKLOG_PATH,
  type Backlog,
} from "@/lib/backlog";
import { blog } from "@/lib/site.config";

const PROMPT_PATH = "content/_prompts/system.md";

export interface GenerationResult {
  slug: string;
  files: { path: string; text: string }[];
}

export async function generateDraft(): Promise<GenerationResult> {
  const promptFile = await readFile(PROMPT_PATH);
  if (!promptFile) throw new Error(`Missing ${PROMPT_PATH}`);

  const backlog = await readBacklog();
  const next = backlog.topics.find((t) => !t.used);
  if (!next) throw new Error("Topic backlog is empty — add topics to generate.");

  const allowedPaths = Array.from(internalPathAllowlist()).sort();
  const user = [
    `Chosen topic: ${next.topic}`,
    `Notes: ${next.notes ?? "(none)"}`,
    "",
    "Allowed internal paths — use these verbatim both for inline body links",
    "([text](/path)) and for peopleAlsoSearch hrefs. Do NOT invent any others:",
    ...allowedPaths.map((p) => `- ${p}`),
  ].join("\n");
  const gen = await generateBlogPost(promptFile.text, user);

  // Deterministic safety net: strip em/en dashes (the prompt forbids them, but
  // models slip). Replace with a comma and tidy stray punctuation.
  const deDash = (s: string): string =>
    (s ?? "")
      .replace(/\s*[—–]\s*/g, ", ")
      .replace(/,\s*([,.;:!?)])/g, "$1")
      .replace(/\(\s*,\s*/g, "(");
  gen.title = deDash(gen.title);
  gen.metaDescription = deDash(gen.metaDescription);
  gen.excerpt = deDash(gen.excerpt);
  gen.bodyMarkdown = deDash(gen.bodyMarkdown);

  // Sanitize enrichment before commit: drop malformed FAQs, drop any related
  // link not in the allowlist, normalize tags. A bad generation can never
  // produce a broken link or fail the build.
  const faqs = gen.faqs
    ?.map((f) => ({
      question: deDash(f.question?.trim() ?? ""),
      answer: deDash(f.answer?.trim() ?? ""),
    }))
    .filter((f) => f.question && f.answer) as PostFrontmatter["faqs"];
  const peopleAlsoSearch = filterAllowedSearches(gen.peopleAlsoSearch).map(
    (s) => ({ ...s, label: deDash(s.label) }),
  );
  const tags = Array.from(
    new Set((gen.tags ?? []).map((t) => t.trim().toLowerCase()).filter(Boolean)),
  );

  const today = new Date().toISOString().slice(0, 10);
  const fm: PostFrontmatter = {
    title: gen.title,
    slug: gen.slug,
    metaDescription: gen.metaDescription,
    excerpt: gen.excerpt,
    publishedAt: today,
    author: blog.author,
    status: "draft",
    ...(faqs && faqs.length ? { faqs } : {}),
    ...(peopleAlsoSearch.length ? { peopleAlsoSearch } : {}),
    ...(tags.length ? { tags } : {}),
  };
  const text = matter.stringify(`\n${gen.bodyMarkdown.trim()}\n`, {
    title: fm.title,
    slug: fm.slug,
    metaDescription: fm.metaDescription,
    excerpt: fm.excerpt,
    publishedAt: fm.publishedAt,
    author: fm.author,
    status: fm.status,
    ...(fm.faqs ? { faqs: fm.faqs } : {}),
    ...(fm.peopleAlsoSearch ? { peopleAlsoSearch: fm.peopleAlsoSearch } : {}),
    ...(fm.tags ? { tags: fm.tags } : {}),
  });

  // First line of defense: never commit a post that would fail the build.
  parsePost(text, gen.slug);

  const updatedBacklog: Backlog = {
    topics: backlog.topics.map((t) =>
      t.topic === next.topic ? { ...t, used: true } : t,
    ),
  };

  return {
    slug: gen.slug,
    files: [
      { path: `content/blog/${gen.slug}.md`, text },
      { path: BACKLOG_PATH, text: serializeBacklog(updatedBacklog) },
    ],
  };
}
