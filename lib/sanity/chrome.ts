import { cache } from "react";

import { sanityFetch } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import {
  CONTACT_INFO_QUERY,
  EVENTS_QUERY,
  HOME_PAGE_QUERY,
  OBRA_CATEGORIES_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/lib/sanity/queries";

// site-wide chrome data (settings + contact), memoized per request so the
// layout, page bodies, and generateMetadata share one fetch each.
export const getSiteSettings = cache(() =>
  sanityFetch({ query: SITE_SETTINGS_QUERY }),
);

export const getContactInfo = cache(() =>
  sanityFetch({ query: CONTACT_INFO_QUERY }),
);

export const getHomePage = cache(() =>
  sanityFetch({ query: HOME_PAGE_QUERY }),
);

export const getEvents = cache(() =>
  sanityFetch({ query: EVENTS_QUERY }),
);

export const getObraCategories = cache(() =>
  sanityFetch({ query: OBRA_CATEGORIES_QUERY }),
);

// resolves the social-share image: editable seo.ogImage wins; otherwise fall
// back to a real hero photo. prefers the face-free house/building shot for a
// public link preview, else the first hero image, else null (text-only card).
export function resolveOgImageUrl(
  settings: Awaited<ReturnType<typeof getSiteSettings>>,
  home: Awaited<ReturnType<typeof getHomePage>>,
): string | null {
  // guard on asset: an editor can add a hero row with alt but no upload, which
  // would otherwise produce an asset-less (broken) cdn url in <head>.
  const hasAsset = (i?: { asset?: unknown } | null) => Boolean(i?.asset);
  const source =
    (hasAsset(settings?.seo?.ogImage) ? settings?.seo?.ogImage : null) ??
    home?.heroImages?.find(
      (img) => hasAsset(img) && /house|home|sunrise|building/i.test(img?.alt ?? ""),
    ) ??
    home?.heroImages?.find(hasAsset) ??
    null;
  return source
    ? urlFor(source).width(1200).height(630).fit("crop").url()
    : null;
}

// resolves the editable CMS logo to a fixed-size url, or null for the bundled
// vector fallback used by the header/footer.
export function resolveLogoUrl(
  settings: Awaited<ReturnType<typeof getSiteSettings>>,
): string | null {
  return settings?.logo
    ? urlFor(settings.logo).width(120).height(120).fit("max").url()
    : null;
}
