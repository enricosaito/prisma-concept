"use client"

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react"
import { cn } from "@/lib/utils"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

/** Readers who ask for less motion get a static card instead of a tilting one. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  )
}

export interface TiltCardProps {
  /** Maximum tilt angle in degrees */
  tiltLimit?: number
  /** Scale factor on hover */
  scale?: number
  /** Perspective distance in pixels */
  perspective?: number
  /** Tilt direction: "gravitate" follows cursor, "evade" tilts away */
  effect?: "gravitate" | "evade"
  /** Show a spotlight that follows the cursor on hover */
  spotlight?: boolean
  /**
   * Selector for an ancestor whose hover drives the card, instead of the card
   * alone — e.g. "a" for a cover inside a link that also holds the title.
   * Outside the card the pointer is clamped to its nearest edge, so the card
   * leans toward the cursor without going past `tiltLimit`.
   */
  hoverArea?: string
  /** Additional class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
  /** Card content */
  children?: React.ReactNode
}

export function TiltCard({
  tiltLimit = 15,
  scale = 1.05,
  perspective = 1200,
  effect = "evade",
  spotlight = true,
  hoverArea,
  className,
  style,
  children,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  )
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const dir = effect === "evade" ? -1 : 1

  const handlePointerMove = useCallback(
    (e: { clientX: number; clientY: number }) => {
      const el = cardRef.current
      if (!el || reducedMotion) return
      const rect = el.getBoundingClientRect()
      const clamp = (v: number) => Math.min(1, Math.max(0, v))
      const px = clamp((e.clientX - rect.left) / rect.width)
      const py = clamp((e.clientY - rect.top) / rect.height)
      const xRot = (py - 0.5) * (tiltLimit * 2) * dir
      const yRot = (px - 0.5) * -(tiltLimit * 2) * dir
      setTransform(
        `perspective(${perspective}px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(${scale}, ${scale}, ${scale})`
      )
      if (spotlight) {
        setSpotlightPos({ x: px * 100, y: py * 100 })
      }
    },
    [tiltLimit, scale, perspective, dir, spotlight, reducedMotion]
  )

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handlePointerLeave = useCallback(() => {
    setTransform(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    )
    setIsHovered(false)
  }, [perspective])

  useEffect(() => {
    const area = hoverArea ? cardRef.current?.closest(hoverArea) : null
    if (!area) return
    const move = (e: Event) => handlePointerMove(e as PointerEvent)
    area.addEventListener("pointerenter", handlePointerEnter)
    area.addEventListener("pointermove", move)
    area.addEventListener("pointerleave", handlePointerLeave)
    return () => {
      area.removeEventListener("pointerenter", handlePointerEnter)
      area.removeEventListener("pointermove", move)
      area.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [hoverArea, handlePointerEnter, handlePointerMove, handlePointerLeave])

  // With a hover area the ancestor's listeners cover the card too.
  const own = hoverArea
    ? {}
    : {
        onPointerEnter: handlePointerEnter,
        onPointerMove: handlePointerMove,
        onPointerLeave: handlePointerLeave,
      }

  return (
    <div
      ref={cardRef}
      {...own}
      className={cn(
        "relative overflow-hidden will-change-transform",
        className
      )}
      style={{
        transform,
        transition: "transform 0.2s ease-out",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
      {spotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          style={{ opacity: isHovered ? 1 : 0, transition: "opacity 0.3s" }}
        >
          <div
            className="absolute h-[200%] w-[200%] rounded-full opacity-100 dark:opacity-50"
            style={{
              left: `${spotlightPos.x}%`,
              top: `${spotlightPos.y}%`,
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 40%)",
            }}
          />
        </div>
      )}
    </div>
  )
}
