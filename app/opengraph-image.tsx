import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// site-wide static social-share card. this is a FALLBACK only: when Sanity's
// seo.ogImage (or a hero photo) is present, app/layout.tsx generateMetadata sets
// openGraph.images / and leaves twitter.card unset, and Next's metadata resolver
// skips this file (mergeStaticMetadata only injects the file-based image when the
// resolved metadata has no openGraph.images of its own). so Sanity always wins;
// this card renders text-only shares when nothing is set.
//
// motif-only by design decision: no logo (it clashes with the palette). brand
// expression = the care-thread + shelter-arc motifs, reusing the exact geometry
// language from components/abstract-art.tsx HeroArt.

export const alt =
  "CRIBS Foundation — Caring for children since 1974. A licensed Philippine child-welfare home.";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

// brand tokens (mirrors app/globals.css). marigold is graphic FILL only, never
// on glyphs; teal is the only interactive color; no pure black; light mode.
const PAPER = "#f7f4ed";
const INK = "#0b2e39";
const INK_70 = "#3a5760";
const TEAL = "#0e6e8c";
const MARIGOLD = "#e9a426";
const MARIGOLD_INK = "#8a5e12"; // AA-safe warm token for marigold-colored text

// right-side motif: concentric shelter arcs (teal, 12-16% opacity) + a
// continuous marigold care-thread with one filled node. geometry ported from
// abstract-art.tsx HeroArt (arcs ~L34-39; thread line + circle node ~L59-68),
// re-anchored to the right of the 1200x630 frame so it never collides with the
// left text column. raw marigold is legal here — it's a fill, never text.
function motifSvg() {
  // arcs centered near the bottom-right of the 560px-wide motif panel, radiating
  // up-and-left so 4 concentric bands read clearly inside the frame (the same
  // "cribs cradle" gesture as HeroArt, just re-anchored). the care-thread drops
  // from the top through the arc center and terminates in a filled node.
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="560" height="630" viewBox="0 0 560 630">
  <g fill="none" stroke="${TEAL}" stroke-width="2.5">
    <circle cx="430" cy="600" r="470" stroke-opacity="0.16"/>
    <circle cx="430" cy="600" r="370" stroke-opacity="0.14"/>
    <circle cx="430" cy="600" r="270" stroke-opacity="0.13"/>
    <circle cx="430" cy="600" r="170" stroke-opacity="0.12"/>
  </g>
  <path d="M430 -40 L430 600" fill="none" stroke="${MARIGOLD}" stroke-width="4"/>
  <circle cx="430" cy="150" r="12" fill="${MARIGOLD}"/>
</svg>`.trim();
}

export default async function Image() {
  const [hanken, mulish, plexMono] = await Promise.all([
    readFile(join(process.cwd(), "app/_og-assets/hanken-800.ttf")),
    readFile(join(process.cwd(), "app/_og-assets/mulish-500.ttf")),
    readFile(join(process.cwd(), "app/_og-assets/plexmono-500.ttf")),
  ]);

  const motif = `data:image/svg+xml;base64,${Buffer.from(motifSvg()).toString(
    "base64",
  )}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: PAPER,
        }}
      >
        {/* right-side motif fill; absolute so text column owns the left weight. */}
        <img
          src={motif}
          width={560}
          height={630}
          style={{ position: "absolute", top: 0, right: 0 }}
        />

        {/* left-weighted text column, 60px safe margins. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px",
            maxWidth: "760px",
          }}
        >
          <div
            style={{
              fontFamily: "Plex Mono",
              fontSize: 26,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: MARIGOLD_INK,
            }}
          >
            Since 1974
          </div>

          <div
            style={{
              fontFamily: "Hanken",
              fontSize: 74,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: INK,
              marginTop: 24,
              maxWidth: "640px",
            }}
          >
            Caring for children in the Philippines.
          </div>

          <div
            style={{
              fontFamily: "Mulish",
              fontSize: 30,
              lineHeight: 1.3,
              color: INK_70,
              marginTop: 24,
            }}
          >
            A licensed Philippine child-welfare home.
          </div>

          {/* marigold underline rule (graphic fill) above the url. */}
          <div
            style={{
              width: 96,
              height: 8,
              borderRadius: 4,
              backgroundColor: MARIGOLD,
              marginTop: 44,
            }}
          />

          <div
            style={{
              fontFamily: "Plex Mono",
              fontSize: 24,
              color: TEAL,
              marginTop: 20,
            }}
          >
            cribsfoundationinc.org
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Hanken", data: hanken, style: "normal", weight: 800 },
        { name: "Mulish", data: mulish, style: "normal", weight: 500 },
        { name: "Plex Mono", data: plexMono, style: "normal", weight: 500 },
      ],
    },
  );
}
