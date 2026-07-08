// brand-colored abstract treatments used as a graceful fallback for image
// slots whose photos have not been uploaded yet (photos are seeded, but some
// assets may still be missing). safeguarding also forbids children's faces, so
// these read as an intentional design choice, not a gap. all decorative.

// hero panel: layered "home / hearth / dawn" motif over a teal→paper wash.
export function HeroArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 700"
      className={className}
      role="img"
      aria-label="Abstract illustration of a home sheltering a rising dawn"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="hero-wash" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#0e6e8c" />
          <stop offset="1" stopColor="#0a4e63" />
        </linearGradient>
        <linearGradient id="hero-dawn" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e9a426" stopOpacity="0.95" />
          <stop offset="1" stopColor="#f7f4ed" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="hero-sun" cx="0.5" cy="0.62" r="0.5">
          <stop offset="0" stopColor="#f7f4ed" />
          <stop offset="0.6" stopColor="#e9a426" stopOpacity="0.85" />
          <stop offset="1" stopColor="#e9a426" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="600" height="700" fill="url(#hero-wash)" />

      {/* concentric shelter arcs: the "cribs" cradle. */}
      <g fill="none" stroke="#f7f4ed" strokeOpacity="0.16" strokeWidth="1.5">
        <path d="M300 620 A250 250 0 0 1 550 620" />
        <path d="M300 620 A190 190 0 0 1 490 620" />
        <path d="M300 620 A130 130 0 0 1 430 620" />
      </g>

      {/* rising dawn glow inside the home. */}
      <circle cx="300" cy="470" r="150" fill="url(#hero-sun)" />

      {/* the home / hearth roofline. */}
      <path
        d="M150 470 L300 300 L450 470"
        fill="none"
        stroke="#f7f4ed"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M150 470 L300 300 L450 470 L450 620 L150 620 Z"
        fill="url(#hero-dawn)"
        fillOpacity="0.5"
      />

      {/* the care thread enters from the roof apex, a marigold node above. */}
      <line
        x1="300"
        y1="0"
        x2="300"
        y2="300"
        stroke="#e9a426"
        strokeWidth="3"
      />
      <circle cx="300" cy="120" r="9" fill="#e9a426" />
    </svg>
  );
}

// generic section art keyed to a small motif set, tinted per surface.
type Motif = "hands" | "hearth" | "path" | "bloom";

const MOTIFS: Record<Motif, string> = {
  // two arcs cradling a small circle: sheltering hands.
  hands:
    "M40 150 Q90 90 140 130 M260 150 Q210 90 160 130",
  // roofline over a doorway.
  hearth: "M60 170 L150 80 L240 170 M120 170 L120 120 L180 120 L180 170",
  // a winding path toward a node: the journey home.
  path: "M40 180 C110 140 90 90 160 70 S250 40 260 30",
  // opening petals: recovery / bloom.
  bloom:
    "M150 150 Q150 90 190 70 M150 150 Q150 90 110 70 M150 150 Q210 110 230 150 M150 150 Q90 110 70 150",
};

// placeholder for the donation QR image until a real one is uploaded: a
// teal/marigold grid that reads as "a QR goes here", not a broken box.
export function AbstractDonateQR({ className = "" }: { className?: string }) {
  const cells = [
    [1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 1],
    [0, 1, 0, 1, 1, 0, 0],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];
  return (
    <svg
      viewBox="0 0 70 70"
      className={className}
      role="img"
      aria-label="Placeholder QR code. A real QR code will be added soon."
    >
      <rect width="70" height="70" fill="#f7f4ed" />
      {cells.flatMap((row, y) =>
        row.map((on, x) =>
          on ? (
            <rect
              key={`${x}-${y}`}
              x={x * 10}
              y={y * 10}
              width="10"
              height="10"
              fill={
                (x < 3 && y < 3) || (x > 3 && y < 3) || (x < 3 && y > 3)
                  ? "#0e6e8c"
                  : "#0a4e63"
              }
            />
          ) : null,
        ),
      )}
      <circle cx="35" cy="35" r="6" fill="#e9a426" />
    </svg>
  );
}

// Variant B — care-thread weave. one thin continuous marigold line meandering
// sparsely (large empty spaces) with a few small filled marigold nodes, echoing
// HeroArt's care thread + SectionArt's "path" motif. decorative background for
// ONE light band. line at marigold 7%, nodes 10% — legal raw marigold since it's
// a graphic fill that never touches text. absolutely positioned by the caller
// (pointer-events-none, aria-hidden); content sits above it and stays legible.
export function CareThreadWeave({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 600"
      className={className}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* the single meandering care thread. sparse, with wide empty gaps. */}
      <path
        d="M-40 150 C 160 60 240 260 420 210 S 620 40 820 150 S 1080 320 1260 210"
        fill="none"
        stroke="#e9a426"
        strokeOpacity="0.07"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* a few small filled marigold nodes along the thread. */}
      <g fill="#e9a426" fillOpacity="0.1">
        <circle cx="420" cy="210" r="5" />
        <circle cx="820" cy="150" r="4" />
        <circle cx="1080" cy="268" r="3.5" />
      </g>
    </svg>
  );
}

// Variant C — shelter-arc field (dark). concentric "cribs cradle" arcs from
// HeroArt, scaled large and faint, rising from the bottom edge: sunrise behind a
// home. strokes in paper at 8% on the dark ground (mirrors HeroArt's ~0.16 but
// lower), with one marigold node at 12% as the sunrise point (graphic fill,
// legal). decorative background for dark CTA blocks / footer. absolutely
// positioned by the caller (pointer-events-none, aria-hidden); overlaid
// white / teal-on-ink text keeps AA — arcs stay clear of text baselines.
export function ShelterArcField({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 400"
      className={className}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* concentric shelter arcs rising from the bottom edge. */}
      <g
        fill="none"
        stroke="#f7f4ed"
        strokeOpacity="0.08"
        strokeWidth="1.5"
      >
        <path d="M600 400 A360 360 0 0 1 960 400" />
        <path d="M600 400 A280 280 0 0 1 880 400" />
        <path d="M600 400 A200 200 0 0 1 800 400" />
        <path d="M600 400 A120 120 0 0 1 720 400" />
      </g>
      {/* the sunrise point. */}
      <circle cx="600" cy="400" r="6" fill="#e9a426" fillOpacity="0.12" />
    </svg>
  );
}

export function SectionArt({
  motif = "hearth",
  tone = "teal",
  className = "",
}: {
  motif?: Motif;
  tone?: "teal" | "paper" | "band";
  className?: string;
}) {
  const bg =
    tone === "teal"
      ? "#0e6e8c"
      : tone === "band"
        ? "#efebe1"
        : "#f7f4ed";
  const stroke = tone === "teal" ? "#f7f4ed" : "#0e6e8c";

  return (
    <svg
      viewBox="0 0 300 220"
      className={className}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="300" height="220" fill={bg} />
      <g
        fill="none"
        stroke={stroke}
        strokeOpacity={tone === "teal" ? 0.55 : 0.35}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={MOTIFS[motif]} />
      </g>
      <circle
        cx="150"
        cy="150"
        r="6"
        fill="#e9a426"
        opacity={tone === "teal" ? 0.9 : 0.7}
      />
    </svg>
  );
}
