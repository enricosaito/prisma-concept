"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { RiCloseLine, RiMenuLine } from "@remixicon/react"

import { RainbowButton } from "@/components/ui/rainbow-button"
import { Wordmark } from "@/components/wordmark"
import { nav } from "@/lib/site"
import { cn } from "@/lib/utils"

const subscribeHref = "/assinar"
const inlineLinks = nav.filter((item) => item.href !== subscribeHref)

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [openedAt, setOpenedAt] = React.useState(pathname)
  const [waveKey, setWaveKey] = React.useState(0)

  // Dismiss the mobile sheet whenever the route changes — including via the
  // browser's back/forward buttons. Adjusting state during render (rather than
  // in an effect) avoids a second render pass with the stale panel on screen.
  if (openedAt !== pathname) {
    setOpenedAt(pathname)
    setOpen(false)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/40",
        // Frosted glass: a translucent ground plus blur and a touch of
        // saturation, so content scrolling under it tints the bar instead of
        // disappearing. Falls back to a near-opaque bar where backdrop-filter
        // is unsupported, otherwise the text would sit on bare content.
        "bg-background/90 supports-[backdrop-filter]:bg-background/68",
        "backdrop-blur-xl backdrop-saturate-150",
        // Bronze hairline along the bottom edge, fading out at both ends.
        "after:absolute after:inset-x-0 after:-bottom-px after:h-px",
        "after:bg-gradient-to-r after:from-transparent after:via-accent/40 after:to-transparent"
      )}
    >
      {/* Full-bleed on purpose: the bar spans the viewport and pins the
          wordmark and nav to the gutters, while page sections keep their
          centred max-w-5xl measure. */}
      <div className="flex h-14 w-full items-center justify-between gap-4 px-5 sm:h-16 sm:px-8">
        <Link
          href="/"
          onMouseEnter={() => setWaveKey((n) => n + 1)}
          className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {/* Remounting on hover replays the one-shot sweep; `repeat` would
              leave a requestAnimationFrame loop running on every page. */}
          <Wordmark
            wave
            waveKey={waveKey}
            className="text-3xl tracking-normal sm:text-4xl"
          />
        </Link>

        <nav
          className="hidden items-center gap-1 sm:flex"
          aria-label="Principal"
        >
          {inlineLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "relative rounded-sm px-3 py-2 font-heading text-xs tracking-[0.18em] uppercase transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isActive(pathname, item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
              {isActive(pathname, item.href) ? (
                <span className="absolute inset-x-3 -bottom-px h-px bg-accent" />
              ) : null}
            </Link>
          ))}

          <RainbowButton
            asChild
            variant="outline"
            className="ml-2 h-9 rounded-[10px] px-5 text-xs"
          >
            <Link href={subscribeHref}>Assinar</Link>
          </RainbowButton>
        </nav>

        <div className="flex items-center gap-1 sm:hidden">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="rounded-sm p-2 text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {open ? (
              <RiCloseLine className="size-5" />
            ) : (
              <RiMenuLine className="size-5" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          // No blur of its own — it sits inside the header, so the header's
          // backdrop-filter already frosts what is behind this panel too.
          className="border-t border-border/40 bg-background/40 px-5 pb-5 sm:hidden"
        >
          <nav className="flex flex-col" aria-label="Principal (mobile)">
            {inlineLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  isActive(pathname, item.href) ? "page" : undefined
                }
                className={cn(
                  "border-b border-border/60 py-3.5 font-heading text-base tracking-[0.18em] uppercase transition-colors",
                  isActive(pathname, item.href)
                    ? "text-accent"
                    : "text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            <RainbowButton
              asChild
              variant="outline"
              className="mt-5 h-11 w-full rounded-[10px] text-xs"
            >
              <Link href={subscribeHref}>Assinar a carta</Link>
            </RainbowButton>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export { SiteHeader }
