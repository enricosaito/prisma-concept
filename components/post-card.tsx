import Link from "next/link"
import { RiArrowRightLine } from "@remixicon/react"

import { PostCover } from "@/components/post-cover"
import { TiltCard } from "@/components/tilt-card"
import {
  formatDate,
  formatDateShort,
  formatIssue,
  type Post,
} from "@/lib/posts"
import { issueColor } from "@/lib/spectrum"
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
      <span style={{ color: issueColor(post.issue) }}>
        {formatIssue(post.issue)}
      </span>
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
      <article className="group relative flex h-full flex-col">
        {post.cover ? (
          // Flush to the card's edges — TiltCard already clips with
          // overflow-hidden, so the card's own rounded-xl is the only curve.
          // The grid is max-w-5xl: three up the card settles near 328px, two up
          // it is half the viewport, one up the viewport less the page gutters.
          <PostCover
            cover={post.cover}
            sizes="(min-width: 1024px) 328px, (min-width: 640px) 50vw, 100vw"
          />
        ) : null}
        <div className="flex flex-1 flex-col p-6">
          <PostMeta post={post} compact />
          <h3 className="mt-3 font-heading text-xl leading-snug font-medium tracking-tight text-pretty">
            <Link href={`/cartas/${post.slug}`} className="outline-none">
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
              <RiArrowRightLine
                style={{ color: issueColor(post.issue) }}
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
            <span className="font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
              {post.readingMinutes} min
            </span>
          </div>
        </div>
      </article>
    </TiltCard>
  )
}

/** Dense row used where scanning a long archive matters more than flourish. */
function PostRow({ post }: { post: Post }) {
  return (
    <article className="group relative flex flex-col gap-5 border-t border-border/70 py-7 sm:flex-row sm:items-start sm:gap-7">
      {post.cover ? (
        // Full width stacked on a phone, then a fixed 11rem column from sm —
        // which is where the row has the width to put text beside it.
        <PostCover
          cover={post.cover}
          sizes="(min-width: 640px) 176px, 100vw"
          // Stands alone against the page, so it carries its own frame.
          className="rounded-xl border border-border sm:w-44 sm:shrink-0"
        />
      ) : null}
      <div className="min-w-0">
        <PostMeta post={post} />
        <h3 className="mt-3 font-heading text-xl leading-snug font-medium tracking-tight text-pretty sm:text-2xl">
          <Link href={`/cartas/${post.slug}`} className="outline-none">
            <span className="absolute inset-0" />
            <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
              {post.title}
            </span>
          </Link>
        </h3>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {post.dek}
        </p>
      </div>
    </article>
  )
}

export { PostCard, PostRow, PostMeta }
