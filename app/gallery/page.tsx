import type { Metadata } from "next";

import { Reveal } from "@/components/reveal";
import { SanityImage } from "@/components/sanity-image";
import { sanityFetch } from "@/lib/sanity/fetch";
import { GALLERY_ALBUMS_QUERY } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Gallery of Smiles",
  description:
    "Everyday joy at CRIBS Foundation: the Little Angels in our care and the volunteers who make fifty years of care possible.",
};

const FALLBACK_MOTIFS = ["hands", "bloom", "hearth", "path"] as const;

export default async function GalleryPage() {
  const albums = await sanityFetch({ query: GALLERY_ALBUMS_QUERY });

  // photo-led opening: lead with the first album image (falls back to brand
  // art via SanityImage when no photo is uploaded yet).
  const leadImage = albums
    .flatMap((a) => a.images ?? [])
    .find((img) => img?.asset);

  return (
    <>
      <section
        aria-labelledby="gallery-heading"
        className="relative overflow-hidden border-b border-ink/8 bg-harbor"
      >
        <div className="absolute inset-0">
          <SanityImage
            source={leadImage ?? null}
            alt=""
            width={1600}
            height={900}
            priority
            sizes="100vw"
            fallbackMotif="hands"
            fallbackTone="teal"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-harbor via-harbor/70 to-harbor/20"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto flex min-h-[52vh] max-w-7xl flex-col justify-end px-5 py-16 sm:px-8 lg:min-h-[62vh] lg:py-20">
          <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-linen/80">
            <span className="h-px w-8 bg-marigold" aria-hidden="true" />
            Gallery of smiles
          </p>
          <h1
            id="gallery-heading"
            className="max-w-[20ch] text-display font-display font-extrabold text-linen"
          >
            The faces behind fifty years of care.
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-linen/85">
            A window into daily life at CRIBS: the Little Angels in our Receiving
            Home and the volunteers who help them grow.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        {albums.length === 0 ? (
          <p className="text-ink-50">Photo albums are being published soon.</p>
        ) : (
          <div className="space-y-20">
            {albums.map((album) => {
              const images = (album.images ?? []).filter((img) => img?.asset);
              return (
                <section
                  key={album._id}
                  aria-labelledby={`album-${album._id}`}
                >
                  <Reveal className="mb-8">
                    <h2
                      id={`album-${album._id}`}
                      className="text-h2 font-display font-bold text-ink"
                    >
                      {album.title}
                    </h2>
                    {album.description && (
                      <p className="mt-2 max-w-[60ch] text-lg leading-relaxed text-ink-70">
                        {album.description}
                      </p>
                    )}
                  </Reveal>

                  {images.length === 0 ? (
                    // graceful placeholder grid until photos land.
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square overflow-hidden rounded-xl"
                        >
                          <SanityImage
                            source={null}
                            alt=""
                            width={400}
                            height={400}
                            fallbackMotif={
                              FALLBACK_MOTIFS[i % FALLBACK_MOTIFS.length]
                            }
                            fallbackTone={i % 2 === 0 ? "band" : "paper"}
                            className="h-full w-full"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {images.map((img, i) => (
                        <Reveal
                          as="li"
                          key={img._key}
                          delayMs={(i % 4) * 60}
                          className="aspect-square overflow-hidden rounded-xl bg-band shadow-card"
                        >
                          <SanityImage
                            source={img}
                            alt={img.alt ?? album.title ?? ""}
                            width={500}
                            height={500}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </Reveal>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
