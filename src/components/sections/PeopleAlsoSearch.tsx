import Link from "next/link";

export interface RelatedSearch {
  label: string;
  href: string;
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

/**
 * "People also search for" — a chip cloud of related internal links, styled like
 * a search-engine related-searches strip. Strengthens internal linking and
 * keyword coverage. All links are root-relative.
 */
export function PeopleAlsoSearch({
  items,
  title = "People also search for",
}: {
  items: RelatedSearch[];
  title?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h2 className="flex items-center gap-2 eyebrow text-muted">
        <SearchIcon className="h-4 w-4 text-gold" />
        {title}
      </h2>
      <ul className="mt-6 flex flex-wrap gap-3">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              className="inline-flex items-center gap-2 rounded-[9px] border border-line bg-cream px-4 py-2.5 text-sm text-ink transition-colors hover:border-gold hover:text-gold"
            >
              <SearchIcon className="h-3.5 w-3.5 text-muted" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
