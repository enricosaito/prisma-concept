import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/lib/seo"
import { site } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The only route under /api is the subscribe handler, which is POST-only
      // and has nothing to index.
      disallow: ["/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    // Names the canonical host, so the apex that 308s here is not treated as a
    // second site with the same content.
    host: site.url,
  }
}
