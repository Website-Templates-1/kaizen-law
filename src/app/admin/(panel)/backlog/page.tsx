import Link from "next/link";
import { SubmitAction } from "../SubmitAction";
import { readBacklog, unusedCount } from "@/lib/backlog";
import { usingGitHub } from "@/lib/github";
import {
  cardPanel,
  chipDanger,
  chipIdle,
  chipPrimary,
  eyebrow,
  fieldInput,
  fieldLabel,
  listCard,
  listRow,
  rowActions,
} from "../ui";

export const dynamic = "force-dynamic";

export default async function BacklogPage({
  searchParams,
}: PageProps<"/admin/backlog">) {
  const sp = await searchParams;
  const backlog = await readBacklog();
  const queued = backlog.topics.filter((t) => !t.used);
  const used = backlog.topics.filter((t) => t.used);

  const notice = sp.added
    ? `Added ${sp.added} topic(s).`
    : sp.suggested
      ? sp.suggested === "0"
        ? "No new topics — the AI's ideas were already in the backlog."
        : `Added ${sp.suggested} AI-suggested topic(s).`
      : sp.updated
        ? "Topic saved."
        : sp.deleted
          ? "Topic deleted."
          : null;
  const error = typeof sp.error === "string" ? sp.error : null;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm text-cream/55 hover:text-cream">
          ← Back
        </Link>
        <h1 className="display mt-2 text-[2rem] text-cream">Topic backlog</h1>
        <p className="mt-1 text-sm text-cream/55">
          {unusedCount(backlog)} topic(s) queued for the generator.
          {!usingGitHub && " Local content (GitHub not configured)."}
        </p>
      </div>

      <SubmitAction
        action="/api/admin/backlog/suggest"
        label="Suggest topics with AI"
        pendingLabel="Thinking…"
        className={chipIdle}
      />

      {notice && (
        <p className="rounded-[10px] border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {notice}
        </p>
      )}
      {error && (
        <p className="rounded-[10px] border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <section className={cardPanel}>
        <h2 className="serif text-[1.4rem] text-cream">Add a topic</h2>
        <form
          method="post"
          action="/api/admin/backlog/add"
          className="mt-5 space-y-3"
        >
          <div>
            <label className={fieldLabel}>Topic</label>
            <input name="topic" required className={fieldInput} />
          </div>
          <div>
            <label className={fieldLabel}>
              Notes{" "}
              <span className="normal-case tracking-normal text-cream/35">
                (optional angle)
              </span>
            </label>
            <input name="notes" className={fieldInput} />
          </div>
          <button type="submit" className={chipPrimary}>
            Add topic
          </button>
        </form>
      </section>

      <section>
        <h2 className={eyebrow}>Queued ({queued.length})</h2>
        {queued.length === 0 ? (
          <p className="mt-3 text-sm text-cream/55">
            No topics queued. Add one above or let the AI suggest some.
          </p>
        ) : (
          <ul className={listCard}>
            {queued.map((t) => (
              <li key={t.topic} className={listRow}>
                <p className="font-semibold text-cream">{t.topic}</p>
                {t.notes && (
                  <p className="mt-0.5 text-sm text-cream/55">{t.notes}</p>
                )}
                <div className={rowActions}>
                  <Link
                    href={`/admin/backlog/edit?topic=${encodeURIComponent(t.topic)}`}
                    className={chipIdle}
                  >
                    Edit
                  </Link>
                  <SubmitAction
                    action="/api/admin/backlog/delete"
                    hidden={{ topic: t.topic }}
                    confirm={`Delete the queued topic "${t.topic}"? This can't be undone here.`}
                    label="Delete"
                    pendingLabel="Deleting…"
                    className={chipDanger}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {used.length > 0 && (
        <section>
          <h2 className={eyebrow}>Already used ({used.length})</h2>
          <ul className={`${listCard} opacity-60`}>
            {used.map((t) => (
              <li key={t.topic} className={`${listRow} text-sm text-cream/55`}>
                {t.topic}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
