import Link from "next/link";
import { chipPrimary, fieldInput, fieldLabel } from "../../ui";

export const dynamic = "force-dynamic";

export default async function NewPostPage({
  searchParams,
}: PageProps<"/admin/posts/new">) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;

  return (
    <div className="space-y-6">
      <Link href="/admin" className="text-sm text-cream/55 hover:text-cream">
        ← Back
      </Link>
      <h1 className="display text-[2rem] text-cream">New draft</h1>
      <p className="text-sm text-cream/55">
        Creates a draft you can then enrich (FAQs, related searches, tags),
        preview, and approve. Nothing goes live until you approve it.
      </p>

      {error && (
        <p className="rounded-[10px] border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <form method="post" action="/api/admin/create" className="space-y-4">
        <div>
          <label className={fieldLabel}>Title</label>
          <input name="title" required className={fieldInput} />
        </div>
        <div>
          <label className={fieldLabel}>
            Slug{" "}
            <span className="normal-case tracking-normal text-cream/35">
              (optional — derived from the title if left blank)
            </span>
          </label>
          <input
            name="slug"
            placeholder="e.g. buying-a-first-home-in-ontario"
            className={fieldInput}
          />
        </div>
        <div>
          <label className={fieldLabel}>
            Meta description{" "}
            <span className="normal-case tracking-normal text-cream/35">
              (~140–160 chars)
            </span>
          </label>
          <input name="metaDescription" required className={fieldInput} />
        </div>
        <div>
          <label className={fieldLabel}>Excerpt</label>
          <input name="excerpt" required className={fieldInput} />
        </div>
        <div>
          <label className={fieldLabel}>Body (Markdown)</label>
          <textarea
            name="body"
            required
            rows={18}
            className={`${fieldInput} font-mono text-sm`}
          />
        </div>
        <button type="submit" className={chipPrimary}>
          Create draft
        </button>
      </form>
    </div>
  );
}
