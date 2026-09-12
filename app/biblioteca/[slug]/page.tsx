import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { RiArrowLeftLine } from "@remixicon/react"

import { PostCard, PostMeta } from "@/components/post-card"
import { PostContent } from "@/components/post-content"
import { SignOff } from "@/components/sign-off"
import { SubscribeForm } from "@/components/subscribe-form"
import { getAllPosts, getPostBySlug, posts } from "@/lib/posts"

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

  return {
    title: post.title,
    description: post.dek,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.dek,
      publishedTime: post.date,
    },
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
    <article className="mx-auto max-w-5xl px-5 pt-12 sm:px-8 sm:pt-16">
      <Link
        href="/biblioteca"
        className="group inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <RiArrowLeftLine className="size-3.5 text-accent transition-transform group-hover:-translate-x-0.5" />
        Arquivo
      </Link>

      <header className="mx-auto mt-10 max-w-2xl">
        <PostMeta post={post} />
        <h1 className="mt-5 font-heading text-3xl leading-[1.12] font-medium tracking-tight text-balance sm:text-[2.75rem]">
          {post.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">
          {post.dek}
        </p>
      </header>

      <hr className="mx-auto mt-10 max-w-2xl border-border" />

      <div className="mx-auto mt-10 max-w-2xl">
        <PostContent blocks={post.content} />
      </div>

      <SignOff className="mx-auto mt-12 max-w-2xl" />

      <div className="mx-auto mt-16 max-w-2xl rounded-xl border border-border bg-secondary px-6 py-9 sm:px-8">
        <h2 className="font-heading text-xl font-medium tracking-tight">
          Gostou desta carta?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Assine e receba a próxima em duas semanas.
        </p>
        <SubscribeForm className="mt-6" />
      </div>

      {more.length > 0 ? (
        <section className="mx-auto mt-20 max-w-5xl">
          <h2 className="mb-6 font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
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
