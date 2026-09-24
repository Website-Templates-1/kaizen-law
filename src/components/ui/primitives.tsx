import Link from "next/link";
import type { Crumb } from "@/lib/jsonld";

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function SectionIndex({
  n,
  label,
  on = "cream",
}: {
  n: string;
  label: string;
  on?: "cream" | "ink";
}) {
  return (
    <div className={`section-label${on === "ink" ? " gold" : ""}`}>
      <span>{n}</span>
      <span>{label}</span>
    </div>
  );
}

export function GoldButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="button button-gold">
      {children}
      <span aria-hidden="true">+</span>
    </Link>
  );
}

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-link">
      {children}
      <span aria-hidden="true">+</span>
    </Link>
  );
}

export function Crumbs({
  items,
  on = "ink",
}: {
  items: Crumb[];
  on?: "ink" | "cream";
}) {
  const cream = on === "cream";
  return (
    <nav aria-label="Breadcrumb" className={`eyebrow ${cream ? "text-muted" : "text-cream/60"}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className="text-gold">
                  /
                </span>
              )}
              {last ? (
                <span className={cream ? "text-ink" : "text-cream/90"}>{item.name}</span>
              ) : (
                <Link href={item.path} className={cream ? "hover:text-ink" : "hover:text-cream"}>
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
