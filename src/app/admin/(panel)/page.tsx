import Link from "next/link";
import { SubmitAction } from "./SubmitAction";
import { listAllPosts } from "@/lib/blog-admin";
import { readBacklog, unusedCount } from "@/lib/backlog";
import { usingGitHub } from "@/lib/github";
import { hasCustomPassword } from "@/lib/credentials";
import { formatDate } from "@/lib/format";
import {
  chipIdle,
  chipPrimary,
  chipDanger,
  eyebrow,
  listCard,
  listRow,
  rowActions,
} from "./ui";

export const dynamic = "force-dynamic";

const noticeBox =
  "rounded-[10px] border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200";
const errorBox =
  "rounded-[10px] border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300";
const warnBox =
  "rounded-[10px] border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-bright";

export default async function DashboardPage({
  searchParams,
}: PageProps<"/admin">) {
  const sp = await searchParams;
  const posts = await listAllPosts();
  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");
  const topicsQueued = unusedCount(await readBacklog());
  const customPassword = await hasCustomPassword();

  const notice = sp.approved
    ? "Post approved — it will go live on the next deploy."
    : sp.deleted
      ? "Draft deleted."
      : sp.generated
        ? `Draft generated: ${sp.generated}`
        : null;
  const error = typeof sp.error === "string" ? sp.error : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display text-[2rem] text-cream">Insights</h1>
        <p className="mt-1 text-sm text-cream/55">
          Draft, approve, and publish articles.
          {!usingGitHub ? " Local content (GitHub not configured)." : ""}
        </p>
      </div>

      <div className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max items-center gap-2">
          <Link href="/admin/posts/new" className={chipPrimary}>
            New post
          </Link>
          <SubmitAction
            action="/api/admin/generate"
            label="Generate draft"
            pendingLabel="Generating…"
            className={chipIdle}
          />
          <Link href="/admin/backlog" className={chipIdle}>
            Manage topics
            {topicsQueued > 0 && (
              <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-cream">
                {topicsQueued}
              </span>
            )}
          </Link>
        </div>
      </div>

      {!customPassword && (
        <p className={warnBox}>
          You&apos;re still on the studio-issued password.{" "}
          <Link href="/admin/account" className="font-semibold underline">
            Set your own
          </Link>{" "}
          so only you can sign in.
        </p>
      )}

      {notice && <p className={noticeBox}>{notice}</p>}
      {error && <p className={errorBox}>{error}</p>}

      <section>
        <h2 className={eyebrow}>Drafts awaiting approval ({drafts.length})</h2>
        {drafts.length === 0 ? (
          <p className="mt-3 text-sm text-cream/55">No drafts.</p>
        ) : (
          <ul className={listCard}>
            {drafts.map((p) => (
              <li key={p.slug} className={listRow}>
                <p className="font-semibold text-cream">{p.title}</p>
                <p className="mt-0.5 text-xs text-cream/45">
                  {formatDate(p.publishedAt)} · {p.slug}
                </p>
                <div className={rowActions}>
                  <Link href={`/admin/preview/${p.slug}`} className={chipIdle}>
                    Preview
                  </Link>
                  <Link href={`/admin/posts/${p.slug}`} className={chipIdle}>
                    Edit
                  </Link>
                  <SubmitAction
                    action="/api/admin/approve"
                    hidden={{ slug: p.slug }}
                    label="Approve"
                    pendingLabel="Approving…"
                    className={chipPrimary}
                  />
                  <SubmitAction
                    action="/api/admin/delete"
                    hidden={{ slug: p.slug }}
                    confirm="Delete this draft? This removes the file from the repo."
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

      <section>
        <h2 className={eyebrow}>Published ({published.length})</h2>
        {published.length === 0 ? (
          <p className="mt-3 text-sm text-cream/55">Nothing published yet.</p>
        ) : (
          <ul className={listCard}>
            {published.map((p) => (
              <li key={p.slug} className={listRow}>
                <p className="font-semibold text-cream">{p.title}</p>
                <p className="mt-0.5 text-xs text-cream/45">
                  {formatDate(p.publishedAt)} · {p.slug}
                </p>
                <div className={rowActions}>
                  <Link href={`/blog/${p.slug}`} className={chipIdle}>
                    View live
                  </Link>
                  <Link href={`/admin/posts/${p.slug}`} className={chipIdle}>
                    Edit
                  </Link>
                  <SubmitAction
                    action="/api/admin/delete"
                    hidden={{ slug: p.slug }}
                    confirm={`Delete the PUBLISHED post "${p.title}"? It will be removed from the live site and its URL will 404 after the next deploy. This can't be undone here.`}
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
    </div>
  );
}
