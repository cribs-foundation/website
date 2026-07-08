"use client";

import { Play, X } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

type HeroVideoProps = {
  headline: string | null;
  subtext: string | null;
};

// the 33MB film is served from Vercel Blob (public, non-secret url), so it's
// hardcoded here rather than committed — the mp4 is gitignored.
const VIDEO_SRC =
  "https://bxtbsprj640e3kd9.public.blob.vercel-storage.com/hero.mp4";

// full-bleed poster hero with a click-to-play video takeover. default state is a
// static poster + overlaid light text (no motion on load, so reduced-motion is
// respected inherently). on play the text fades out and the video plays edge-to-
// edge with native controls + audio; the close control pauses and restores text.
export function HeroVideo({ headline, subtext }: HeroVideoProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    setPlaying(true);
    // load-on-demand: preload="none" means the source only fetches here.
    videoRef.current?.play();
  };

  const close = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };

  return (
    <section
      data-dark
      aria-labelledby="hero-heading"
      className="relative min-h-[calc(100dvh-5rem)] overflow-hidden bg-ink"
    >
      {/* poster: the LCP image. edge-to-edge, object-cover. */}
      <Image
        src="/hero-poster.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />

      {/* scrim: weighted left (silhouette is right, sun flare lower-left) so the
         light text passes AA over the dark poster. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
      />

      {/* overlaid text + CTAs — fade out on play. */}
      <div
        className={`relative mx-auto flex min-h-[calc(100dvh-5rem)] max-w-7xl flex-col justify-center px-5 py-16 transition-opacity duration-[400ms] sm:px-8 lg:py-24 ${
          playing ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden={playing}
      >
        <div className="max-w-[46rem]">
          <p className="mb-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-paper/85">
            <span className="h-px w-8 bg-marigold" aria-hidden="true" />
            Since 1974
          </p>
          <h1
            id="hero-heading"
            className="text-display font-display font-extrabold text-paper drop-shadow-[0_2px_12px_rgba(11,46,57,0.45)]"
          >
            {headline ?? (
              <>
                Caring for the Philippines&rsquo; most{" "}
                <span className="text-teal-on-ink">vulnerable children</span>.
              </>
            )}
          </h1>
          <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-paper/85">
            {subtext ??
              "A loving, safe home for abandoned, neglected and surrendered babies, and for young survivors of abuse."}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={play}
              aria-label="Play the CRIBS film"
              className="inline-flex items-center gap-3 rounded-full bg-linen/95 py-2 pl-2 pr-6 text-base font-semibold text-ink shadow-lift transition-colors hover:bg-linen"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal text-linen">
                <Play weight="fill" className="h-5 w-5" aria-hidden="true" />
              </span>
              Watch the film
            </button>
            <Link
              href="/donate"
              className="rounded-full bg-teal px-7 py-3.5 text-base font-semibold text-linen shadow-lift transition-colors hover:bg-harbor"
            >
              Donate
            </Link>
            <Link
              href="/about"
              className="text-base font-semibold text-teal-on-ink underline decoration-1 underline-offset-4 hover:text-paper"
            >
              Our story since 1974
            </Link>
          </div>
        </div>
      </div>

      {/* video takeover — covers the whole hero once playing. controls + audio. */}
      <video
        ref={videoRef}
        poster="/hero-poster.jpg"
        preload="none"
        playsInline
        controls
        className={`absolute inset-0 h-full w-full bg-ink object-cover transition-opacity duration-[400ms] ${
          playing ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* close/exit control — only interactive while playing. */}
      <button
        type="button"
        onClick={close}
        aria-label="Close the film and return to the page"
        className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ink/70 text-linen backdrop-blur transition-opacity duration-[400ms] hover:bg-ink sm:right-6 sm:top-6 ${
          playing ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        tabIndex={playing ? 0 : -1}
      >
        <X weight="bold" className="h-5 w-5" aria-hidden="true" />
      </button>
    </section>
  );
}
