"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { MotionConfig } from "motion/react"

/**
 * The shadcn scaffold shipped a "press d to toggle dark mode" hotkey here. It
 * is gone: the navbar's ThemeToggle is the only way to switch now, so a bare
 * letter key cannot surprise anyone mid-page.
 */
function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {/* Honour "reduce motion" for every motion/react animation on the site
          (BlurReveal, Signature). TiltCard checks the query itself. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  )
}

export { ThemeProvider }
