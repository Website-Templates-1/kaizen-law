import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/sections/Article";
import { buildMetadata } from "@/lib/seo";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";

/** Only published posts render; unknown/draft slugs 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  return buildMetadata({
    title: post.title,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    ogType: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function ArticlePage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return <Article post={post} />;
}
