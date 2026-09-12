import Link from "next/link"
import { RiArrowRightLine } from "@remixicon/react"

import { TiltCard } from "@/components/tilt-card"
import { formatDate, formatDateShort, type Post } from "@/lib/posts"
import { cn } from "@/lib/utils"

/**
 * `compact` drops the reading time and shortens the date so the line survives
 * a narrow card column without wrapping onto three rows.
 */
function PostMeta({
  post,
  compact = false,
  className,
}: {
  post: Post
  compact?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase",
        className
      )}
    >
      <span className="text-accent">{post.category}</span>
      <span aria-hidden className="text-border">
        /
      </span>
      <time dateTime={post.date}>
        {compact ? formatDateShort(post.date) : formatDate(post.date)}
      </time>
      {compact ? null : (
        <>
          <span aria-hidden className="text-border">
            /
          </span>
          <span>{post.readingMinutes} min de leitura</span>
        </>
      )}
    </div>
  )
}

/** The large lead item at the top of the homepage. */
function FeaturedPostCard({ post }: { post: Post }) {
  return (
    <article className="group relative border-t border-border pt-8">
      <PostMeta post={post} />
      <h2 className="mt-4 font-heading text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-[2.5rem]">
        <Link href={`/biblioteca/${post.slug}`} className="outline-none">
          <span className="absolute inset-0" />
          <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
            {post.title}
          </span>
        </Link>
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {post.dek}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
        Ler a carta
        <RiArrowRightLine className="size-4 text-accent transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </article>
  )
}

/**
 * Card used in grids. A gentle "gravitate" tilt — it leans toward the cursor,
 * which reads as the card being picked up rather than shied away from.
 */
function PostCard({ post }: { post: Post }) {
  return (
    <TiltCard
      tiltLimit={6}
      scale={1.02}
      effect="gravitate"
      className="h-full rounded-xl border border-border bg-card"
    >
      <article className="group relative flex h-full flex-col p-6">
        <PostMeta post={post} compact />
        <h3 className="mt-3 font-heading text-xl leading-snug font-medium tracking-tight text-pretty">
          <Link href={`/biblioteca/${post.slug}`} className="outline-none">
            <span className="absolute inset-0" />
            <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
              {post.title}
            </span>
          </Link>
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {post.dek}
        </p>
        <div className="mt-auto flex items-baseline justify-between gap-3 pt-6">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            Ler
            <RiArrowRightLine className="size-3.5 text-accent transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <span className="font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
            {post.readingMinutes} min
          </span>
        </div>
      </article>
    </TiltCard>
  )
}

/** Dense row used where scanning a long archive matters more than flourish. */
function PostRow({ post }: { post: Post }) {
  return (
    <article className="group relative border-t border-border/70 py-7">
      <PostMeta post={post} />
      <h3 className="mt-3 font-heading text-xl leading-snug font-medium tracking-tight text-pretty sm:text-2xl">
        <Link href={`/biblioteca/${post.slug}`} className="outline-none">
          <span className="absolute inset-0" />
          <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
            {post.title}
          </span>
        </Link>
      </h3>
      <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {post.dek}
      </p>
    </article>
  )
}

export { FeaturedPostCard, PostCard, PostRow, PostMeta }
