import type { Metadata } from "next"

import { notFound } from "next/navigation"

import { CommentSection } from "@/components/comments/comment-section"
import { LetterBody } from "@/components/letter-body"
import { LetterCard, LetterMetaLine } from "@/components/letter-card"
import { LetterContents } from "@/components/letter-contents"
import { LetterCover } from "@/components/letter-cover"
import { PrismaIcon } from "@/components/prisma-icon"
import { commentsEnabled } from "@/lib/comments/config"
import {
  getLetterBySlug,
  getLetterMetadata,
  getLetterSlugs,
  getPublishedLetters,
} from "@/lib/letters/source"
import { jsonLdHtml, letterJsonLd } from "@/lib/seo"

export function generateStaticParams() {
  return getLetterSlugs().map((slug) => ({ slug }))
}

/**
 * Only the slugs above exist. Drafts are not among them, so a draft URL is a
 * hard 404 in production rather than a request-time render that happens to
 * call notFound().
 */
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const letter = getLetterMetadata(slug)

  if (!letter) return {}

  // Relative, so it resolves against the metadataBase set in app/layout.tsx.
  const images = letter.cover
    ? [{ url: letter.cover.src, alt: letter.cover.alt }]
    : undefined

  // seoTitle/seoDescription override only when a title is awkward in a search
  // result. Derived from the content model either way — never a second copy of
  // the words kept in sync by hand.
  const title = letter.seoTitle ?? letter.title
  const description = letter.seoDescription ?? letter.dek
  const url = `/cartas/${letter.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: letter.date,
      modifiedTime: letter.updated ?? letter.date,
      images,
    },
    twitter: { title, description, images },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const letter = getLetterBySlug(slug)

  if (!letter) notFound()

  const more = getPublishedLetters("newest")
    .filter((item) => item.slug !== letter.slug)
    .slice(0, 2)

  return (
    <>
      {/* Derived from the same fields as the meta tags above it, so the two
          cannot disagree about what this letter is. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(letterJsonLd(letter)) }}
      />

      {/* Nothing above the title: no breadcrumb, no back link. The reading
          column is 45rem (720px), close to the 728px the reference Substack
          post uses — wider than the max-w-2xl the rest of the site reads at. */}
      <article className="mx-auto max-w-5xl px-5 pt-12 sm:px-8 sm:pt-20">
        <header className="mx-auto max-w-[45rem]">
          <h1 className="font-heading text-[2rem] leading-[1.1] font-medium text-balance sm:text-[2.5rem]">
            {letter.title}
          </h1>
          {/* Larger than the 19px body below it. Both are Literata now, so a
            standfirst set smaller than the text it introduces reads as a
            mistake rather than as a second rank. */}
          <p className="mt-4 text-lg leading-[1.45] text-pretty text-muted-foreground sm:text-[1.3125rem]">
            {letter.dek}
          </p>
          {/* Below the title rather than above it, the way a byline sits: the
            title is what the reader should land on first. */}
          <LetterMetaLine letter={letter} className="mt-6" />
        </header>

        {letter.cover ? (
          // Kept to the reading column rather than run full-bleed, so the letter
          // reads as one measure from the title down. It is the widest image on
          // the page and sits near the top, hence eager.
          <LetterCover
            cover={letter.cover}
            sizes="(min-width: 768px) 720px, 100vw"
            className="mx-auto mt-8 max-w-[45rem] border border-border sm:mt-10"
            eager
          />
        ) : null}

        {/* No rule between the header and the body — the reference leans on
          whitespace, and with a cover above it a rule is a second divider. */}
        <div className="mx-auto mt-8 max-w-[45rem] sm:mt-10">
          <LetterBody markdown={letter.body} />
        </div>
        <LetterContents />

        {/* The letter ends on its own last sentence. There used to be a "Gostou
          desta carta?" block here; the invitation to subscribe moved to the
          footer, above the signature, so nothing stands between the text and
          the conversation about it.

          The end mark, as a printed magazine closes an article: the nib,
          small and muted, between two hairlines that fade out toward the
          edges. Distinct from the `---` rules inside a letter, which are a
          plain full line — those divide parts, this one says it is over. */}
        <div
          role="separator"
          className="mx-auto mt-14 flex max-w-[45rem] items-center gap-5 sm:mt-20"
        >
          <span className="h-px flex-1 bg-linear-to-r from-transparent to-muted-foreground/40" />
          <PrismaIcon bare className="size-4 text-muted-foreground/70" />
          <span className="h-px flex-1 bg-linear-to-l from-transparent to-muted-foreground/40" />
        </div>

        {/* Behind a flag while the comments are a prototype; see
          lib/comments/config.ts. */}
        {commentsEnabled ? (
          <div className="mx-auto mt-12 max-w-[45rem] sm:mt-16">
            <CommentSection essayId={letter.slug} />
          </div>
        ) : null}

        {more.length > 0 ? (
          <section className="mx-auto mt-16 max-w-5xl sm:mt-24">
            <h2 className="mb-6 font-label text-[0.7rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
              Continue lendo
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {more.map((item) => (
                <LetterCard key={item.slug} letter={item} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  )
}
