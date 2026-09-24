import Image from "next/image";

/**
 * Premium portrait frame. Renders a real photograph when `photoReady` is true,
 * otherwise a styled monogram placeholder (gold inner frame + caption) so the
 * layout looks intentional until the client's photos are dropped in.
 *
 * To go live for a person: add the file at their `photo` path in
 * `site.config.ts` and flip `photoReady` to true — no markup changes needed.
 */
export function Portrait({
  monogram,
  photo,
  photoReady,
  alt,
  caption = "Portrait coming soon",
  className = "",
  aspect,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority = false,
}: {
  monogram: string;
  photo: string;
  photoReady: boolean;
  alt: string;
  caption?: string;
  className?: string;
  /** CSS aspect-ratio, e.g. 0.86 or "4 / 5". Omit to inherit from the class. */
  aspect?: number | string;
  sizes?: string;
  priority?: boolean;
}) {
  const style = aspect ? { aspectRatio: String(aspect) } : undefined;

  if (photoReady) {
    return (
      <div className={`portrait ${className}`} style={style}>
        <Image src={photo} alt={alt} fill sizes={sizes} priority={priority} />
      </div>
    );
  }

  return (
    <div
      className={`portrait portrait--placeholder ${className}`}
      style={style}
      data-caption={caption}
      role="img"
      aria-label={alt}
    >
      <span className="portrait-mono" aria-hidden="true">
        {monogram}
      </span>
    </div>
  );
}
