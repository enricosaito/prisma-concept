import type { Metadata } from "next"

import { notFound } from "next/navigation"
import { RiInstagramLine } from "@remixicon/react"

import { PostCard, PostMeta } from "@/components/post-card"
import { PostContent } from "@/components/post-content"
import { PostCover } from "@/components/post-cover"
import { SignOff } from "@/components/sign-off"
import { SubscribeForm } from "@/components/subscribe-form"
import { getAllPosts, getPostBySlug, posts } from "@/lib/posts"
import { site } from "@/lib/site"

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return {}

  // Relative, so it resolves against the metadataBase set in app/layout.tsx.
  const images = post.cover
    ? [{ url: post.cover.src, alt: post.cover.alt }]
    : undefined

  return {
    title: post.title,
    description: post.dek,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.dek,
      publishedTime: post.date,
      images,
    },
    twitter: { images },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const more = getAllPosts()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2)

  return (
    // Nothing above the title: no breadcrumb, no back link. The reading column
    // is 45rem (720px), close to the 728px the reference Substack post uses —
    // wider than the max-w-2xl the rest of the site reads at.
    <article className="mx-auto max-w-5xl px-5 pt-12 sm:px-8 sm:pt-20">
      <header className="mx-auto max-w-[45rem]">
        <h1 className="font-heading text-[2rem] leading-[1.1] font-medium text-balance sm:text-[2.5rem]">
          {post.title}
        </h1>
        {/* Larger than the 19px body below it. Both are Literata now, so a
            standfirst set smaller than the text it introduces reads as a
            mistake rather than as a second rank. */}
        <p className="mt-4 text-lg leading-[1.45] text-pretty text-muted-foreground sm:text-[1.3125rem]">
          {post.dek}
        </p>
        {/* Below the title rather than above it, the way a byline sits: the
            title is what the reader should land on first. */}
        <PostMeta post={post} className="mt-6" />
      </header>

      {post.cover ? (
        // Kept to the reading column rather than run full-bleed, so the letter
        // reads as one measure from the title down. It is the widest image on
        // the page and sits near the top, hence eager.
        <PostCover
          cover={post.cover}
          sizes="(min-width: 768px) 720px, 100vw"
          className="mx-auto mt-8 max-w-[45rem] rounded-xl border border-border sm:mt-10"
          eager
        />
      ) : null}

      {/* No rule between the header and the body — the reference leans on
          whitespace, and with a cover above it a rule is a second divider. */}
      <div className="mx-auto mt-8 max-w-[45rem] sm:mt-10">
        <PostContent blocks={post.content} />
      </div>

      <SignOff className="mx-auto mt-12 max-w-[45rem] sm:mt-16" />

      {/* No panel around this one. Boxing it made it read as an advertisement
          dropped into the page; unboxed it reads as the letter still talking. */}
      <div className="mx-auto mt-14 max-w-[45rem] sm:mt-20">
        <h2 className="font-heading text-xl font-medium">
          Gostou desta carta?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Inscreva-se gratuitamente e receba as próximas cartas no seu e-mail
          toda semana.
        </p>
        <SubscribeForm className="mt-6" />
        <a
          href={site.instagram}
          target="_blank"
          rel="noreferrer"
          // The icon alone is the link, so it carries the handle as its
          // accessible name rather than a bare "Instagram". p-2 keeps the tap
          // target at 32px with a 16px glyph inside it.
          aria-label={`${site.instagramHandle} no Instagram`}
          className="mt-5 -ml-2 inline-flex rounded-sm p-2 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <RiInstagramLine className="size-4" />
        </a>
      </div>

      {more.length > 0 ? (
        <section className="mx-auto mt-16 max-w-5xl sm:mt-24">
          <h2 className="mb-6 font-label text-[0.7rem] font-medium tracking-[0.22em] text-muted-foreground uppercase">
            Continue lendo
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {more.map((item) => (
              <PostCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
