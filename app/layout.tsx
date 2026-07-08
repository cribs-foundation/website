import type { Metadata } from "next";
import { Hanken_Grotesk, Mulish, IBM_Plex_Mono } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { resolveNav } from "@/lib/nav";
import {
  getContactInfo,
  getHomePage,
  getSiteSettings,
  resolveLogoUrl,
  resolveOgImageUrl,
} from "@/lib/sanity/chrome";

import "./globals.css";

// display / body / mono, exposed as css variables consumed by @theme.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

// spec-mandated fallbacks; siteSettings.seo is authoritative when present.
const FALLBACK_TITLE =
  "CRIBS Foundation, Inc. | Caring for children since 1974";
const FALLBACK_DESCRIPTION =
  "A DSWD-licensed, PCNC-certified Philippine child-welfare NGO. For 50 years CRIBS has given abandoned, neglected, and surrendered babies and young survivors of abuse a safe and loving home.";
const SITE_URL = "https://cribsfoundationinc.org";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, home] = await Promise.all([getSiteSettings(), getHomePage()]);
  const seo = settings?.seo ?? null;

  const title = seo?.metaTitle || FALLBACK_TITLE;
  const description = seo?.metaDescription || FALLBACK_DESCRIPTION;
  const ogImage = resolveOgImageUrl(settings, home) ?? undefined;

  const orgName = settings?.orgName || "CRIBS Foundation, Inc.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      // interior routes set a bare title; the layout appends the org name.
      template: `%s | ${orgName}`,
    },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: settings?.orgName || "CRIBS Foundation, Inc.",
      locale: "en_PH",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      // when Sanity has an image, force the large card. when it doesn't, leave
      // `card` UNSET so Next's metadata resolver auto-selects summary_large_image
      // once the file-based app/opengraph-image.tsx card supplies a twitter image
      // (hardcoding "summary" here would keep a small card under the large image).
      ...(ogImage ? { card: "summary_large_image" as const } : {}),
      title,
      description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, contact] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
  ]);

  const orgName = settings?.orgName ?? "CRIBS Foundation, Inc.";
  const logoUrl = resolveLogoUrl(settings);
  const nav = resolveNav(settings?.primaryNav);

  return (
    <html
      lang="en"
      className={`${hanken.variable} ${mulish.variable} ${plexMono.variable}`}
    >
      <body>
        <SiteHeader orgName={orgName} nav={nav} logoUrl={logoUrl} />
        {children}
        <SiteFooter
          settings={settings}
          contact={contact}
          orgName={orgName}
          logoUrl={logoUrl}
        />
      </body>
    </html>
  );
}
