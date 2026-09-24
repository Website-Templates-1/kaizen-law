import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  requireSession,
  sameOrigin,
  reviewRepliesEnabled,
  adminRedirect,
} from "@/lib/admin-guard";
import { updateReply } from "@/lib/review-api";

// Save an edited draft response. This NEVER approves — approval is a separate,
// explicit step (see ./approve). The `id` is the central service's review id;
// project isolation is enforced server-side by the per-project bearer key in
// review-api.ts, so we never send or trust a project id here.
export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await requireSession()))
    return new NextResponse("Unauthorized", { status: 401 });
  if (!(await sameOrigin()))
    return new NextResponse("Bad origin", { status: 403 });
  if (!reviewRepliesEnabled())
    return new NextResponse("Reply management is not enabled for this site.", {
      status: 403,
    });

  const { id } = await ctx.params;

  const form = await request.formData();
  const body = String(form.get("body") ?? "").trim();
  if (!body) {
    return adminRedirect(
      `/admin/reviews/${id}?error=Response%20cannot%20be%20empty`,
    );
  }

  try {
    await updateReply(id, body);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Save failed";
    return adminRedirect(`/admin/reviews/${id}?error=${encodeURIComponent(msg)}`);
  }
  return adminRedirect(`/admin/reviews/${id}?notice=saved`);
}
