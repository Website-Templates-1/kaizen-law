import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  requireSession,
  sameOrigin,
  reviewRepliesEnabled,
  adminRedirect,
} from "@/lib/admin-guard";
import { approveReply } from "@/lib/review-api";

// Explicitly approve the current draft response. This is the ONLY endpoint that
// approves. Approval adds the response to the central review management queue —
// it does NOT post to Google. The `id` is the central service's review id;
// project isolation is enforced server-side by the per-project bearer key in
// review-api.ts.
export async function POST(
  _request: NextRequest,
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

  try {
    await approveReply(id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Approve failed";
    return adminRedirect(`/admin/reviews/${id}?error=${encodeURIComponent(msg)}`);
  }
  return adminRedirect(`/admin/reviews/${id}?notice=approved`);
}
