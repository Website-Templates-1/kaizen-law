import { lawyers, type Lawyer } from "@/lib/site.config";

/**
 * Home-page "meet the team" grid. The firm has chosen a text-only presentation,
 * so each card renders an initials mark, the lawyer's summary line, and role —
 * with no image slot.
 */
export function LawyerCardsSwitch() {
  return (
    <div className="team-grid team-grid--text">
      {lawyers.map((lawyer) => (
        <TextCard key={lawyer.name} lawyer={lawyer} />
      ))}
    </div>
  );
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
    </article>
  );
}
