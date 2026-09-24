/**
 * Thin OpenAI wrapper — the only file to change if the provider ever changes.
 * Uses Structured Outputs so the model reliably returns our post shape.
 * Server-only (holds OPENAI_API_KEY).
 */
import "server-only";
import OpenAI from "openai";

export interface GeneratedPost {
  title: string;
  slug: string;
  metaDescription: string;
  excerpt: string;
  bodyMarkdown: string;
  faqs: { question: string; answer: string }[];
  peopleAlsoSearch: { label: string; href: string }[];
  tags: string[];
}

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    slug: {
      type: "string",
      description: "kebab-case, lowercase, hyphen-separated",
    },
    metaDescription: { type: "string", description: "~140-160 chars" },
    excerpt: { type: "string" },
    bodyMarkdown: {
      type: "string",
      description:
        "Markdown only, no raw HTML or front matter. 900-1400 words, 4-6 '##' sections, and 5-8 contextual internal links spread across the article using only the allowed internal paths.",
    },
    faqs: {
      type: "array",
      description: "5-7 concise question/answer pairs",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "answer"],
      },
    },
    peopleAlsoSearch: {
      type: "array",
      description:
        "6-8 related-search chips; href MUST be copied verbatim from the allowed internal paths given in the prompt",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          href: { type: "string" },
        },
        required: ["label", "href"],
      },
    },
    tags: {
      type: "array",
      description: "3-6 lowercase topic tags",
      items: { type: "string" },
    },
  },
  required: [
    "title",
    "slug",
    "metaDescription",
    "excerpt",
    "bodyMarkdown",
    "faqs",
    "peopleAlsoSearch",
    "tags",
  ],
} as const;

export interface SuggestedTopic {
  topic: string;
  notes: string;
}

const topicsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topics: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          topic: { type: "string" },
          notes: { type: "string", description: "1-2 line angle for the post" },
        },
        required: ["topic", "notes"],
      },
    },
  },
  required: ["topics"],
} as const;

/** Ask the model for fresh blog topic ideas, avoiding the supplied existing ones. */
export async function suggestTopics(
  count: number,
  existing: string[],
): Promise<SuggestedTopic[]> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You suggest practical blog topics for Kaizen Law Professional Corporation, an Ontario law firm serving individuals, families, and businesses across the Greater Toronto Area and Niagara in real estate, wills and estates, business, corporate, family, and criminal law. Topics must be specific, useful, and evergreen, written for prospective clients (not lawyers), in an Ontario legal context. General educational angles only, never specific legal advice. No duplicates of the existing list.",
      },
      {
        role: "user",
        content: `Suggest ${count} new topics. Existing topics to avoid:\n${
          existing.length ? existing.map((t) => `- ${t}`).join("\n") : "(none)"
        }`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "topic_ideas", strict: true, schema: topicsSchema },
    },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned no content.");
  return (JSON.parse(content) as { topics: SuggestedTopic[] }).topics;
}

export async function generateBlogPost(
  system: string,
  user: string,
): Promise<GeneratedPost> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "blog_post", strict: true, schema },
    },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned no content.");
  return JSON.parse(content) as GeneratedPost;
}
