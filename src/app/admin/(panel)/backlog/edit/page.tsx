import Link from "next/link";
import { notFound } from "next/navigation";
import { findQueuedTopic, readBacklog } from "@/lib/backlog";
import { chipPrimary, fieldInput, fieldLabel } from "../../ui";

export const dynamic = "force-dynamic";

export default async function EditTopicPage({
  searchParams,
}: PageProps<"/admin/backlog/edit">) {
  const sp = await searchParams;
  const original = typeof sp.topic === "string" ? sp.topic : "";
  const backlog = await readBacklog();
  const item = original ? findQueuedTopic(backlog, original) : undefined;
  if (!item) notFound();

  const error = typeof sp.error === "string" ? sp.error : null;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/backlog"
        className="text-sm text-cream/55 hover:text-cream"
      >
        ← Back
      </Link>

      <h1 className="display text-[2rem] text-cream">Edit topic</h1>

      {error && (
        <p className="rounded-[10px] border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <form
        method="post"
        action="/api/admin/backlog/update"
        className="space-y-4"
      >
        <input type="hidden" name="original" value={item.topic} />
        <div>
          <label className={fieldLabel}>Topic</label>
          <input
            name="topic"
            required
            defaultValue={item.topic}
            className={fieldInput}
          />
        </div>
        <div>
          <label className={fieldLabel}>
            Notes{" "}
            <span className="normal-case tracking-normal text-cream/35">
              (optional angle)
            </span>
          </label>
          <input
            name="notes"
            defaultValue={item.notes ?? ""}
            className={fieldInput}
          />
        </div>
        <button type="submit" className={chipPrimary}>
          Save
        </button>
      </form>
    </div>
  );
}
