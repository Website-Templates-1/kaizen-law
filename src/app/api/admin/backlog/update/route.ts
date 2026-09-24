import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireSession, sameOrigin, adminRedirect } from "@/lib/admin-guard";
import { updateTopic } from "@/lib/backlog";

export async function POST(request: NextRequest) {
  if (!(await requireSession()))
    return new NextResponse("Unauthorized", { status: 401 });
  if (!(await sameOrigin()))
    return new NextResponse("Bad origin", { status: 403 });

  const form = await request.formData();
  const original = String(form.get("original") ?? "").trim();
  const topic = String(form.get("topic") ?? "").trim();
  const notes = String(form.get("notes") ?? "").trim();
  if (!original || !topic) {
    return adminRedirect("/admin/backlog?error=Enter+a+topic");
  }

  try {
    await updateTopic(original, { topic, notes });
    return adminRedirect("/admin/backlog?updated=1");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Update failed";
    const back = `/admin/backlog/edit?topic=${encodeURIComponent(original)}&error=${encodeURIComponent(msg)}`;
    return adminRedirect(back);
  }
}
