"use client"

import * as React from "react"
import { MotionConfig } from "motion/react"

/**
 * Honour "reduce motion" for every motion/react animation on the site
 * (BlurReveal, Signature). TiltCard checks the query itself.
 *
 * Este arquivo era o ThemeProvider, com o next-themes por dentro. Saiu junto
 * com o botão de tema: o site é claro, sempre, e não há mais o que alternar.
 * O escuro que sobra — a barra, o fim da home e o rodapé — é a classe `dark`
 * posta direto nesses elementos, não um tema da página.
 */
function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

export { MotionProvider }
