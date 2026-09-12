"use client"
import { AnimatePresence, motion } from "motion/react"
import type React from "react"
import { useState } from "react"

import { cn } from "@/lib/utils"

export interface BlurRevealProps {
  children: string
  className?: string
  delay?: number
  speedReveal?: number
  speedSegment?: number
  trigger?: boolean
  onAnimationComplete?: () => void
  onAnimationStart?: () => void
  as?: keyof React.JSX.IntrinsicElements
  style?: React.CSSProperties
  inView?: boolean
  once?: boolean
  letterSpacing?: string | number
}

export function BlurReveal({
  children,
  className,
  delay = 0,
  speedReveal = 1.5,
  speedSegment = 0.5,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  as = "p",
  style,
  inView = false,
  once = true,
  letterSpacing,
}: BlurRevealProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  // motion leaves `filter: blur(0px)` on every glyph once the reveal lands, and
  // a filter that isn't `none` still puts each span in its own layer. Inside a
  // `background-clip: text` parent (Highlight) those layers paint outside the
  // clip, so the word came out blank — the reason the highlighted word was
  // missing on mobile. Once the reveal has settled the blur has nothing left to
  // do, so drop it and let the glyphs paint inline again.
  const [settled, setSettled] = useState(false)

  // A re-entry has to blur in again, so the flag resets when `trigger` flips.
  const [wasTriggered, setWasTriggered] = useState(trigger)
  if (wasTriggered !== trigger) {
    setWasTriggered(trigger)
    setSettled(false)
  }

  function handleAnimationComplete() {
    setSettled(true)
    onAnimationComplete?.()
  }

  const stagger = 0.03 / speedReveal
  const baseDuration = 0.3 / speedSegment

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
    exit: {
      transition: {
        staggerChildren: stagger,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, filter: "blur(12px)", y: 10 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: baseDuration,
      },
    },
    exit: { opacity: 0, filter: "blur(12px)", y: 10 },
  }

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          initial="hidden"
          whileInView={inView ? "visible" : undefined}
          animate={inView ? undefined : "visible"}
          exit="exit"
          variants={containerVariants}
          viewport={{ once }}
          className={cn(
            className,
            // !important: it has to beat motion's own inline style.
            settled && "[&_span]:[filter:none]!"
          )}
          onAnimationComplete={handleAnimationComplete}
          onAnimationStart={onAnimationStart}
          style={style}
        >
          <span className="sr-only">{children}</span>
          {children &&
            children.split(" ").map((word, wordIndex, wordsArray) => (
              <span
                key={`word-${wordIndex}`}
                className="inline-block whitespace-nowrap"
                aria-hidden="true"
              >
                {word.split("").map((char, charIndex) => (
                  <motion.span
                    key={`char-${wordIndex}-${charIndex}`}
                    variants={itemVariants}
                    className="inline-block"
                    style={
                      letterSpacing ? { marginRight: letterSpacing } : undefined
                    }
                  >
                    {char}
                  </motion.span>
                ))}
                {wordIndex < wordsArray.length - 1 && (
                  <motion.span
                    key={`space-${wordIndex}`}
                    variants={itemVariants}
                    className="inline-block"
                  >
                    &nbsp;
                  </motion.span>
                )}
              </span>
            ))}
        </MotionTag>
      )}
    </AnimatePresence>
  )
}
