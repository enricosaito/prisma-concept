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
 * `compact` shortens the date so the line survives a narrow column without
 * wrapping onto three rows.
 *
 * `showIssue` and `showReadingTime` are off wherever the surrounding layout
 * already prints that value — the number leading the standfirst, the reading
 * time sitting in the "Ler" call to action — so it is not repeated a line
 * apart.
 */
function PostMeta({
  post,
  compact = false,
  showIssue = true,
  showReadingTime = true,
  className,
}: {
  post: Post
  compact?: boolean
  showIssue?: boolean
  showReadingTime?: boolean
  className?: string
}) {
  const divider = (
    <span aria-hidden className="text-border">
      /
    </span>
  )

  return (
    <div
      className={cn(
        // Third rank, and dressed to look it: mono, caps and small, so it
        // separates from the standfirst by face and case as well as by size.
        // Tracking goes up as the size comes down — caps this small close up
        // and stop being scannable without it.
        "flex flex-wrap items-center gap-x-3 gap-y-1 font-label text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase",
        className
      )}
    >
      {showIssue ? (
        <>
          <span style={{ color: issueColor(post.issue) }}>
            {formatIssue(post.issue)}
          </span>
          {divider}
        </>
      ) : null}
      <time dateTime={post.date}>
        {compact ? formatDateShort(post.date) : formatDate(post.date)}
      </time>
      {showReadingTime ? (
        <>
          {divider}
          <span>{post.readingMinutes} min de leitura</span>
        </>
      ) : null}
    </div>
  )
}

/**
 * "Ler →" at the foot of a listed letter. On its own: the reading time reads
 * as metadata and belongs on the date line, not inside the call to action.
 */
function ReadCta({ post, className }: { post: Post; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium text-foreground",
        className
      )}
    >
      Ler
      <RiArrowRightLine
        style={{ color: issueColor(post.issue) }}
        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
      />
    </span>
  )
}

/**
 * "1: " ahead of the standfirst. It inherits the standfirst's colour rather
 * than taking the issue's band of the spectrum — the monospace face is enough
 * to read it as an index, and colouring it made it compete with the title.
 */
function IssuePrefix({ post }: { post: Post }) {
  return (
    <span className="font-label font-medium">{formatIssue(post.issue)}:</span>
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
          {/* The card prints the reading time in its own footer row. */}
          <PostMeta post={post} compact showReadingTime={false} />
          <h3 className="mt-3 font-heading text-xl leading-snug font-medium text-pretty">
            <Link href={`/cartas/${post.slug}`} className="outline-none">
              <span className="absolute inset-0" />
              <span className="bg-[linear-gradient(var(--accent),var(--accent))] box-decoration-clone bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
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
            <span className="font-label text-[0.7rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              {post.readingMinutes} min
            </span>
          </div>
        </div>
      </article>
    </TiltCard>
  )
}

/**
 * Upright cover beside the text, for every list of letters — home and archive.
 *
 * This replaced a separate dense `PostRow` for the archive. Once both lists
 * carried the same upright cover the two differed only by a rule and how much
 * of the date they showed, which is a `className` and a flag, not a component.
 *
 * Prefers `thumb` over `cover`: the head of a letter wants a wide image, a slot
 * like this one wants a tall one, and they are rarely the same picture.
 *
 * The link wraps the whole item rather than stretching an `absolute inset-0`
 * span over it, the way the card grid does. That span sits above the cover and
 * swallows the pointer, so TiltCard never sees a hover and never tilts.
 * Wrapping lets the event reach it on the way up and still lands the click
 * anywhere on the row.
 */
function PostListItem({
  post,
  className,
  variant = "archive",
}: {
  post: Post
  className?: string
  /**
   * "lead" — the letters open the home page with nothing above them, so they
   * are set larger and the meta line stays to a short date. "archive" — one of
   * many under a page title, at reading size with the full date and the
   * reading time.
   */
  variant?: "lead" | "archive"
}) {
  const art = post.thumb ?? post.cover
  const lead = variant === "lead"

  return (
    <article className={className}>
      <Link
        href={`/cartas/${post.slug}`}
        // Without this the link's name is the image description, then the
        // title, then the standfirst, then the date, read end to end.
        aria-label={post.title}
        className="group flex items-start gap-5 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-8"
      >
        {art ? (
          // The tilt and spotlight the card grid used to carry, now on the
          // cover alone — the only part of the row with a face to catch light.
          // TiltCard is already relative + overflow-hidden, so it holds the
          // frame and clips the image to a single radius.
          <TiltCard
            tiltLimit={6}
            scale={1.02}
            effect="gravitate"
            className="w-32 shrink-0 rounded-xl border border-border sm:w-48"
          >
            <PostCover cover={art} sizes="(min-width: 640px) 192px, 128px" />
          </TiltCard>
        ) : null}
        {/* Capped rather than left to fill the row: at full width the title ran
            as one long line, a poor measure to read a sentence on. */}
        <div className={cn("min-w-0", lead ? "max-w-xl" : "max-w-lg")}>
          {/*
            Three ranks, each a clear step from the one below it. On a wide
            screen the lead runs 38 / 18 / 10.4px — 2.1x from title to
            standfirst, 1.7x from standfirst to date. The archive holds the same
            shape one notch down, at 30 / 14 / 10.4.

            Leading tightens as the type grows: `leading-snug` is right for a
            20px line and loose for a 38px one, where the gap between lines
            starts to read as a gap between thoughts.

            36px is measured, not picked. In this 576px column the title holds
            two lines up to 36px and breaks to three at 38 — it used to hold 38,
            and lost that when the negative tracking came off the headings, since
            removing tracking widens a line. A longer title will still run to
            three lines; that is the measure doing its job, not a fault.
          */}
          <h3
            className={cn(
              "font-heading font-medium text-pretty",
              lead
                ? "text-2xl leading-[1.15] sm:text-[2.25rem]"
                : "text-xl leading-[1.2] sm:text-[1.875rem]"
            )}
          >
            <span className="bg-[linear-gradient(var(--accent),var(--accent))] box-decoration-clone bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
              {post.title}
            </span>
          </h3>
          <p
            className={cn(
              "mt-3 leading-relaxed text-pretty text-muted-foreground",
              lead ? "text-base sm:text-lg" : "text-sm"
            )}
          >
            <IssuePrefix post={post} /> {post.dek}
          </p>
          <PostMeta
            post={post}
            compact={lead}
            showIssue={false}
            className="mt-3"
          />
          {/* Set off from the date rather than tucked under it, which drops it
              into the lower half of the cover beside it. */}
          <ReadCta post={post} className="mt-7" />
        </div>
      </Link>
    </article>
  )
}

export { PostCard, PostListItem, PostMeta }
