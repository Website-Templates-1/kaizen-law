import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireSession, sameOrigin, adminRedirect } from "@/lib/admin-guard";
import { approvePost } from "@/lib/blog-admin";

export async function POST(request: NextRequest) {
  if (!(await requireSession()))
    return new NextResponse("Unauthorized", { status: 401 });
  if (!(await sameOrigin()))
    return new NextResponse("Bad origin", { status: 403 });

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim();
  if (!slug) return new NextResponse("Missing slug", { status: 400 });

  try {
    await approvePost(slug);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Approve failed";
    return adminRedirect(`/admin?error=${encodeURIComponent(msg)}`);
  }
  return adminRedirect("/admin?approved=1");
}
