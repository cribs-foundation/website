import type { QueryParams } from "next-sanity";

import { client } from "./client";

// server-component fetch helper for the App Router. wraps client.fetch with
// next.js isr caching + tag support. types are inferred from `defineQuery`
// (overloadClientMethods is on), so results are fully typed at call sites.
//
// upgrade path: when a SANITY_API_READ_TOKEN is available and live preview is
// wanted, swap this for `defineLive` from next-sanity/live (see nextjs rule).
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}) {
  return client.fetch(query, params, {
    next: {
      // tag-based invalidation wins over time-based when tags are present.
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}
