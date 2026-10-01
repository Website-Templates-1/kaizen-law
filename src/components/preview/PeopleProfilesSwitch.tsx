import { lawyers } from "@/lib/site.config";

/**
 * The lawyer profiles on the People page. The firm has chosen a text-only
 * presentation: a single-column editorial layout led by a large initial, with
 * no portrait frame.
 */
export function PeopleProfilesSwitch() {
  return (
    <div className="space-y-20 sm:space-y-28">
      {lawyers.map((lawyer) => (
        <article
          key={lawyer.name}
          className="profile-text border-t border-line pt-16"
        >
          <div className="profile-text-head">
            <span className="profile-text-initial" aria-hidden="true">
              {lawyer.monogram}
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold">
                {lawyer.role}
              </p>
              <h3 className="display mt-3 text-[2rem] text-ink sm:text-[2.5rem]">
                {lawyer.name}
              </h3>
            </div>
          </div>

          <div className="mt-8 max-w-2xl space-y-4 text-lg leading-relaxed text-muted">
            {lawyer.bio.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
