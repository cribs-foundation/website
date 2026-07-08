// one-off: upload the hero film to Vercel Blob and print its public url.
// the mp4 is gitignored (33MB); prod serves it from Blob via NEXT_PUBLIC_HERO_VIDEO_URL.
//
// usage:
//   1. create a Blob store in the Vercel dashboard (Storage → Blob), which
//      provisions BLOB_READ_WRITE_TOKEN.
//   2. put the token in env, then run:
//        npm i -D @vercel/blob
//        BLOB_READ_WRITE_TOKEN=... node scripts/upload-hero-to-blob.mjs
//   3. copy the printed url into NEXT_PUBLIC_HERO_VIDEO_URL (.env.local + Vercel env).
import { readFileSync } from "node:fs";
import { put } from "@vercel/blob";

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("set BLOB_READ_WRITE_TOKEN (from your Vercel Blob store) first.");
  process.exit(1);
}

const file = readFileSync(new URL("../public/hero.mp4", import.meta.url));
const blob = await put("hero.mp4", file, {
  access: "public",
  contentType: "video/mp4",
  addRandomSuffix: false,
});

console.log("\nuploaded. set NEXT_PUBLIC_HERO_VIDEO_URL to:\n" + blob.url + "\n");
