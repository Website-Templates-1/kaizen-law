import { glance } from "@/lib/site.config";

/**
 * The firm panel shown on the home "about" band and the People page, in place
 * of a founders photograph. The firm has chosen a text-only presentation, so a
 * typographic panel fills the space with meaning instead of a blank frame.
 *
 * The photo-related props are retained so the call sites can stay declarative
 * about where a portrait would otherwise sit.
 */
export function FoundersPanelSwitch(props: {
  monogram?: string;
  photo?: string;
  photoReady?: boolean;
  alt?: string;
  caption?: string;
  aspect?: number | string;
  sizes?: string;
}) {
  const style = props.aspect ? { aspectRatio: String(props.aspect) } : undefined;

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
