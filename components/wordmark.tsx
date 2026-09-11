import { GradientWaveText } from "@/components/gradient-wave-text"
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
 * The crossbar-less "A": Playfair's own "V" turned 180°.
 *
 * Using the real glyph rather than a drawn shape keeps the face's
 * thin-left/thick-right diagonal contrast and lands the serifs at the feet,
 * exactly where a Playfair "A" has them. Rotating about the glyph's centre
 * leaves the cap-height box unchanged, so it still sits on the baseline.
 */
function Lambda({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block rotate-180", className)}
    >
      V
    </span>
  )
}

/**
 * PRISM + Λ.
 *
 * The Λ is deliberately kept *outside* the GradientWaveText element. That
 * component paints its gradient with `background-clip: text`, and the browser
 * derives that clip from the un-rotated text run — so a rotated glyph inside it
 * renders as an upright V-shaped hole in the gradient, ignoring the rotation.
 * Outside the clip the glyph paints normally. It holds steady in ink for the
 * ~1s the sweep runs, then matches the rest again.
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
  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span className="sr-only">{site.wordmark}</span>
      {wave ? (
        <GradientWaveText
          key={waveKey}
          align="left"
          customColors={spectrum}
          bottomOffset={0}
          className="h-auto w-auto [--gradient-wave-base:var(--foreground)] dark:[--gradient-wave-base:var(--foreground)]"
        >
          <span aria-hidden="true">PRISM</span>
        </GradientWaveText>
      ) : (
        <span aria-hidden="true">PRISM</span>
      )}
      {/* GradientWaveText puts `padding-inline: 2px` on its inner span, which
          would widen the M→Λ gap by exactly 2px against the other letters. */}
      <Lambda className={wave ? "-ml-[2px]" : undefined} />
    </span>
  )
}

export { Wordmark }
