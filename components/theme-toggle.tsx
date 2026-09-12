"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { cn } from "@/lib/utils"

const noop = () => () => {}

/**
 * Server renders false, client renders true — without a setState-in-effect,
 * which this project's React Compiler lint rejects.
 */
function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
}

/**
 * Theme switch for the navbar.
 *
 * `AnimatedThemeToggler` is driven in **controlled** mode. Left uncontrolled it
 * writes `localStorage.theme` and watches the `dark` class itself, which would
 * fight next-themes — this project's source of truth — and the two would drift
 * apart on reload or on a system theme change. Controlled, the component only
 * runs the view-transition and hands the new value back.
 *
 * Rendering is deferred until mount because `resolvedTheme` is undefined on the
 * server: committing to an icon too early would both mismatch hydration and
 * momentarily drop the component into uncontrolled mode. The placeholder holds
 * the same box so the navbar does not shift.
 */
function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  const box = "inline-flex size-9 items-center justify-center rounded-[10px]"

  if (!mounted) {
    return <span aria-hidden className={cn(box, className)} />
  }

  return (
    <AnimatedThemeToggler
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onThemeChange={setTheme}
      duration={450}
      variant="circle"
      aria-label="Alternar tema"
      className={cn(
        box,
        "cursor-pointer text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        "[&_svg]:size-[18px]",
        className
      )}
    />
  )
}

export { ThemeToggle }
