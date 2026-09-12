import type { Metadata } from "next"
import { Geist_Mono, Inter, Playfair_Display } from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

const fontHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
})

// Display face for the wordmark. The .otf carries no usable name table, which
// is fine — next/font/local writes its own @font-face.
const fontDisplay = localFont({
  src: "../public/fonts/against regular.otf",
  variable: "--font-display",
  display: "swap",
})

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
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
        fontMono.variable
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
