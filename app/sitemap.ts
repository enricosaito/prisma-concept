import type { MetadataRoute } from "next"

import { getLatestLetter, getPublishedLetters } from "@/lib/letters/source"
import { absoluteUrl } from "@/lib/seo"

/**
 * Built from the same filtered list the pages read, so a draft cannot appear
 * here even by accident — and the file has no second copy of the route table
 * to keep in sync.
 *
 * The four legacy paths in next.config.ts (/carta, /biblioteca and their
 * slugs) are deliberately absent: a sitemap lists canonical URLs, and listing
 * a 308 invites a crawler to spend its budget on redirects.
 *
 * /cartas e /assinar também saíram: as páginas não existem mais, e os 307
 * que cobrem seus endereços são redirects, que um sitemap não lista.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const letters = getPublishedLetters()
  const latest = getLatestLetter()

  return [
    {
      url: absoluteUrl("/"),
      // The home page changes when a letter does, not on its own.
      lastModified: latest ? (latest.updated ?? latest.date) : undefined,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...letters.map((letter) => ({
      url: absoluteUrl(`/cartas/${letter.slug}`),
      lastModified: letter.updated ?? letter.date,
      // A letter is finished when it goes out. It is revised rarely, and when
      // it is, `updated` says so.
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ]
}
