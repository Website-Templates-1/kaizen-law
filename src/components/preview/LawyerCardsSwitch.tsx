"use client";

import { LawyerCards } from "@/components/sections/LawyerCards";
import { usePreviewMode } from "@/components/preview/PreviewMode";
import { lawyers, type Lawyer } from "@/lib/site.config";

/**
 * Home-page "meet the team" grid. Photo mode uses the standard LawyerCards
 * (portrait on top); text-only mode uses cards with no image slot at all —
 * an initials mark, the lawyer's summary line, and their details.
 */
export function LawyerCardsSwitch() {
  const mode = usePreviewMode();

  if (mode === "text") {
    return (
      <div className="team-grid team-grid--text">
        {lawyers.map((lawyer) => (
          <TextCard key={lawyer.name} lawyer={lawyer} />
        ))}
      </div>
    );
  }

  return <LawyerCards />;
}

function TextCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <article className="person person--text">
      <span className="person-mark" aria-hidden="true">
        {lawyer.monogram}
      </span>
      <p className="person-role">{lawyer.role}</p>
      <h3>{lawyer.name}</h3>
      <p className="person-summary">{lawyer.summary}</p>
      <dl>
        <div>
          <dt>Languages</dt>
          <dd>{lawyer.languages.join(", ")}</dd>
        </div>
      </dl>
    </article>
  );
}
