import type { Category } from "@/lib/posts"

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
 * A prism splits one beam into the four things this letter is about, so each
 * category gets its own band instead of every label being the same copper.
 */
export const CATEGORY_COLOR: Record<Category, string> = {
  Tecnologia: "var(--color-5)", // steel blue
  Arte: "var(--color-1)", // bronze
  Design: "var(--color-4)", // slate violet
  Escrita: "var(--color-2)", // warm gold
}

/** Ordered to match the hero's topic list. */
export const TOPIC_COLOR: Record<string, string> = CATEGORY_COLOR
