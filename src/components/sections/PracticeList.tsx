import Image from "next/image";
import Link from "next/link";
import { practices } from "@/lib/site.config";

export function PracticeList({ variant = "rows" }: { variant?: "rows" | "grid" }) {
  if (variant === "grid") {
    return (
      <ul className="grid gap-10 sm:grid-cols-2">
        {practices.map((practice) => (
          <li key={practice.slug}>
            <Link href={`/practice/${practice.slug}`} className="group block">
              <div className="media-frame relative aspect-[4/3]">
                <Image
                  src={practice.image}
                  alt={practice.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 36rem, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <p className="eyebrow mt-5" style={{ color: "var(--gold)" }}>
                {practice.number}
              </p>
              <h2 className="serif mt-2 text-[1.75rem] text-ink group-hover:text-gold">
                {practice.title}
              </h2>
              <p className="mt-3 max-w-md leading-relaxed text-muted">
                {practice.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="practice-list">
      {practices.map((practice) => (
        <Link
          key={practice.slug}
          href={`/practice/${practice.slug}`}
          className="practice-item"
        >
          <span className="practice-number">{practice.number}</span>
          <h3>{practice.title}</h3>
          <p>{practice.summary}</p>
          <span className="item-line" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
