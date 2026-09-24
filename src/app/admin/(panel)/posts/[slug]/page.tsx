import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostForEdit, faqsToText, searchesToText } from "@/lib/blog-admin";
import { internalPathAllowlist } from "@/lib/posts";
import { chipPrimary, fieldInput, fieldLabel } from "../../ui";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
  searchParams,
}: PageProps<"/admin/posts/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;
  const post = await getPostForEdit(slug);
  if (!post) notFound();

  const saved = Boolean(sp.saved);
  const error = typeof sp.error === "string" ? sp.error : null;
  const allowedPaths = Array.from(internalPathAllowlist()).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="text-sm text-cream/55 hover:text-cream">
          ← Back
        </Link>
        <Link
          href={`/admin/preview/${post.slug}`}
          className="text-sm font-semibold text-gold-bright hover:text-cream"
        >
          Preview
        </Link>
      </div>

      <h1 className="display text-[2rem] text-cream">Edit: {post.title}</h1>

      {saved && (
        <p className="rounded-[10px] border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          Saved.
        </p>
      )}
      {error && (
        <p className="rounded-[10px] border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <form method="post" action="/api/admin/save" className="space-y-4">
        <input type="hidden" name="slug" value={post.slug} />
        <div>
          <label className={fieldLabel}>Title</label>
          <input name="title" defaultValue={post.title} className={fieldInput} />
        </div>
        <div>
          <label className={fieldLabel}>Meta description</label>
          <input
            name="metaDescription"
            defaultValue={post.metaDescription}
            className={fieldInput}
          />
        </div>
        <div>
          <label className={fieldLabel}>Excerpt</label>
          <input
            name="excerpt"
            defaultValue={post.excerpt}
            className={fieldInput}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={fieldLabel}>Published at</label>
            <input
              name="publishedAt"
              defaultValue={post.publishedAt}
              className={fieldInput}
            />
          </div>
          <div>
            <label className={fieldLabel}>Author</label>
            <input
              name="author"
              defaultValue={post.author ?? ""}
              className={fieldInput}
            />
          </div>
          <div>
            <label className={fieldLabel}>Status</label>
            <select
              name="status"
              defaultValue={post.status}
              className={fieldInput}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </div>
        </div>
        <div>
          <label className={fieldLabel}>
            Tags{" "}
            <span className="normal-case tracking-normal text-cream/35">
              (comma-separated)
            </span>
          </label>
          <input
            name="tags"
            defaultValue={(post.tags ?? []).join(", ")}
            className={fieldInput}
          />
        </div>
        <div>
          <label className={fieldLabel}>
            FAQs{" "}
            <span className="normal-case tracking-normal text-cream/35">
              (one per line: <code>question | answer</code>)
            </span>
          </label>
          <textarea
            name="faqs"
            defaultValue={faqsToText(post.faqs)}
            rows={6}
            className={`${fieldInput} font-mono text-sm`}
          />
        </div>
        <div>
          <label className={fieldLabel}>
            People also search for{" "}
            <span className="normal-case tracking-normal text-cream/35">
              (one per line: <code>label | /path</code>; off-site or unknown
              paths are dropped)
            </span>
          </label>
          <textarea
            name="peopleAlsoSearch"
            defaultValue={searchesToText(post.peopleAlsoSearch)}
            rows={6}
            className={`${fieldInput} font-mono text-sm`}
          />
        </div>
        <details className="rounded-[10px] border border-white/12 bg-white/[0.03] px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-cream">
            Available internal links ({allowedPaths.length}) — for body links
            like <code>[real estate](/practice/real-estate)</code>
          </summary>
          <ul className="mt-3 grid gap-1 sm:grid-cols-2">
            {allowedPaths.map((p) => (
              <li key={p} className="font-mono text-xs text-cream/45">
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-cream/45">
            Links to anything not on this list are removed automatically, so
            posts never have broken internal links.
          </p>
        </details>
        <div>
          <label className={fieldLabel}>Body (Markdown)</label>
          <textarea
            name="body"
            defaultValue={post.bodyMarkdown}
            rows={22}
            className={`${fieldInput} font-mono text-sm`}
          />
        </div>
        <button type="submit" className={chipPrimary}>
          Save
        </button>
      </form>
    </div>
  );
}
