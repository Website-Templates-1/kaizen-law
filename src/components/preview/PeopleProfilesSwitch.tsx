"use client";

import { Portrait } from "@/components/media/Portrait";
import { usePreviewMode } from "@/components/preview/PreviewMode";
import { lawyers } from "@/lib/site.config";

/**
 * The lawyer profiles on the People page. Photo mode keeps the two-column
 * portrait/bio layout; text-only mode drops the portrait column entirely and
 * reflows to a single-column editorial layout led by a large initial, so there
 * is no empty image frame.
 */
export function PeopleProfilesSwitch() {
  const mode = usePreviewMode();

  if (mode === "text") {
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

            <dl className="mt-8 border-t border-line pt-8">
              <div>
                <dt className="eyebrow text-gold">Languages</dt>
                <dd className="mt-3 text-ink">{lawyer.languages.join(", ")}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-20 sm:space-y-28">
      {lawyers.map((lawyer, i) => (
        <article
          key={lawyer.name}
          className="grid items-start gap-10 border-t border-line pt-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
        >
          <div className={i % 2 === 1 ? "lg:order-2" : ""}>
            <Portrait
              monogram={lawyer.monogram}
              photo={lawyer.photo}
              photoReady={lawyer.photoReady}
              alt={`${lawyer.name}, ${lawyer.role} of Kaizen Law`}
              aspect="4 / 5"
              sizes="(min-width: 1024px) 34vw, 90vw"
            />
          </div>

          <div className={i % 2 === 1 ? "lg:order-1" : ""}>
            <p className="text-[11px] uppercase tracking-[0.16em] text-gold">
              {lawyer.role}
            </p>
            <h3 className="display mt-3 text-[2rem] text-ink sm:text-[2.5rem]">
              {lawyer.name}
            </h3>
            <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-muted">
              {lawyer.bio.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>

            <dl className="mt-8 border-t border-line pt-8">
              <div>
                <dt className="eyebrow text-gold">Languages</dt>
                <dd className="mt-3 text-ink">{lawyer.languages.join(", ")}</dd>
              </div>
            </dl>
          </div>
        </article>
      ))}
    </div>
  );
}
