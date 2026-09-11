/**
 * The gradient that `GradientWaveText` paints, as a pure function.
 *
 * It lives outside that component because the component is a `"use client"`
 * module — every export from one of those becomes a client reference, so a
 * server component calling it would fail at render. Keeping the helper here
 * lets both sides share one definition of the sweep.
 *
 * All stops are positioned off `--gi`, the variable the component animates on
 * its root element. Because custom properties inherit, any descendant that
 * paints this gradient sweeps in lockstep with it.
 */

export const defaultWaveColors = [
  "#8d6869",
  "#5a8ea6",
  "#b9c96e",
  "#c7c571",
  "#cb706f",
  "#7e5e5f",
]

export function buildWaveStops(
  colors: string[],
  bandGap: number,
  bandCount: number
) {
  const arr: string[] = []
  const baseColor = "var(--gradient-wave-base, rgb(29,29,31))"
  arr.push(`${baseColor} calc((var(--gi) + 0) * 1%)`)
  for (let i = 0; i < bandCount && i < colors.length * 2; i++) {
    const color = colors[i % colors.length]
    const offset = (i + 2) * bandGap
    arr.push(`${color} calc((var(--gi) + ${offset}) * 1%)`)
  }
  const endOffset = (bandCount + 2) * bandGap
  arr.push(`${baseColor} calc((var(--gi) + ${endOffset}) * 1%)`)
  return arr.join(", ")
}

/**
 * Use `radial: false` when elements of differing widths need to share one
 * sweep: a vertical linear gradient has no horizontal term, so every element
 * renders an identical band no matter how wide it is. The radial variant
 * centres itself on each element's own box instead.
 */
export function buildWaveGradient({
  colors = defaultWaveColors,
  bandGap = 4,
  bandCount = 8,
  radial = true,
  flip = false,
}: {
  colors?: string[]
  bandGap?: number
  bandCount?: number
  radial?: boolean
  /**
   * Runs the linear gradient top-to-bottom instead of bottom-to-top. Use it on
   * an element that is itself rotated 180°, so its flipped background comes
   * out matching its un-rotated neighbours.
   */
  flip?: boolean
} = {}) {
  const stops = buildWaveStops(colors, bandGap, bandCount)
  return radial
    ? `radial-gradient(circle at 50% bottom, ${stops})`
    : `linear-gradient(${flip ? 180 : 0}deg, ${stops})`
}
