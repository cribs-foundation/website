import { defineQuery } from "next-sanity";

// singletons are fetched by their fixed _id for efficiency.

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    orgName,
    logo,
    tagline,
    primaryNav[]{ _key, label, href },
    socialLinks[]{ _key, platform, url },
    newsletterHeading,
    footerCopyright,
    seo{ metaTitle, metaDescription, ogImage }
  }
`);

export const HOME_PAGE_QUERY = defineQuery(`
  *[_id == "homePage"][0]{
    heroVideoUrl,
    heroHeadline,
    heroSubtext,
    heroImages[]{ _key, ..., alt },
    missionHeading,
    missionBody,
    visionHeading,
    visionBody,
    quotes[]{ _key, text, attribution, image },
    helpCta{ heading, body, buttonLabel, buttonHref }
  }
`);

export const DONATION_INFO_QUERY = defineQuery(`
  *[_id == "donationInfo"][0]{
    heading,
    intro,
    bankAccounts[]{ _key, bankName, currency, accountName, accountNumber, swift },
    qrImage,
    qrCaption,
    gcashInfo,
    taxDeductibilityNote,
    diasporaNote
  }
`);

export const CONTACT_INFO_QUERY = defineQuery(`
  *[_id == "contactInfo"][0]{
    orgName,
    email,
    phones[]{ _key, label, number },
    address,
    geo,
    mapLink,
    officeHours[]{ _key, day, closed, opens, closes }
  }
`);

export const OBRA_PAGE_QUERY = defineQuery(`
  *[_id == "obraPage"][0]{
    heading,
    intro
  }
`);

// collections, ordered for display.

export const PROGRAMS_QUERY = defineQuery(`
  *[_type == "program"] | order(order asc, title asc){
    _id,
    title,
    "slug": slug.current,
    category,
    summary,
    body,
    ageRange,
    capacity,
    downloadableForms[]{ _key, label, file },
    image,
    order
  }
`);

export const PROGRAM_BY_SLUG_QUERY = defineQuery(`
  *[_type == "program" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    category,
    summary,
    body,
    ageRange,
    capacity,
    downloadableForms[]{ _key, label, file{ ..., asset-> { url, originalFilename, mimeType, size } } },
    image
  }
`);

export const PROGRAM_SLUGS_QUERY = defineQuery(`
  *[_type == "program" && defined(slug.current)]{ "slug": slug.current }
`);

export const HISTORY_MILESTONES_QUERY = defineQuery(`
  *[_type == "historyMilestone"] | order(coalesce(order, year) asc){
    _id,
    year,
    title,
    description,
    image,
    order
  }
`);

export const IMPACT_STATS_QUERY = defineQuery(`
  *[_type == "impactStat"] | order(order asc){
    _id,
    label,
    value,
    suffix,
    description,
    order
  }
`);

// partners grouped by category, each group ordered.
export const PARTNERS_QUERY = defineQuery(`
  *[_type == "partner"] | order(category asc, order asc, name asc){
    _id,
    name,
    logo,
    category,
    url,
    order
  }
`);

export const ACCREDITATIONS_QUERY = defineQuery(`
  *[_type == "accreditation"] | order(order asc){
    _id,
    name,
    seal,
    detail,
    validUntil,
    order
  }
`);

// events power the "Events" listing. an event links either to an external URL
// (linkMode "external") or to a page on this site — /events/[slug] by default,
// or `internalPath` when set (e.g. Obra links to /obra-ni-ate-ko).
export const EVENTS_QUERY = defineQuery(`
  *[_type == "event"] | order(featured desc, order asc, date desc){
    _id,
    title,
    "slug": slug.current,
    date,
    location,
    coverImage,
    summary,
    linkMode,
    externalUrl,
    internalPath,
    featured
  }
`);

export const EVENT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "event" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    date,
    location,
    coverImage,
    summary,
    body,
    linkMode,
    externalUrl,
    internalPath,
    featured
  }
`);

// obra ni ate ko fundraiser gallery, grouped by category.
export const OBRA_CATEGORIES_QUERY = defineQuery(`
  *[_type == "obraCategory"] | order(order asc){
    _id,
    name,
    "slug": slug.current,
    order,
    images[]{ _key, ..., alt }
  }
`);

export const GALLERY_ALBUMS_QUERY = defineQuery(`
  *[_type == "galleryAlbum"] | order(order asc, title asc){
    _id,
    title,
    "slug": slug.current,
    description,
    images[]{ _key, ..., alt },
    order
  }
`);
