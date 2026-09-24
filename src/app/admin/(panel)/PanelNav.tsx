"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chipIdle, chipOn } from "./ui";

/**
 * Admin navigation as a horizontally scrollable chip row on the page itself
 * (no site header). Section chips switch Blog / Account / Reviews; View site
 * and Sign out sit on the same scroller so mobile never needs a hamburger.
 */
const SECTIONS = [
  {
    href: "/admin",
    label: "Blog",
    match: (p: string) =>
      p.startsWith("/admin") &&
      !p.startsWith("/admin/reviews") &&
      !p.startsWith("/admin/account"),
  },
  {
    href: "/admin/account",
    label: "Account",
    match: (p: string) => p.startsWith("/admin/account"),
  },
  {
    href: "/admin/reviews",
    id: "reviews",
    label: "Reviews",
    match: (p: string) =>
      p === "/admin/reviews" || p.startsWith("/admin/reviews/"),
  },
] as const;

function chipClass(active: boolean) {
  return `snap-start ${active ? chipOn : chipIdle}`;
}

export function PanelNav({
  unansweredReviews = 0,
}: {
  unansweredReviews?: number;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin"
      className="-mx-6 mb-8 overflow-x-auto px-6 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex w-max snap-x snap-mandatory items-center gap-2">
        {SECTIONS.map((s) => {
          const active = s.match(pathname);
          const showCount =
            "id" in s && s.id === "reviews" && unansweredReviews > 0;
          return (
            <li key={s.href} className="flex">
              <Link
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={chipClass(active)}
              >
                {s.label}
                {showCount && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      active ? "bg-ink/20 text-ink" : "bg-gold/20 text-gold-bright"
                    }`}
                    aria-label={`${unansweredReviews} unanswered ${
                      unansweredReviews === 1 ? "review" : "reviews"
                    }`}
                  >
                    {unansweredReviews}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
        <li className="flex">
          <Link href="/" className={chipClass(false)}>
            View site
          </Link>
        </li>
        <li className="flex">
          <form method="post" action="/api/admin/logout" className="flex">
            <button type="submit" className={chipClass(false)}>
              Sign out
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
