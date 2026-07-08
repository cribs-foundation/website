import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";

import { SectionArt } from "@/components/abstract-art";
import { urlFor } from "@/lib/sanity/image";

// a Sanity image with a graceful abstract fallback. photos are seeded by a
// separate pipeline and may be absent at render time, so when the asset is
// missing we render the brand SectionArt instead of a broken box. any object
// with an asset ref counts as present.
type Motif = "hands" | "hearth" | "path" | "bloom";

function hasAsset(source: unknown): source is SanityImageSource {
  return Boolean(
    source &&
      typeof source === "object" &&
      "asset" in (source as Record<string, unknown>) &&
      (source as { asset?: unknown }).asset,
  );
}

export function SanityImage({
  source,
  alt,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  fallbackMotif = "bloom",
  fallbackTone = "band",
}: {
  source: unknown;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackMotif?: Motif;
  fallbackTone?: "teal" | "paper" | "band";
}) {
  if (!hasAsset(source)) {
    return (
      <SectionArt
        motif={fallbackMotif}
        tone={fallbackTone}
        className={className}
      />
    );
  }

  const url = urlFor(source)
    .width(width)
    .height(height)
    .fit("crop")
    .auto("format")
    .url();

  return (
    <Image
      src={url}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
