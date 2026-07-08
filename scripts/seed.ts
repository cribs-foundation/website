/**
 * seeds real CRIBS Foundation content into the Sanity dataset.
 *
 * usage:  SANITY_API_WRITE_TOKEN=<token> npx tsx scripts/seed.ts
 *
 * idempotent: every doc uses a deterministic _id and createOrReplace, so
 * re-running overwrites rather than duplicating. real photos live in media/ and
 * are uploaded to sanity here; assets are content-addressed by hash so
 * re-uploading the same file returns the same asset id and re-seeding is safe.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "uv1d4fy1";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN. Set it before running the seed:\n" +
      "  SANITY_API_WRITE_TOKEN=<token> npx tsx scripts/seed.ts",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-05-15",
  useCdn: false,
});

// ---- helpers ---------------------------------------------------------------

// build a portable-text block array from plain paragraphs.
function pt(...paragraphs: string[]) {
  return paragraphs.map((text, i) => ({
    _type: "block",
    _key: `b${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i}`, text, marks: [] }],
  }));
}

function keyed<T extends Record<string, unknown>>(items: T[], prefix: string) {
  return items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }));
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// a sanity image reference (plain image field) once its asset is uploaded.
type ImageRef = {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
};

// an altImage member (image + required alt) for arrays/objects that use altImage.
// _type must be "altImage" (not "image") to match the schema's array member type.
type AltImageRef = Omit<ImageRef, "_type"> & {
  _type: "altImage";
  _key?: string;
  alt: string;
};

// uploads a media/ file to sanity and returns an image reference. assets are
// content-addressed by hash, so uploading the same bytes twice yields the same
// asset id — this keeps re-seeds idempotent. we cache within a run so a file
// referenced twice only uploads once.
const assetCache = new Map<string, string>();
async function uploadImage(filename: string): Promise<ImageRef> {
  let assetId = assetCache.get(filename);
  if (!assetId) {
    const buf = readFileSync(join(process.cwd(), "media", filename));
    const asset = await client.assets.upload("image", buf, { filename });
    assetId = asset._id;
    assetCache.set(filename, assetId);
  }
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

// same as uploadImage but stamps alt text (and an optional _key) for altImage.
async function uploadAltImage(
  filename: string,
  alt: string,
  key?: string,
): Promise<AltImageRef> {
  const img = await uploadImage(filename);
  return { ...img, _type: "altImage", ...(key ? { _key: key } : {}), alt };
}

// obra artwork photos live on the original site's wsimg cdn, not in media/. the
// bare path returns the original full-res image. downloaded on demand, then
// uploaded content-addressed exactly like uploadImage, so re-seeds are idempotent.
const OBRA_CDN_BASE =
  "https://img1.wsimg.com/isteam/ip/b9471bcf-c21b-4e5a-9928-21dd1b72fbe4/";
async function uploadCdnImage(filename: string): Promise<ImageRef> {
  const cacheKey = `cdn:${filename}`;
  let assetId = assetCache.get(cacheKey);
  if (!assetId) {
    const res = await fetch(`${OBRA_CDN_BASE}${filename}`);
    if (!res.ok) {
      throw new Error(`CDN fetch failed for ${filename}: ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buf, { filename });
    assetId = asset._id;
    assetCache.set(cacheKey, assetId);
  }
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

async function uploadCdnAltImage(
  filename: string,
  alt: string,
  key?: string,
): Promise<AltImageRef> {
  const img = await uploadCdnImage(filename);
  return { ...img, _type: "altImage", ...(key ? { _key: key } : {}), alt };
}

const TAGLINE =
  "We are a non-profit organization licensed by the Department of Social Welfare and Development (DSWD) providing a loving and safe environment for abandoned, neglected, surrendered babies and female minor survivors of sexual abuse.";

// ---- documents -------------------------------------------------------------

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  orgName: "CRIBS Foundation, Inc.",
  // logo asset is uploaded + attached in run() (see uploadLogo).
  logo: undefined as
    | { _type: string; asset: { _type: string; _ref: string } }
    | undefined,
  tagline: TAGLINE,
  primaryNav: keyed(
    [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Programs", href: "/programs" },
      { label: "Gallery", href: "/gallery" },
      { label: "Events", href: "/events" },
      { label: "Donate", href: "/donate" },
      { label: "Contact", href: "/contact" },
    ],
    "nav",
  ),
  socialLinks: keyed(
    [
      {
        platform: "facebook",
        url: "https://www.facebook.com/CRIBSFoundationInc/",
      },
      {
        platform: "instagram",
        url: "https://www.instagram.com/cribsfoundationinc/",
      },
    ],
    "soc",
  ),
  newsletterHeading: "Be the first to hear about upcoming programs!",
  footerCopyright:
    "Copyright © 2025 CRIBS Foundation, Inc. All Rights Reserved.",
};

const homePage = {
  _id: "homePage",
  _type: "homePage",
  // their original hero vimeo is https://player.vimeo.com/video/1117312865 but
  // it's privacy-locked to cribsfoundationinc.org, so it errors when embedded
  // anywhere else. left empty so the hero uses the reliable photo collage; to
  // enable, CRIBS must allowlist the deploy domain in vimeo, then set this in
  // the studio. the frontend renders the video whenever this is non-empty.
  heroVideoUrl: "",
  heroHeadline: "CRIBS Foundation, Inc.",
  heroSubtext: TAGLINE,
  // hero images uploaded + attached in run() (see mediaAttachments).
  heroImages: [] as AltImageRef[],
  missionHeading: "Our Mission",
  missionBody: pt(
    "CRIBS is committed to the care and development, healing and recovery of children in need of special protection.",
    "CRIBS shall also create opportunities for its staff, donors, and volunteers to become whole and empowered instruments of changing social realities.",
  ),
  visionHeading: "Our Vision",
  visionBody: pt(
    "A safe and loving home and environment for each child free from any form of violence or abuse.",
  ),
  // quote text is seeded here; each quote's image is attached in run() by index.
  quotes: keyed(
    [
      {
        text: "CRIBS gave my child a safe home and a real chance at a loving family.",
        attribution: "Adoptive parent",
      },
      {
        text: "The care and healing these children receive here changes lives every single day.",
        attribution: "New Beginnings social worker",
      },
      {
        text: "Volunteering at CRIBS reminded me how much a little love can do for a child.",
        attribution: "CRIBS volunteer",
      },
      {
        text: "For fifty years CRIBS has stood for the most vulnerable children in the Philippines.",
        attribution: "Long-time partner",
      },
      {
        text: "Every donation becomes food, medicine, schooling and a future for a child in need.",
        attribution: "CRIBS Foundation",
      },
    ],
    "quote",
  ) as Array<{
    _key: string;
    text: string;
    attribution: string;
    image?: AltImageRef;
  }>,
  helpCta: {
    heading: "Help Our Cause",
    body: "Your support and contributions will enable us to meet our goals and improve conditions. Your generous donation will fund our mission.",
    buttonLabel: "Donate Now",
    buttonHref: "/donate",
  },
};

const donationInfo = {
  _id: "donationInfo",
  _type: "donationInfo",
  heading: "Help Our Cause",
  intro: pt(
    "Your generous donation funds the care, healing and recovery of children in need of special protection.",
  ),
  bankAccounts: keyed(
    [
      {
        bankName: "BPI",
        currency: "PHP",
        accountName: "CRIBS Foundation, Inc.",
        accountNumber: "3081-0806-06",
        swift: "BOPIPHMM",
      },
      {
        bankName: "BPI",
        currency: "USD",
        accountName: "CRIBS Foundation, Inc.",
        accountNumber: "3084-0263-86",
        swift: "BOPIPHMM",
      },
      {
        bankName: "BPI",
        currency: "EUR",
        accountName: "CRIBS Foundation, Inc.",
        accountNumber: "3084-0465-22",
        swift: "BOPIPHMM",
      },
    ],
    "bank",
  ),
  // TODO(qrImage): upload QR code image in Studio.
  qrCaption:
    "Scan with any QR Ph-enabled banking app (GCash, Maya, BPI, etc.)",
  taxDeductibilityNote: pt(
    "CRIBS is DSWD-licensed and PCNC-certified. Donations may be tax-deductible under Philippine law.",
  ),
  diasporaNote:
    "Giving from overseas? Use the SWIFT code above for international wires. We're working on card and one-click giving for diaspora donors.",
};

const contactInfo = {
  _id: "contactInfo",
  _type: "contactInfo",
  orgName: "CRIBS Foundation Inc.",
  email: "Cribsfoundation@yahoo.com",
  phones: keyed(
    [
      { label: "Landline", number: "+632 8658 2807" },
      { label: "Mobile", number: "+63 917 511 2742" },
    ],
    "ph",
  ),
  address:
    "C. Lawis Extension, Brgy. San Luis, Antipolo City, Rizal 1870, Philippines",
  officeHours: keyed(
    [
      { day: "Monday", closed: false, opens: "09:00", closes: "17:00" },
      { day: "Tuesday", closed: false, opens: "09:00", closes: "17:00" },
      { day: "Wednesday", closed: false, opens: "09:00", closes: "17:00" },
      { day: "Thursday", closed: false, opens: "09:00", closes: "17:00" },
      { day: "Friday", closed: false, opens: "09:00", closes: "17:00" },
      { day: "Saturday", closed: true },
      { day: "Sunday", closed: true },
    ],
    "oh",
  ),
};

const obraPage = {
  _id: "obraPage",
  _type: "obraPage",
  heading: "Obra Ni Ate Ko",
  intro: pt(
    "An art-based fundraiser in support of CRIBS Foundation. Every piece purchased helps a child heal.",
  ),
};

const impactStats = [
  {
    value: 2067,
    suffix: "children",
    label: "cared for through Receiving Home",
  },
  { value: 730, suffix: "girls", label: "healed through New Beginnings" },
  { value: 50, suffix: "years", label: "serving children since 1974" },
  { value: 1, suffix: "", label: "First foster care NGO in the Philippines" },
].map((s, i) => ({
  _id: `impactStat-${i}`,
  _type: "impactStat",
  order: i,
  ...s,
}));

const historyMilestones = [
  {
    year: 1974,
    title: "The beginning",
    description:
      "American missionary wives brought home two children from the DSWD Reception and Study Center (RSCC), hoping fostering would help them find adoptive families. CRIBS became the first NGO in the Philippines to implement a Foster Care Program. Mrs. Rhoda Bradshaw was instrumental in placing babies with adoptive families.",
  },
  {
    year: 1979,
    title: "Incorporated & Receiving Home launched",
    description:
      "CRIBS was incorporated as a non-profit, non-stock NGO with the SEC and formally launched its first program, Receiving Home. Abandoned, surrendered and neglected infants lived in a rented house in Antipolo, provided with food, clothing, shelter and medical care.",
  },
  {
    year: 1983,
    title: "DSWD-licensed",
    description:
      "CRIBS was officially licensed by the DSWD as a child welfare agency.",
  },
  {
    year: 1986,
    title: "New Beginnings launched",
    description:
      "CRIBS launched New Beginnings to rehabilitate sexually abused young girls from communities in and around the National Capital Region.",
  },
  {
    year: 1988,
    title: "A permanent home",
    description:
      "Clare de Graaf, with support from Bethany Christian Services and a generous donation from Ms. Teresa Chan Sola, purchased a residence in Marikina City large enough to house both programs.",
  },
  {
    year: 1996,
    title: "Programs expanded",
    description:
      "A review of both programs led to a Placement Program, Early Child Care and Development modules, Holistic Care interventions, Special Education classes, and Aftercare.",
  },
  {
    year: 1999,
    title: "New Beginnings building",
    description:
      "The Consuelo Foundation helped CRIBS construct a three-story building on the Marikina property for the New Beginnings girls.",
  },
  {
    year: 2018,
    title: "Back to Antipolo",
    description:
      "Thanks to a substantial donation from Asian Terminals Inc. (ATI) and other donors, CRIBS moved to a purpose-built complex in Antipolo designed for the growing needs of all its children.",
  },
].map((m) => ({
  _id: `historyMilestone-${m.year}`,
  _type: "historyMilestone",
  year: m.year,
  title: m.title,
  description: pt(m.description),
  order: m.year,
}));

type ProgramSeed = {
  title: string;
  category: string;
  ageRange?: string;
  capacity?: number;
  summary: string;
  forms?: string[];
};

const programSeeds: ProgramSeed[] = [
  {
    title: "New Beginnings Program",
    category: "residential",
    ageRange: "7-17",
    summary:
      "A safe and nurturing home for female victim-survivors of sexual abuse aged 7 to 17. Provides healing and recovery: medical and dental care, psycho-social, educational, socio-cultural, sports, moral-spiritual and family support services, plus legal assistance. The goal is reintegration with family, alternative parental care, or independent living.",
  },
  {
    title: "Receiving Home Program",
    category: "residential",
    ageRange: "0-4",
    capacity: 25,
    summary:
      "An alternative home for abandoned, surrendered, neglected and dependent children and foundlings aged 0 to 4. Accommodates 25 children at a time. CRIBS provides Holistic Health Care and Development.",
  },
  {
    title: "Volunteer and Resource Program",
    category: "volunteer",
    summary:
      "A dynamic, integral part of the programs, responding to children's needs as they arise.",
    forms: [
      "Child Protection Policy",
      "General Policy for Volunteers",
      "New Beginnings Program Guidelines",
      "Receiving Home Program Guidelines",
      "Volunteer Application Form",
      "Foster Care Application Form",
    ],
  },
  {
    title: "Community Advocacy and Prevention",
    category: "advocacy",
    summary:
      "CRIBS shares its expertise with partner communities to promote the rights of women and children, prevent abuse and violence, and promote foster care.",
  },
  {
    title: "Placement Services",
    category: "placement",
    summary:
      "Focuses on permanent placement of each Receiving Home child through Family Reunification, Kinship Care, Foster Care or Permanent Adoption.",
    forms: [
      "Foster Care Application Form",
      "Checklist of Requirements",
      "Guide Questions for Home Study Report",
    ],
  },
  {
    title: "Post-Residential Care Services",
    category: "aftercare",
    summary:
      "Cares for New Beginnings girls who have completed the program: After Care, Independent Living, Family Welfare Services and Educational Assistance.",
  },
];

const programs = programSeeds.map((p, i) => ({
  _id: `program-${slugify(p.title)}`,
  _type: "program",
  title: p.title,
  slug: { _type: "slug", current: slugify(p.title) },
  category: p.category,
  summary: p.summary,
  ageRange: p.ageRange,
  capacity: p.capacity,
  order: i,
  // TODO(file): upload the actual PDF for each form in Studio.
  downloadableForms: p.forms
    ? keyed(
        p.forms.map((label) => ({ label })),
        "form",
      )
    : undefined,
}));

const accreditationSeeds = [
  "First foster care NGO in the Philippines (since 1974)",
  "DSWD-licensed child welfare agency since 1983",
  "SEC-registered non-profit (1979)",
  "PCNC-certified",
];

const accreditations = accreditationSeeds.map((name, i) => ({
  _id: `accreditation-${i}`,
  _type: "accreditation",
  name,
  order: i,
  // TODO(seal): upload accreditation seal images in Studio.
}));

const partnersByCategory: Record<string, string[]> = {
  adoptive_families: ["Adoptive Families from Australia"],
  corporate: [
    "Arch Global Services, Inc.",
    "Asian Terminals, Inc.",
    "Belmont Agricorp Inc.",
    "Calabuena Resort Corporation",
    "Danam Philippines, Inc.",
    "Global Payments",
    "Taminda Holdings Limited",
    "Vega Entertainment Productions",
    "Wyntron, Inc.",
    "Canva for Nonprofits",
    "GCash for Good",
    "Isla LPG Corporation",
    "Lenovo",
    "NutriAsia",
    "ShopeePay",
    "DM Consunji, Inc.",
    "First Hu Ma Dev't. Inc.",
    "HBO+EMTB Philippines, Inc.",
    "Jose Aliling Construction Management, Inc.",
    "DKP Mfg Inc.",
  ],
  foundation: [
    "Consuelo Foundation",
    "International Bazaar Foundation, Inc.",
    "La Fondation Juniclair (Peter Garrucho)",
    "Phinma Foundation Inc.",
    "Ramon Aboitiz Foundation Inc.",
    "SGV Foundation, Inc.",
    "Telstra Foundation",
    "Wise Foundation",
    "American Women's Club of the Philippines",
  ],
  civic_volunteer: [
    "Hands On Manila",
    "iVolunteer",
    "Smile Manila",
    "Tugon Ateneo",
  ],
  government_ngo: [
    "Jose Fabella Memorial School",
    "The Medical City",
    "City Government of Antipolo",
    "Association of Child Caring Agencies of the Philippines",
    "Department of Social Welfare & Development",
    "National Council for Social Development",
    "ABSNET Rizal Chapter",
  ],
};

const partners = Object.entries(partnersByCategory).flatMap(
  ([category, names]) =>
    names.map((name, i) => ({
      _id: `partner-${category}-${slugify(name)}`,
      _type: "partner",
      name,
      category,
      order: i,
      // TODO(logo): upload partner logos in Studio.
    })),
);

const galleryAlbums = ["Gallery of Smiles", "Little Angels", "Volunteers"].map(
  (title, i) => ({
    _id: `galleryAlbum-${slugify(title)}`,
    _type: "galleryAlbum",
    title,
    slug: { _type: "slug", current: slugify(title) },
    order: i,
    // TODO(images): upload album images in Studio.
  }),
);

// obra ni ate ko categories. artwork photos (from the wsimg cdn) are downloaded
// and attached to each category's images[] in run() — see obraCatalog + attachMedia.
const obraCategorySeeds: { key: string; name: string }[] = [
  { key: "madonna_and_child", name: "Madonna & Child" },
  { key: "interpretative", name: "Interpretative" },
  { key: "landscape", name: "Landscape" },
  { key: "seascape", name: "Seascape" },
  { key: "cubism", name: "Cubism" },
];

const obraCategories = obraCategorySeeds.map((c, i) => ({
  _id: `obraCategory-${c.key}`,
  _type: "obraCategory",
  name: c.name,
  slug: { _type: "slug", current: slugify(c.name) },
  order: i + 1,
  // images attached in run() (see attachMedia).
}));

// the Obra event, surfaced in the Events listing but linking to its dedicated
// /obra-ni-ate-ko catalog page rather than /events/[slug].
const obraEvent = {
  _id: "event-obra-ni-ate-ko",
  _type: "event",
  title: "Obra Ni Ate Ko",
  slug: { _type: "slug", current: "obra-ni-ate-ko" },
  linkMode: "internal",
  internalPath: "/obra-ni-ate-ko",
  featured: true,
  order: 1,
  summary:
    "An art-based fundraiser exhibit and catalog of donated artworks. Every piece purchased supports the recovery and independent-living journey of CRIBS' children.",
  // coverImage attached in run() (see attachMedia).
};

// ---- run -------------------------------------------------------------------

const documents = [
  siteSettings,
  homePage,
  donationInfo,
  contactInfo,
  obraPage,
  ...impactStats,
  ...historyMilestones,
  ...programs,
  ...accreditations,
  ...partners,
  ...galleryAlbums,
  ...obraCategories,
  obraEvent,
];

// upload the official badge mark (vector-traced from their logo) and return an
// image reference. sanity content-addresses assets by hash, so re-uploading the
// same file returns the same asset id — this stays idempotent across re-seeds.
async function uploadLogo() {
  const buf = readFileSync(join(process.cwd(), "public", "cribs-mark.png"));
  const asset = await client.assets.upload("image", buf, {
    filename: "cribs-mark.png",
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

// hero image files with the alt text each should carry.
const heroImageSeeds: { file: string; alt: string }[] = [
  { file: "kids1.png", alt: "CRIBS children smiling together" },
  { file: "kids2.png", alt: "Children in CRIBS Foundation care" },
  { file: "kids4.png", alt: "Young children at the CRIBS home" },
  { file: "house sunrise.jpg", alt: "The CRIBS Foundation home at sunrise" },
  { file: "volunteers1.png", alt: "CRIBS volunteers with the children" },
];

// quote image files, one per quote in homePage.quotes (attached by index).
const quoteImageFiles = [
  "Quote1.png",
  "Quote2.png",
  "Quote3.png",
  "Quote4.png",
  "Quote5.png",
];

// program image files indexed by program order (0..5).
const programImageFiles = [
  "PSimg1.png",
  "PSimg2.png",
  "PSimg3.png",
  "PSimg4.png",
  "PSimg5.png",
  "PSimg6.png",
];

// gallery album images keyed by album slug, each with alt text.
// grouping verified against the live original site (cribsfoundationinc.org/gallery)
// by dom y-position: little angels = every smile* photo (smile3 never existed on
// the cdn, so it's skipped); volunteers = a separate v1..v10 set. note v7.png is
// byte-identical to volunteers1.png (an existing hero image), so its content-
// addressed asset dedupes to the same upload.
const albumImageSeeds: Record<string, { file: string; alt: string }[]> = {
  "little-angels": [1, 2, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
    file: `smile${n}.png`,
    alt: "A CRIBS child smiling",
  })),
  volunteers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
    file: `v${n}.png`,
    alt: "CRIBS volunteers with the children",
  })),
};

// history milestone images keyed by year (earliest two milestones).
const milestoneImageFiles: Record<number, string> = {
  1974: "oldpic1.png",
  1979: "oldpic2.png",
};

// obra category display labels for alt text.
const obraCategoryNames: Record<string, string> = Object.fromEntries(
  obraCategorySeeds.map((c) => [c.key, c.name]),
);

// obra artwork photo filenames keyed by category, pulled from the wsimg cdn.
// these are untitled donated pieces, so alt text is generic + category-aware.
const obraCatalog: Record<string, string[]> = {
  madonna_and_child: [
    "IMG_1844.JPG", "IMG_1845.JPG", "IMG_1921.jpg", "IMG_1880.JPG", "IMG_1922.jpg",
    "IMG_1908.jpg", "IMG_1891.jpg", "IMG_1876.JPG", "IMG_1838.JPG", "IMG_1898.jpg",
    "IMG_1907.jpg", "IMG_1895.jpg", "IMG_1893.JPG", "IMG_1906.jpg", "IMG_1896.jpg",
    "IMG_1890.jpg", "IMG_1840.JPG", "IMG_1843.JPG", "IMG_1889.JPG", "IMG_1839.JPG",
  ],
  interpretative: [
    "IMG_1873.JPG", "IMG_1902.jpg", "IMG_1920.jpg", "IMG_1863.JPG", "IMG_1864.JPG",
    "IMG_1835.JPG", "IMG_1919.jpg", "IMG_1885.JPG", "IMG_1862.JPG", "IMG_1884.JPG",
    "IMG_1969.jpg", "IMG_1904.jpg", "IMG_1859.JPG", "IMG_1888.jpg", "IMG_1872.JPG",
    "IMG_1870.JPG", "IMG_1905.jpg", "IMG_1874.JPG", "IMG_1944.JPG", "IMG_1913.jpg",
    "IMG_1899.jpg",
  ],
  landscape: [
    "IMG_1942.jpg", "IMG_1967.JPG", "IMG_1951.jpg", "IMG_1933.jpg", "IMG_1936.jpg",
    "IMG_1941.jpg", "IMG_1943.jpg",
  ],
  seascape: [
    "IMG_1950.JPG", "IMG_1952.JPG", "IMG_1938.jpg", "IMG_1931.jpg", "IMG_1929.jpg",
    "IMG_1934.jpg", "IMG_1932.jpg", "IMG_1953.JPG", "IMG_1958.JPG", "IMG_1963.JPG",
    "IMG_1937.jpg", "IMG_1956.JPG", "IMG_1935.jpg", "IMG_1930.jpg", "IMG_1965.JPG",
    "IMG_1966.JPG", "IMG_1962.JPG", "IMG_1955.JPG", "IMG_1949.JPG", "IMG_1954.JPG",
    "IMG_1948.jpg",
  ],
  cubism: [
    "IMG_1865.JPG", "IMG_1856.JPG", "IMG_1910.jpg", "IMG_1878.JPG", "IMG_1847.JPG",
    "IMG_1924.jpg", "IMG_1881.JPG", "IMG_1882.JPG", "IMG_1918.JPG", "IMG_1879.JPG",
    "IMG_1850.JPG", "IMG_1926.jpg", "IMG_1911.jpg", "IMG_1928.jpg", "IMG_1858.JPG",
    "IMG_1927.jpg", "IMG_1834.JPG", "IMG_1912.jpg", "IMG_1832.jpg", "IMG_1923.jpg",
    "IMG_1901.jpg",
  ],
};

// uploads every media/ photo and attaches it onto the seed objects in place, so
// the single transaction below writes docs with their assets already set.
async function attachMedia() {
  // hero images
  homePage.heroImages = [];
  for (let i = 0; i < heroImageSeeds.length; i++) {
    const { file, alt } = heroImageSeeds[i];
    homePage.heroImages.push(await uploadAltImage(file, alt, `hero${i}`));
  }

  // quote images by index
  for (let i = 0; i < homePage.quotes.length; i++) {
    const file = quoteImageFiles[i];
    if (file)
      homePage.quotes[i].image = await uploadAltImage(
        file,
        `Portrait accompanying quote from ${homePage.quotes[i].attribution}`,
      );
  }

  // program images by order
  for (const program of programs) {
    const file = programImageFiles[program.order];
    if (file)
      (program as { image?: ImageRef }).image = await uploadImage(file);
  }

  // gallery album images by slug
  for (const album of galleryAlbums) {
    const seeds = albumImageSeeds[album.slug.current];
    if (!seeds) continue;
    const images: AltImageRef[] = [];
    for (let i = 0; i < seeds.length; i++) {
      images.push(
        await uploadAltImage(seeds[i].file, seeds[i].alt, `img${i}`),
      );
    }
    (album as { images?: AltImageRef[] }).images = images;
  }

  // milestone images by year
  for (const milestone of historyMilestones) {
    const file = milestoneImageFiles[milestone.year];
    if (file)
      (milestone as { image?: ImageRef }).image = await uploadImage(file);
  }

  // obra category artwork photos, downloaded from the wsimg cdn by category.
  for (const category of obraCategories) {
    const key = category._id.replace("obraCategory-", "");
    const files = obraCatalog[key] ?? [];
    const label = obraCategoryNames[key] ?? category.name;
    const images: AltImageRef[] = [];
    for (let i = 0; i < files.length; i++) {
      images.push(
        await uploadCdnAltImage(
          files[i],
          `Artwork from the ${label} collection, Obra ni Ate Ko`,
          `img${i}`,
        ),
      );
    }
    (category as { images?: AltImageRef[] }).images = images;
  }

  // obra event cover
  (obraEvent as { coverImage?: ImageRef }).coverImage =
    await uploadCdnImage("obraniateko.png");

  // donation qr code
  (donationInfo as { qrImage?: ImageRef }).qrImage =
    await uploadImage("qrcode.png");
}

async function run() {
  console.log(
    `Seeding ${documents.length} documents to ${projectId}/${dataset}…`,
  );
  console.log("Uploading logo…");
  siteSettings.logo = await uploadLogo();
  console.log("Uploading + attaching media photos…");
  await attachMedia();
  // remove docs of retired types so re-seeds converge (artwork → obraCategory).
  const deleted = await client.delete({ query: '*[_type == "artwork"]' });
  if (deleted.results.length) {
    console.log(`Deleted ${deleted.results.length} retired artwork docs.`);
  }
  let tx = client.transaction();
  for (const doc of documents) {
    // strip undefined fields so we don't write empty keys.
    const clean = JSON.parse(JSON.stringify(doc));
    tx = tx.createOrReplace(clean);
  }
  const result = await tx.commit();
  console.log(`Done. ${result.results.length} documents written.`);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
