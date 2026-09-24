import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireSession, sameOrigin, adminRedirect } from "@/lib/admin-guard";
import { createPost } from "@/lib/blog-admin";

export async function POST(request: NextRequest) {
  if (!(await requireSession()))
    return new NextResponse("Unauthorized", { status: 401 });
  if (!(await sameOrigin()))
    return new NextResponse("Bad origin", { status: 403 });

  const form = await request.formData();
  const input = {
    title: String(form.get("title") ?? ""),
    slug: String(form.get("slug") ?? ""),
    metaDescription: String(form.get("metaDescription") ?? ""),
    excerpt: String(form.get("excerpt") ?? ""),
    body: String(form.get("body") ?? ""),
    author: String(form.get("author") ?? ""),
  };

  try {
    const slug = await createPost(input);
    // Drop into the editor to enrich (FAQs / related searches / tags), preview,
    // and approve.
    return adminRedirect(`/admin/posts/${slug}?saved=1`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Create failed";
    return adminRedirect(`/admin/posts/new?error=${encodeURIComponent(msg)}`);
  }
}
