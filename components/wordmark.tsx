import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------------------
 * The Playfair PRISM + Λ approach — parked, and now moot.
 * ---------------------------------------------------------------------------
 *
 * The wordmark is set in "against regular", which ships its own crossbar-less
 * "A" — a Λ form with a fine swash where the bar would be. That is the letter
 * all of the below was trying to construct, so none of it is needed while this
 * face is in use. Kept because the constants were measured, not guessed, and
 * the background-clip constraint at the end is easy to rediscover the hard way.
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
 * Optical centring: none needed for this face.
 *
 * Flexbox centres the *line box*, not the ink, so a face that reserves more
 * room on one side of the baseline than its capitals use will sit off centre.
 * Measured with canvas `measureText` at 200px, as blank space above the caps
 * versus below them, per em:
 *
 *     Mermaid1001      above 0.195   below 0.375   -> 0.090em too high
 *     against regular  above 0.260   below 0.265   -> 0.003em, nothing to fix
 *
 * Mermaid needed a `translate-y-[0.083em]` nudge and carried one. "against"
 * seats itself, and keeping that nudge would have pushed it about 3px low at
 * 36px. Re-measure if the display face changes again — the imbalance is a
 * property of the font, not of the layout.
 */

/**
 * PRISMA, set in the display face — plain text, no per-glyph surgery.
 *
 * It used to sweep the spectrum through the letters on mount, via
 * GradientWaveText. That is gone: the wordmark is a link home, and the bar it
 * sits in now moves on its own as the reader scrolls. `gradient-wave-text.tsx`
 * stays in the tree unused, like `light-rays.tsx`.
 */
function Wordmark({ className }: { className?: string }) {
  return <span className={cn("font-display", className)}>{site.wordmark}</span>
}

export { Wordmark }
