/**
 * The dispersed spectrum — muted and warmed toward bronze so it stays inside
 * the editorial palette rather than reading as a neon rainbow.
 *
 * These five are also mirrored as `--color-1..5` in `app/globals.css` (both
 * themes), which is what the rainbow button and the `--spectrum` ramp use.
 * Keep the two lists in step.
 */
export const SPECTRUM = [
  "#b89062", // 1 bronze
  "#c9a86c", // 2 warm gold
  "#a98f7e", // 3 mauve
  "#87879b", // 4 slate violet
  "#6f8a9c", // 5 steel blue
] as const

/**
 * Each issue takes the next band of the spectrum, so a grid of letters reads
 * as one beam split across them rather than as a column of identical copper.
 * Cycles every five.
 */
export function issueColor(issue: number): string {
  const band =
    (((issue - 1) % SPECTRUM.length) + SPECTRUM.length) % SPECTRUM.length
  return `var(--color-${band + 1})`
}
