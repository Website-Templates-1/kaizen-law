import { Portrait } from "@/components/media/Portrait";
import { lawyers, type Lawyer } from "@/lib/site.config";

function Card({ lawyer }: { lawyer: Lawyer }) {
  return (
    <article className="person">
      <Portrait
        monogram={lawyer.monogram}
        photo={lawyer.photo}
        photoReady={lawyer.photoReady}
        alt={`${lawyer.name}, ${lawyer.role} of Kaizen Law`}
        aspect={0.86}
        sizes="(min-width: 700px) 40vw, 90vw"
      />
      <p className="person-role">{lawyer.role}</p>
      <h3>{lawyer.name}</h3>
      <dl>
        <div>
          <dt>Languages</dt>
          <dd>{lawyer.languages.join(", ")}</dd>
        </div>
      </dl>
    </article>
  );
}

export function LawyerCards() {
  return (
    <div className="team-grid">
      {lawyers.map((lawyer) => (
        <Card key={lawyer.name} lawyer={lawyer} />
      ))}
    </div>
  );
}
