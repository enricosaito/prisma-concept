"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { RiCloseLine, RiMenuLine } from "@remixicon/react"

import { ThemeToggle } from "@/components/theme-toggle"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Wordmark } from "@/components/wordmark"
import { nav, navCta } from "@/lib/site"
import { cn } from "@/lib/utils"

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

/** Distance scrolled before the bar is allowed to retreat at all. */
const HIDE_AFTER = 96
/** Movement below this is trackpad jitter or rubber-banding, not intent. */
const DEADZONE = 6

/**
 * The bar gets out of the way going down and comes back the moment the reader
 * scrolls up.
 *
 * Direction is all this computes; the movement itself is a CSS transition on
 * the header, so reversing mid-slide retargets from wherever the bar currently
 * sits instead of restarting from the top.
 */
function useHiddenOnScrollDown() {
  const [hidden, setHidden] = React.useState(false)

  React.useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const read = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - lastY

      // Leave lastY alone below the deadzone so slow scrolls still accumulate
      // toward a decision rather than being discarded a pixel at a time.
      if (Math.abs(delta) < DEADZONE) return
      lastY = y

      // Near the top the bar always shows: that is where the page starts, and
      // iOS rubber-banding can report a negative offset here.
      setHidden(y > HIDE_AFTER && delta > 0)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return hidden
}

function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [openedAt, setOpenedAt] = React.useState(pathname)
  const scrolledAway = useHiddenOnScrollDown()

  // The mobile sheet lives inside the header, so hiding the bar would take the
  // open menu with it.
  const hidden = scrolledAway && !open

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
        // A borda de baixo é só a hairline do `border-b` acima. Aqui havia um
        // fio do espectro atravessando a barra inteira; saiu. O espectro
        // continua onde ele diz alguma coisa — o número da edição, a seta
        // "Ler", o sublinhado do link ativo —, e não como moldura.
        // translate-y by its own height, so the bar clears itself at both h-14
        // and sm:h-16 without either being hardcoded here.
        "transition-transform duration-200 ease-snappy",
        hidden
          ? [
              "-translate-y-full",
              // Tabbing into a bar parked off-screen would focus something the
              // reader cannot see, so focus brings it back.
              "focus-within:translate-y-0",
              // Sliding the nav on every direction change is exactly what
              // reduced motion is asking us not to do: leave it in place.
              "motion-reduce:translate-y-0",
            ]
          : "translate-y-0",
        "motion-reduce:transition-none"
      )}
    >
      {/* Full-bleed on purpose: the bar spans the viewport and pins the
          wordmark and nav to the gutters, while page sections keep their
          centred max-w-5xl measure. */}
      <div className="flex h-14 w-full items-center justify-between gap-4 px-5 sm:h-16 sm:px-8">
        <Link
          href="/"
          className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Wordmark className="text-3xl tracking-normal sm:text-4xl" />
        </Link>

        <nav
          className="hidden items-center gap-1 sm:flex"
          aria-label="Principal"
        >
          <ThemeToggle className="mr-1" />

          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "relative rounded-sm px-3 py-2 font-label text-xs font-medium tracking-[0.18em] uppercase transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isActive(pathname, item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
              {isActive(pathname, item.href) ? (
                <span className="absolute inset-x-3 -bottom-px h-px [background-image:var(--spectrum)]" />
              ) : null}
            </Link>
          ))}

          <RainbowButton
            asChild
            variant="outline"
            className="ml-2 h-9 rounded-[10px] px-5 text-xs"
          >
            <Link href={navCta.href}>{navCta.label}</Link>
          </RainbowButton>
        </nav>

        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
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
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  isActive(pathname, item.href) ? "page" : undefined
                }
                className={cn(
                  "border-b border-border/60 py-3.5 font-label text-sm font-medium tracking-[0.18em] uppercase transition-colors",
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
              <Link href={navCta.href}>{navCta.label}</Link>
            </RainbowButton>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export { SiteHeader }
