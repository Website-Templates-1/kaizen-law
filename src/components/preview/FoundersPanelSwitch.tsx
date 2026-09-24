"use client";

import { Portrait } from "@/components/media/Portrait";
import { usePreviewMode } from "@/components/preview/PreviewMode";
import { glance } from "@/lib/site.config";

/**
 * The founders-photo slot, shown on the home "about" band and the People page.
 * In photo mode it renders the normal Portrait; in text-only mode it renders a
 * typographic firm panel that fills the same space with meaning instead of a
 * blank frame.
 */
export function FoundersPanelSwitch(props: {
  monogram: string;
  photo: string;
  photoReady: boolean;
  alt: string;
  caption?: string;
  aspect?: number | string;
  sizes?: string;
}) {
  const mode = usePreviewMode();

  if (mode === "text") {
    return <FirmCredentialPanel aspect={props.aspect} />;
  }

  return <Portrait {...props} />;
}

function FirmCredentialPanel({ aspect }: { aspect?: number | string }) {
  const style = aspect ? { aspectRatio: String(aspect) } : undefined;

  return (
    <div className="firm-panel" style={style} role="img" aria-label="Kaizen Law">
      <span className="firm-panel-glow" aria-hidden="true" />
      <div className="firm-panel-inner">
        <p className="firm-panel-kanji" aria-hidden="true">
          改善
        </p>
        <p className="firm-panel-word">Kaizen</p>
        <span className="firm-panel-rule" aria-hidden="true" />
        <p className="firm-panel-meaning">
          Continuous improvement. The standard we hold every file to.
        </p>
        <dl className="firm-panel-stats">
          {glance.map((stat) => (
            <div className="firm-stat" key={stat.label}>
              <dt className="firm-stat-label">{stat.label}</dt>
              <dd className="firm-stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
