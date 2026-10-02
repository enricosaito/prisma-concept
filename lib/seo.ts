import type { LetterMeta } from "@/lib/letters/types"
import { site } from "@/lib/site"

/**
 * Structured data, built from the content model.
 *
 * Hand-typed objects rather than `schema-dts`: three literals do not justify a
 * type-only package, and the shapes below are each about a dozen fields that
 * Google's own documentation spells out.
 *
 * Nothing here duplicates a string that lives somewhere else — every value
 * comes from `LetterMeta` or `lib/site.ts`, so a letter's description cannot
 * drift between the meta tag and the JSON-LD.
 */

/** Absolute URL for a site-relative path. Schema.org wants absolutes. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString()
}

/**
 * The publication is the author.
 *
 * PRISMA is deliberately anonymous — there is no personal byline anywhere on
 * the site, and inventing one here would be a factual claim the publication
 * does not make. An Organization author is the honest shape for that. It does
 * not contradict the promise that a human writes the letters; it simply does
 * not name them.
 */
const publisher = {
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: {
    "@type": "ImageObject",
    // The PNG rather than the SVG beside it: Google's logo guidance wants a
    // raster at least 112px on a side, and SVG support in rich results has
    // never been reliable.
    url: absoluteUrl("/brand/prisma-wordmark.png"),
    width: 1200,
    height: 630,
  },
}

export function letterJsonLd(letter: LetterMeta) {
  const url = absoluteUrl(`/cartas/${letter.slug}`)

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: letter.title,
    description: letter.seoDescription ?? letter.dek,
    ...(letter.cover ? { image: [absoluteUrl(letter.cover.src)] } : {}),
    datePublished: letter.date,
    dateModified: letter.updated ?? letter.date,
    author: publisher,
    publisher,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "pt-BR",
    articleSection: letter.category,
    isAccessibleForFree: true,
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: site.signature,
    description: site.description,
    url: site.url,
    inLanguage: "pt-BR",
    publisher,
  }
}

/**
 * JSON-LD goes in a <script type="application/ld+json">, which means the JSON
 * is parsed as HTML first: an unescaped "</script>" inside any string would end
 * the tag early. The sequence cannot occur in a letter's own fields today, but
 * the escape costs nothing and the failure mode is a broken page.
 */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
