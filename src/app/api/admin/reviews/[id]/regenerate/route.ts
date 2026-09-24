import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  rateLimit,
  requireSession,
  sameOrigin,
  reviewRepliesEnabled,
  adminRedirect,
} from "@/lib/admin-guard";
import { regenerateReply } from "@/lib/review-api";

// Ask the central service for a fresh draft. This NEVER approves. A light,
// best-effort rate limit guards against accidental rapid re-triggers. The `id`
// is the central service's review id; project isolation is enforced server-side
// by the per-project bearer key in review-api.ts.
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

  if (!rateLimit(`regenerate:${id}`, 10, 60_000)) {
    return adminRedirect(
      `/admin/reviews/${id}?error=Please%20wait%20a%20moment%20before%20regenerating%20again`,
    );
  }

  try {
    await regenerateReply(id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Regenerate failed";
    return adminRedirect(`/admin/reviews/${id}?error=${encodeURIComponent(msg)}`);
  }
  return adminRedirect(`/admin/reviews/${id}?notice=regenerated`);
}
