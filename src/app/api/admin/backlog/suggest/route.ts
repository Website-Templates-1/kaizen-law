import { NextResponse } from "next/server";
import {
  requireSession,
  sameOrigin,
  rateLimit,
  adminRedirect,
} from "@/lib/admin-guard";
import { readBacklog, addTopics } from "@/lib/backlog";
import { suggestTopics } from "@/lib/generation/openai";

export async function POST() {
  if (!(await requireSession()))
    return new NextResponse("Unauthorized", { status: 401 });
  if (!(await sameOrigin()))
    return new NextResponse("Bad origin", { status: 403 });
  if (!rateLimit("suggest-topics", 20, 60 * 60_000))
    return new NextResponse("Rate limited", { status: 429 });

  try {
    const existing = (await readBacklog()).topics.map((t) => t.topic);
    const ideas = await suggestTopics(5, existing);
    const added = await addTopics(ideas);
    return adminRedirect(`/admin/backlog?suggested=${added}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Suggestion failed";
    return adminRedirect(`/admin/backlog?error=${encodeURIComponent(msg)}`);
  }
}
