import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Kaizen Law — Clear counsel. Steady direction.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#151513";
const GOLD = "#d6b66c";

/** Branded 1200×630 social card: ink ground, gold line motif, wordmark + tagline. */
export default async function OpengraphImage() {
  const wordmark = await readFile(
    join(process.cwd(), "public/brand/logo-on-dark-wordmark.png"),
  );
  const wordmarkSrc = `data:image/png;base64,${wordmark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: INK,
          position: "relative",
        }}
      >
        {/* Gold diagonal line motif (two strokes forming an X) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.16,
            backgroundImage: `linear-gradient(125deg, transparent 48%, ${GOLD} 49%, transparent 50%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.16,
            backgroundImage: `linear-gradient(35deg, transparent 48%, ${GOLD} 49%, transparent 50%)`,
          }}
        />

        <img src={wordmarkSrc} width={640} alt="" style={{ position: "relative" }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            marginTop: 44,
            position: "relative",
          }}
        >
          <div style={{ width: 40, height: 1, background: GOLD }} />
          <div
            style={{
              color: GOLD,
              fontSize: 30,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Clear counsel. Steady direction.
          </div>
          <div style={{ width: 40, height: 1, background: GOLD }} />
        </div>
      </div>
    ),
    size,
  );
}
