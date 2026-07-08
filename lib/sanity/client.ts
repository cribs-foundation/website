import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // api directly for server-rendered reads; flip to true for client-side reads.
  useCdn: false,
});
