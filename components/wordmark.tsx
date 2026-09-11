import { GradientWaveText } from "@/components/gradient-wave-text"
import { buildWaveGradient } from "@/lib/wave-gradient"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * A prism disperses white light, so the wordmark sweeps a spectrum — but a
 * muted one, warmed toward the bronze accent so it stays inside the palette.
 */
const spectrum = [
  "#b89062",
  "#c9a86c",
  "#a98f7e",
  "#87879b",
  "#6f8a9c",
  "#9c7f76",
]

/**
 * Vertical rather than the component's default radial sweep: a linear gradient
 * along the block axis has no horizontal term, so the narrow Λ and the wide
 * PRISM paint the same band and the sweep reads as one. A radial gradient
 * centres on each element's own box, and the Λ would shimmer out of step.
 *
 * The Λ is rotated 180°, which flips its background with it, so it gets the
 * gradient built in the opposite direction to come out matching.
 */
const waveGradientFlipped = buildWaveGradient({
  colors: spectrum,
  radial: false,
  flip: true,
})

/**
 * Rotating 180° pivots about the box centre, which drops the glyph's feet below
 * the baseline by `(fontBoundingBoxAscent − fontBoundingBoxDescent) − capHeight`.
 * Measured against Playfair Display via canvas `measureText`, that is 11% of the
 * font size. Line-height cancels out of the derivation, so the one constant
 * holds at every size.
 */
const BASELINE_FIX = "0.11em"

/**
 * The crossbar-less "A": Playfair's own "V" turned 180°.
 *
 * Using the real glyph rather than a drawn shape keeps the face's
 * thin-left/thick-right diagonal contrast and lands the serifs at the feet,
 * exactly where a Playfair "A" has them. The literal Greek Λ (U+039B) is no
 * good here — Playfair Display ships no Greek subset, so it falls back to
 * Times New Roman and stops matching the other letters.
 *
 * It paints its own clipped gradient and is passed to GradientWaveText's
 * `trailing` slot rather than nested in its text-clipped span; see that prop
 * for why a rotated glyph cannot live inside the clip.
 */
function Lambda({ wave }: { wave?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block", wave && "-ml-[2px]")}
      style={{
        rotate: "180deg",
        translate: `0 ${BASELINE_FIX}`,
        ...(wave
          ? {
              backgroundImage: waveGradientFlipped,
              // Cancels the baseline nudge above, which would otherwise carry
              // the background down with the glyph and offset the band.
              backgroundPosition: `0 ${BASELINE_FIX}`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }
          : null),
      }}
    >
      V
    </span>
  )
}

/**
 * PRISMΛ.
 *
 * The letters are hidden from assistive tech and the name is announced once via
 * the visually-hidden span, otherwise the mark would read as "PRISM V".
 */
function Wordmark({
  className,
  wave = false,
  /** Change this to replay the one-shot sweep. */
  waveKey,
}: {
  className?: string
  wave?: boolean
  waveKey?: number
}) {
  if (!wave) {
    return (
      <span className={cn("inline-flex items-baseline", className)}>
        <span className="sr-only">{site.wordmark}</span>
        <span aria-hidden="true">PRISM</span>
        <Lambda />
      </span>
    )
  }

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span className="sr-only">{site.wordmark}</span>
      <GradientWaveText
        key={waveKey}
        align="left"
        customColors={spectrum}
        radial={false}
        bottomOffset={0}
        trailing={<Lambda wave />}
        className="h-auto w-auto items-baseline [--gradient-wave-base:var(--foreground)] dark:[--gradient-wave-base:var(--foreground)]"
      >
        <span aria-hidden="true">PRISM</span>
      </GradientWaveText>
    </span>
  )
}

export { Wordmark }
