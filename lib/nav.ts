import type { NavLink } from "@/components/site-header";

// canonical multi-page IA. the seeded siteSettings.primaryNav hrefs are real
// routes ("/", "/about", …); we keep this constant as the source of truth for
// the chrome so a mis-seeded nav can never break navigation. labels prefer the
// CMS when present (see resolveNav), routes are fixed here.
export const SITE_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" },
];

// merge CMS labels onto the canonical routes when the seeded nav uses matching
// route hrefs; otherwise fall back to SITE_NAV as-is.
export function resolveNav(
  primaryNav: Array<{ label?: string | null; href?: string | null }> | null | undefined,
): NavLink[] {
  if (!primaryNav?.length) return SITE_NAV;
  return SITE_NAV.map((item) => {
    const cms = primaryNav.find((n) => n.href === item.href);
    return cms?.label ? { label: cms.label, href: item.href } : item;
  });
}
