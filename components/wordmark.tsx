import { GradientWaveText } from "@/components/gradient-wave-text"
import { site } from "@/lib/site"
import { SPECTRUM } from "@/lib/spectrum"
import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------------------
 * The Playfair PRISM + Λ approach — currently parked.
 * ---------------------------------------------------------------------------
 *
 * While the wordmark was set in Playfair Display, the crossbar-less "A" was
 * built by rotating Playfair's own "V" 180°. That kept the face's
 * thin-left/thick-right diagonal contrast and landed the serifs at the feet,
 * exactly where a Playfair "A" has them. The literal Greek Λ (U+039B) was no
 * use: Playfair ships no Greek subset, so it fell back to Times New Roman.
 *
 * Three things it needed, all of which are easy to lose and expensive to
 * rediscover, so they are recorded here rather than deleted:
 *
 * 1. BASELINE_FIX = "0.12em". Rotating 180° pivots about the box centre, which
 *    drops the glyph's feet below the baseline by
 *    `(fontBoundingBoxAscent − fontBoundingBoxDescent) − capHeight`. Measured
 *    on Playfair via canvas `measureText`. Line-height cancels out of that
 *    derivation so it held at any size, but cap height moves with weight on a
 *    variable font — 0.11em at 500, 0.12em at 600.
 *
 * 2. OPTICAL_KERN = "-0.15em". Not a metric correction: rasterising PRISMA and
 *    PRISMΛ and scanning pixel columns put the Λ's ink within 0.005em of where
 *    a real "A" lands. It simply *read* too far from the M, because an "A"
 *    closes its counter with the crossbar while a Λ leaves it open, so that
 *    white joined the letter-spacing into one gap.
 *
 * 3. The Λ could not live inside GradientWaveText's text-clipped span.
 *    `background-clip: text` derives its clip from the un-rotated text run, so
 *    a rotated glyph in there rendered upright *and* ghosted a second V over
 *    the P. It went in the `trailing` slot instead — inside the animated root
 *    so it still inherited `--gi`, but outside the clip — painting its own
 *    gradient, built flipped (its rotation flips the background with it) and
 *    offset by BASELINE_FIX to keep the band aligned.
 *
 * "against regular" has its own distinctive A, so none of this is needed while
 * the wordmark is set in it. Restore from git history if the face changes back.
 * ------------------------------------------------------------------------- */

/**
 * Optical centring nudge.
 *
 * Flexbox centres the *line box*, not the ink. Mermaid1001 reserves a big
 * descent (13px at 36px) that all-caps never uses, so the word lands high —
 * measured 15.5px of space above the glyphs and 21.5px below inside the bar.
 *
 * The imbalance works out to `(fontBoundingBoxDescent − fontBoundingBoxAscent)
 * + (inkAscent − inkDescent)`, halved. Line-height cancels out of that, so one
 * em constant holds at both header sizes. Measured via canvas `measureText`:
 * (13 − 32 + 26 − 1) / 2 = 3px at 36px = 0.083em.
 *
 * Re-measure if the display face changes — it is a property of that font.
 */
const OPTICAL_CENTER = "translate-y-[0.083em]"

/**
 * PRISMA, set in the display face — plain text, no per-glyph surgery.
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
      <span className={cn("font-display", OPTICAL_CENTER, className)}>
        {site.wordmark}
      </span>
    )
  }

  return (
    <GradientWaveText
      key={waveKey}
      align="left"
      customColors={[...SPECTRUM]}
      radial={false}
      bottomOffset={0}
      className={cn(
        "h-auto w-auto font-display [--gradient-wave-base:var(--foreground)] dark:[--gradient-wave-base:var(--foreground)]",
        OPTICAL_CENTER,
        className
      )}
    >
      {site.wordmark}
    </GradientWaveText>
  )
}

export { Wordmark }
