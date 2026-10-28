/**
 * The site palette, flattened to hex for email.
 *
 * Mail clients are years behind the browser: no oklch, no custom properties,
 * no media queries worth relying on. These are the light-theme tokens from
 * `app/globals.css` converted once, so the letter that lands in an inbox is
 * the same warm ink on cool paper as the site. Keep them in step by hand.
 */
export const email = {
  background: "#f6f7f8", // --background
  paper: "#ffffff", // --card
  foreground: "#101112", // --foreground
  muted: "#5d6062", // --muted-foreground
  secondary: "#edebe4", // --secondary
  border: "#ded7c5", // --border
  accent: "#b89062", // --accent
} as const

/** Georgia is the only high-contrast serif that is safe everywhere. */
export const serif = "Georgia, 'Times New Roman', Times, serif"
export const sans =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
export const mono =
  "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace"
