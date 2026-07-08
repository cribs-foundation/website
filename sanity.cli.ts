import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineCliConfig({
  api: { projectId, dataset },
  // embedded studio compiles through next; disable the sanity vite dev server.
  studioHost: "cribs-foundation",
  autoUpdates: true,
});
