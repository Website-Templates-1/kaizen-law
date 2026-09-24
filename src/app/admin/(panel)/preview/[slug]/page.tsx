import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/sections/Article";
import { getPostForEdit } from "@/lib/blog-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
}: PageProps<"/admin/preview/[slug]">) {
  const { slug } = await params;
  const post = await getPostForEdit(slug);
  if (!post) notFound();
  return <Article post={post} preview />;
}
