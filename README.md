# CRIBS Foundation — demo site

Self-editable marketing site for **CRIBS Foundation, Inc.** (DSWD-licensed Philippine child-welfare NGO, est. 1974), built to pitch a replacement for their locked GoDaddy Website Builder. Everything on the public site is editable by non-technical staff through an embedded Sanity Studio — no code, no developer.

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **CMS:** Sanity (embedded Studio at `/studio`) — project `uv1d4fy1`, dataset `production`
- **Deploy target:** single Vercel project (site + Studio together)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000  (Studio at /studio)
```

## Content

The whole site is modeled in Sanity and seeded from the real CRIBS content (`scripts/seed.ts`, idempotent). Seeding needs a write token that `tsx` does **not** auto-load from `.env.local`:

```bash
export $(grep '^SANITY_API_WRITE_TOKEN' .env.local | xargs) && npm run seed
```

Every content type has a **"+ New"** button in the Studio, so staff can add programs, gallery photos, milestones, artworks, etc. without limit.

## Deploy domain

> **Placeholder in use.** `SITE_URL` / `metadataBase` in `app/layout.tsx` is a placeholder
> (`https://cribsfoundation.org`). Their **current live domain is `cribsfoundationinc.org`**.
> Before shipping, set this to the real production domain (custom domain or the Vercel URL) so
> Open Graph / canonical / social-share URLs resolve correctly. Also add the deployed URL to the
> Sanity project's CORS origins so `/studio` OAuth works in production.

## Deploy checklist (when ready)

1. Set `SITE_URL` in `app/layout.tsx` to the real domain (see above).
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and the write token as Vercel env vars.
3. Add the deployed URL to Sanity → API → CORS origins (for Studio auth).
4. Deploy to Vercel.

## Handoff notes

- **Photos** are reused from the current CRIBS site. Staff can swap any image in the Studio.
- **Hero video.** Their original hero is a Vimeo clip (`player.vimeo.com/video/1117312865`) that is **privacy-locked to `cribsfoundationinc.org`**, so it errors when embedded on any other domain. The home hero therefore uses the photo collage by default. To use the video: allowlist the deploy domain in Vimeo's privacy settings, then set `Home Page → heroVideoUrl` in the Studio (the hero renders the video whenever that field is non-empty).
- **Forms** (contact + newsletter) are front-end demos only — they don't yet send or persist. Wire a real transport (email/CRM/Sanity doc) before launch.
