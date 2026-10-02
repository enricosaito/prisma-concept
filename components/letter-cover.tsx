import Image from "next/image"

import type { Cover } from "@/lib/letters/types"
import { cn } from "@/lib/utils"

/**
 * A letter's cover image, in a fixed 3:2 box.
 *
 * `fill` plus an aspect-ratio box — rather than the file's intrinsic width and
 * height — is what lets one asset serve both the card and the article header at
 * different widths without either being tied to the image's own proportions.
 * The parent carries `relative`, which `fill` requires.
 *
 * `sizes` is required rather than optional: with `fill` and no `sizes` the
 * browser assumes the image is as wide as the viewport and pulls a needlessly
 * large file, so each caller states the width it actually renders at.
 *
 * No radius or border of its own: a cover sitting flush inside a rounded card
 * would otherwise draw a second, tighter curve inside the card's own. Callers
 * that stand alone add `rounded-xl border border-border`; callers that bleed to
 * a rounded parent's edge let that parent's `overflow-hidden` do the clipping.
 */
function LetterCover({
  cover,
  sizes,
  className,
  eager = false,
}: {
  cover: Cover
  sizes: string
  className?: string
  /** Set on a cover near the top of the page so it is not lazy-loaded. */
  eager?: boolean
}) {
  return (
    <div
      // The ratio travels with the image rather than being fixed here, so a
      // portrait card and a landscape painting can both be covers. bg-secondary
      // is the ground under anything with an alpha channel.
      style={{ aspectRatio: cover.ratio ?? "3 / 2" }}
      className={cn("relative overflow-hidden bg-secondary", className)}
    >
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={cover.position ? { objectPosition: cover.position } : undefined}
        // Next 16 deprecates `priority` in favour of `preload`, and its own
        // guidance is that loading/fetchPriority is the better tool for a
        // single in-body hero like this one.
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
      />
    </div>
  )
}

export { LetterCover }
