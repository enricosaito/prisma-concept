import type { Metadata } from "next"
import { Archivo, Fraunces, Literata } from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

// Titles. Chosen against Literata rather than on its own: both are warm and
// humanist, where Playfair was a cold high-contrast Didone that only agreed
// with the body while the body was a neutral sans. Its hairlines were also the
// wrong bet for a dark-first site — thin strokes on a dark ground get eaten by
// halation, so the face was quietly at its weakest exactly where this site
// spends most of its time.
//
// `opsz` is requested so the browser can size-match automatically — Fraunces is
// drawn differently at 14px and at 60px. `WONK` is the quirk axis: it swaps in
// the flared, slightly off-kilter alternates. That is the personality dial, and
// it is the reason to pick this face over a safer one.
const fontHeading = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "WONK"],
  variable: "--font-heading",
})

// Display face for the wordmark. Mermaid1001.ttf is still in public/fonts if
// this needs to go back; it sits 0.09em high in a flex row and wants the
// optical nudge documented in components/wordmark.tsx, which "against" does
// not.
const fontDisplay = localFont({
  src: "../public/fonts/against regular.otf",
  variable: "--font-display",
  display: "swap",
})

// Body copy. Literata was drawn for reading on screen, which is the whole job
// here — the letters run 17-19px for minutes at a time.
//
// Variable, so no weight list: the axis covers the 400 the prose uses and the
// 500 on the "Ler" call to action. The italic is loaded as a real cut rather
// than left to the browser, because `.prose-letter blockquote` is italic and a
// synthesised slant is a sheared roman, not an italic.
const fontSans = Literata({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-sans",
})

// Chrome: navigation, buttons, dates, section eyebrows. Its job is to be
// legibly NOT the other two, so the eye files it as interface rather than
// content — a mechanical grotesque against two warm serifs.
//
// Archivo over IBM Plex for two reasons. Everything distinctive about Plex
// lives in its lowercase, and this layer is all small caps, so almost none of
// it ever showed. And Archivo comes from Omnibus-Type, an Argentine foundry
// that drew it for Latin American setting — the tildes and cedillas this site
// needs were designed by people who use them.
const fontLabel = Archivo({
  subsets: ["latin"],
  variable: "--font-label",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  // O título dos cartões de compartilhamento carrega a assinatura, igual ao
  // título da aba. Antes era só "PRISMA": quem recebia o link no WhatsApp via
  // o nome pelado, sem nada que dissesse o que a publicação é.
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "font-sans",
        fontSans.variable,
        fontHeading.variable,
        fontDisplay.variable,
        fontLabel.variable
      )}
    >
      <body className="min-h-svh">
        <ThemeProvider>
          <div className="flex min-h-svh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
