import Link from "next/link";

import { HeroArt, SectionArt } from "@/components/abstract-art";
import { NewsletterForm } from "@/components/newsletter-form";
import { PortableText } from "@/components/portable-text";
import { PortableTextPlain } from "@/components/portable-text-plain";
import { Reveal } from "@/components/reveal";
import { SanityImage } from "@/components/sanity-image";
import { StatCounter } from "@/components/stat-counter";
import { getContactInfo, getSiteSettings } from "@/lib/sanity/chrome";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  ACCREDITATIONS_QUERY,
  HOME_PAGE_QUERY,
  IMPACT_STATS_QUERY,
} from "@/lib/sanity/queries";

const SITE_URL = "https://cribsfoundation.org";

// overview teasers that link out to the deep routes.
const TEASERS = [
  {
    href: "/about",
    title: "Transforming lives",
    body: "The first foster-care NGO in the Philippines, an unbroken line of care from 1974 to today.",
    motif: "path" as const,
    tone: "teal" as const,
  },
  {
    href: "/programs",
    title: "A continuous circle of care",
    body: "From the Receiving Home for infants to New Beginnings for survivors: holistic healing at every age.",
    motif: "hearth" as const,
    tone: "band" as const,
  },
  {
    href: "/gallery",
    title: "The faces of our work",
    body: "Little Angels and volunteers, the everyday joy behind fifty years of care.",
    motif: "hands" as const,
    tone: "paper" as const,
  },
  {
    href: "/obra-ni-ate-ko",
    title: "Art that funds healing",
    body: "A catalog of paintings whose sale supports the recovery of the young women of New Beginnings.",
    motif: "bloom" as const,
    tone: "band" as const,
  },
];

export default async function Home() {
  const [settings, home, stats, accreditations, contact] = await Promise.all([
    getSiteSettings(),
    sanityFetch({ query: HOME_PAGE_QUERY }),
    sanityFetch({ query: IMPACT_STATS_QUERY }),
    sanityFetch({ query: ACCREDITATIONS_QUERY }),
    getContactInfo(),
  ]);

  const orgName = settings?.orgName ?? "CRIBS Foundation, Inc.";

  // trust bar: three headline peer credentials, keyed to the accreditation
  // records so the detail line stays sourced from the CMS.
  const findAccred = (needle: string) =>
    accreditations.find((a) => a.name?.toLowerCase().includes(needle))?.name;
  const trustCredentials = [
    {
      k: "Since 1974",
      v:
        findAccred("first foster") ??
        "First foster-care NGO in the Philippines",
    },
    {
      k: "DSWD-licensed",
      v: findAccred("dswd") ?? "Child welfare agency since 1983",
    },
    {
      k: "PCNC-certified",
      v:
        findAccred("sec-registered") ??
        findAccred("pcnc") ??
        "SEC-registered non-profit (1979)",
    },
  ];

  // impact stats: the "First foster-care NGO" entry (value 1, no suffix) is a
  // text tile, not a tally. everything else is a mono counter.
  const counterStats = stats.filter((s) => (s.suffix ?? "").trim().length > 0);
  const factStat = stats.find((s) => (s.suffix ?? "").trim().length === 0);

  const quotes = (home?.quotes ?? []).filter((q) => q.text);

  // organization / NGO structured data for SEO + AI answer surfaces.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: orgName,
    alternateName: "CRIBS",
    url: SITE_URL,
    foundingDate: "1974",
    description:
      settings?.tagline ??
      "A DSWD-licensed Philippine child-welfare NGO caring for vulnerable children since 1974.",
    ...(contact?.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: contact.address,
            addressCountry: "PH",
          },
        }
      : {}),
    ...(contact?.email ? { email: contact.email } : {}),
    ...(contact?.phones?.length
      ? { telephone: contact.phones[0].number ?? undefined }
      : {}),
    ...(() => {
      const urls = (settings?.socialLinks ?? [])
        .map((s) => s.url)
        .filter((u): u is string => Boolean(u));
      return urls.length ? { sameAs: urls } : {};
    })(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main id="top">
        {/* ---------- HERO ---------- */}
        <section
          aria-labelledby="hero-heading"
          className="relative overflow-hidden"
        >
          <div className="mx-auto grid max-w-7xl items-stretch gap-0 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex min-h-[calc(100dvh-5rem)] flex-col justify-center py-16 pr-0 lg:py-24 lg:pr-12">
              <p className="mb-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-teal">
                <span className="h-px w-8 bg-marigold" aria-hidden="true" />
                Since 1974
              </p>
              <h1
                id="hero-heading"
                className="text-display font-display font-extrabold text-ink"
              >
                {home?.heroHeadline ? (
                  home.heroHeadline
                ) : (
                  <>
                    Caring for the Philippines&rsquo; most{" "}
                    <span className="text-teal">vulnerable children</span>.
                  </>
                )}
              </h1>
              <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-ink-70">
                {home?.heroSubtext ??
                  "A loving, safe home for abandoned, neglected and surrendered babies, and for young survivors of abuse."}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/donate"
                  className="rounded-full bg-teal px-7 py-3.5 text-base font-semibold text-linen shadow-lift transition-colors hover:bg-harbor"
                >
                  Donate
                </Link>
                <Link
                  href="/about"
                  className="text-base font-semibold text-teal underline decoration-1 underline-offset-4 hover:text-harbor"
                >
                  Our story since 1974
                </Link>
              </div>

              <p className="mt-8 font-mono text-xs uppercase tracking-wider text-ink-50">
                50 years of care{" "}
                <span className="text-marigold-ink">·</span> DSWD-licensed since
                1983
              </p>
            </div>

            {/* hero media: seeded Vimeo video, else the photo collage, else art.
               video is not autoplayed (viewer presses play), so reduced-motion
               is respected without a client boundary. */}
            {home?.heroVideoUrl ? (
              <div className="flex min-h-[42vh] items-center py-8 lg:min-h-full lg:py-16 lg:pl-4">
                <div className="w-full overflow-hidden rounded-2xl bg-harbor shadow-lift ring-1 ring-ink/10">
                  <div className="aspect-video">
                    <iframe
                      src={`${home.heroVideoUrl}?title=0&byline=0&portrait=0`}
                      title="CRIBS Foundation: fifty years of caring for vulnerable children"
                      loading="lazy"
                      allow="fullscreen; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative -mx-5 min-h-[42vh] overflow-hidden sm:-mx-8 lg:mx-0 lg:min-h-full">
                {home?.heroImages?.[0]?.asset ? (
                  <SanityImage
                    source={home.heroImages[0]}
                    alt={home.heroImages[0].alt ?? ""}
                    width={900}
                    height={1100}
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <HeroArt className="absolute inset-0 h-full w-full" />
                )}
              </div>
            )}
          </div>
        </section>

        {/* ---------- TRUST BAR ---------- */}
        <section aria-label="Credentials" className="border-y border-ink/8 bg-band">
          <ul className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-ink/8 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
            {trustCredentials.map((c) => (
              <li key={c.k} className="px-2 py-6 text-center sm:py-7">
                <div className="font-mono text-sm font-medium uppercase tracking-widest text-teal">
                  {c.k}
                </div>
                <div className="mt-1 text-sm text-ink-70">{c.v}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- IMPACT STATS ---------- */}
        <section
          aria-labelledby="impact-heading"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
        >
          <Reveal>
            <h2
              id="impact-heading"
              className="max-w-[18ch] text-h2 font-display font-bold text-ink"
            >
              A half-century of children kept safe.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {counterStats.map((s, i) => (
              <Reveal key={s._id} delayMs={i * 80}>
                <StatCounter
                  value={s.value ?? 0}
                  label={s.label ?? ""}
                  suffix={s.suffix}
                />
              </Reveal>
            ))}

            {factStat && (
              <Reveal
                delayMs={counterStats.length * 80}
                className="flex flex-col justify-center rounded-2xl bg-teal p-8 text-linen shadow-card"
              >
                <div className="font-mono text-5xl font-medium">1st</div>
                <p className="mt-3 max-w-[24ch] text-lg font-semibold leading-snug">
                  {factStat.label}
                </p>
              </Reveal>
            )}
          </div>
        </section>

        {/* ---------- MISSION & VISION ---------- */}
        <section
          aria-labelledby="mission-heading"
          className="border-y border-ink/8 bg-linen"
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
            <Reveal>
              <h2
                id="mission-heading"
                className="mb-5 text-h2 font-display font-bold text-ink"
              >
                {home?.missionHeading ??
                  "Care, healing and recovery for children in need of special protection."}
              </h2>
              <PortableText value={home?.missionBody} />
            </Reveal>

            <Reveal delayMs={120} className="lg:pt-2">
              <div className="rounded-2xl border border-ink/8 bg-paper p-8 shadow-card">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-marigold-ink">
                  {home?.visionHeading ?? "Our vision"}
                </p>
                <div className="mt-4 font-display text-2xl font-bold leading-snug text-ink">
                  <PortableTextPlain value={home?.visionBody} />
                </div>
                <Link
                  href="/about"
                  className="mt-6 inline-block font-semibold text-teal underline decoration-1 underline-offset-4 hover:text-harbor"
                >
                  Read our full history
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- EXPLORE TEASERS (link out to deep pages) ---------- */}
        <section
          aria-labelledby="explore-heading"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
        >
          <Reveal>
            <h2
              id="explore-heading"
              className="max-w-[22ch] text-h2 font-display font-bold text-ink"
            >
              Explore fifty years of care.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {TEASERS.map((t, i) => (
              <Reveal key={t.href} delayMs={(i % 2) * 80}>
                <Link
                  href={t.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-linen shadow-card transition-shadow hover:shadow-lift"
                >
                  <div className="h-40 overflow-hidden">
                    <SectionArt
                      motif={t.motif}
                      tone={t.tone}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-display text-xl font-bold text-ink">
                      {t.title}
                    </h3>
                    <p className="mt-3 flex-1 text-base leading-relaxed text-ink-70">
                      {t.body}
                    </p>
                    <span className="mt-5 font-semibold text-teal underline decoration-1 underline-offset-4 group-hover:text-harbor">
                      Learn more
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- QUOTES ---------- */}
        {quotes.length > 0 && (
          <section
            aria-label="Voices"
            className="border-y border-ink/8 bg-linen"
          >
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {quotes.slice(0, 3).map((q, i) => (
                  <Reveal key={q._key} delayMs={(i % 3) * 80}>
                    <figure className="flex h-full flex-col rounded-2xl border border-ink/8 bg-paper p-7 shadow-card">
                      <blockquote className="flex-1 border-l-2 border-marigold pl-4 text-lg italic leading-relaxed text-ink">
                        {q.text}
                      </blockquote>
                      {q.attribution && (
                        <figcaption className="mt-4 font-mono text-xs uppercase tracking-widest text-ink-50">
                          {q.attribution}
                        </figcaption>
                      )}
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------- DONATE CTA (links to /donate) ---------- */}
        <section
          aria-labelledby="donate-cta-heading"
          className="bg-harbor text-linen"
        >
          <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 lg:py-24">
            <h2
              id="donate-cta-heading"
              className="text-h2 font-display font-bold"
            >
              Your gift becomes a safe place to grow up.
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-lg leading-relaxed text-linen/90">
              A single donation gives an abandoned baby a crib, a meal, and a
              chance. Give by bank transfer or QR Ph in a few minutes.
            </p>
            <Link
              href="/donate"
              className="mt-8 inline-block rounded-full bg-linen px-8 py-3.5 text-base font-semibold text-harbor shadow-lift transition-colors hover:bg-band"
            >
              Ways to give
            </Link>
          </div>
        </section>

        {/* ---------- NEWSLETTER ---------- */}
        <section
          aria-labelledby="newsletter-heading"
          className="bg-teal text-linen"
        >
          <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 lg:py-20">
            <h2
              id="newsletter-heading"
              className="text-h2 font-display font-bold"
            >
              {settings?.newsletterHeading ??
                "Be the first to hear about upcoming programs."}
            </h2>
            <p className="mx-auto mt-3 max-w-[48ch] text-linen/85">
              Occasional updates on our children, programs, and ways to help. No
              spam, ever.
            </p>
            <div className="mx-auto mt-8 max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
