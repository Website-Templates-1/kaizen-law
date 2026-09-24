import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireSession, sameOrigin, adminRedirect } from "@/lib/admin-guard";
import {
  savePost,
  parseFaqsText,
  parseSearchesText,
  parseTagsText,
} from "@/lib/blog-admin";
import type { PostFrontmatter } from "@/lib/posts";

export async function POST(request: NextRequest) {
  if (!(await requireSession()))
    return new NextResponse("Unauthorized", { status: 401 });
  if (!(await sameOrigin()))
    return new NextResponse("Bad origin", { status: 403 });

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim();
  if (!slug) return new NextResponse("Missing slug", { status: 400 });

  const fm: PostFrontmatter = {
    title: String(form.get("title") ?? "").trim(),
    slug,
    metaDescription: String(form.get("metaDescription") ?? "").trim(),
    excerpt: String(form.get("excerpt") ?? "").trim(),
    publishedAt: String(form.get("publishedAt") ?? "").trim(),
    author: String(form.get("author") ?? "").trim() || undefined,
    status: (String(form.get("status") ?? "draft") === "published"
      ? "published"
      : "draft") as PostFrontmatter["status"],
    faqs: parseFaqsText(String(form.get("faqs") ?? "")),
    peopleAlsoSearch: parseSearchesText(
      String(form.get("peopleAlsoSearch") ?? ""),
    ),
    tags: parseTagsText(String(form.get("tags") ?? "")),
  };
  const body = String(form.get("body") ?? "");

  try {
    await savePost(slug, fm, body, `Edit post: ${slug}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Save failed";
    return adminRedirect(`/admin/posts/${slug}?error=${encodeURIComponent(msg)}`);
  }
  return adminRedirect(`/admin/posts/${slug}?saved=1`);
}
