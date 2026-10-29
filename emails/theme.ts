/**
 * The site palette, flattened to hex for email.
 *
 * Mail clients are years behind the browser: no oklch, no custom properties,
 * no media queries worth relying on. These are the light-theme tokens from
 * `app/globals.css` converted once, so the letter that lands in an inbox is
 * the same blue-black ink on cream paper as the site. Keep them in step by hand.
 */
export const email = {
  background: "#f5f1e8", // --background
  paper: "#f9f7f2", // --card
  foreground: "#0e1624", // --foreground, a tinta azul-preta
  muted: "#575e6a", // --muted-foreground
  secondary: "#eae6dc", // --secondary
  border: "#ded7c5", // --border
  accent: "#32589d", // --accent, o azul-mar
} as const

/** Georgia is the only high-contrast serif that is safe everywhere. */
export const serif = "Georgia, 'Times New Roman', Times, serif"
export const sans =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
export const mono =
  "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace"
