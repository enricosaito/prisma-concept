"use client"

import { useMemo, type CSSProperties } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

interface LightRaysProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
  count?: number
  color?: string
  blur?: number
  speed?: number
  length?: string
  /**
   * Blend mode for each ray. `screen` only lightens, so it is invisible on a
   * pale ground — use `multiply` on light themes and `screen` on dark ones.
   */
  blend?: CSSProperties["mixBlendMode"]
  /** Change to reshuffle the ray layout; same seed always gives same rays. */
  seed?: number
}

/** mulberry32 — small, fast, and deterministic. */
function makeRandom(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type LightRay = {
  id: string
  left: number
  rotate: number
  width: number
  swing: number
  delay: number
  duration: number
  intensity: number
}

const createRays = (count: number, cycle: number, seed: number): LightRay[] => {
  if (count <= 0) return []

  // Seeded rather than Math.random: the rays can then be built during render
  // (no setState-in-effect) and the server and client agree on the layout.
  const random = makeRandom(seed)

  return Array.from({ length: count }, (_, index) => {
    const left = 8 + random() * 84
    const rotate = -28 + random() * 56
    const width = 160 + random() * 160
    const swing = 0.8 + random() * 1.8
    const delay = random() * cycle
    const duration = cycle * (0.75 + random() * 0.5)
    const intensity = 0.6 + random() * 0.5

    return {
      id: `${index}-${Math.round(left * 10)}`,
      left,
      rotate,
      width,
      swing,
      delay,
      duration,
      intensity,
    }
  })
}

const Ray = ({
  left,
  rotate,
  width,
  swing,
  delay,
  duration,
  intensity,
}: LightRay) => {
  return (
    <motion.div
      className="pointer-events-none absolute -top-[12%] left-[var(--ray-left)] h-[var(--light-rays-length)] w-[var(--ray-width)] origin-top -translate-x-1/2 rounded-full bg-linear-to-b from-[color-mix(in_srgb,var(--light-rays-color)_70%,transparent)] to-transparent opacity-0 [mix-blend-mode:var(--light-rays-blend,screen)] blur-[var(--light-rays-blur)]"
      style={
        {
          "--ray-left": `${left}%`,
          "--ray-width": `${width}px`,
        } as CSSProperties
      }
      initial={{ rotate: rotate }}
      animate={{
        opacity: [0, intensity, 0],
        rotate: [rotate - swing, rotate + swing, rotate - swing],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
        repeatDelay: duration * 0.1,
      }}
    />
  )
}

export function LightRays({
  className,
  style,
  count = 7,
  color = "rgba(160, 210, 255, 0.2)",
  blur = 36,
  speed = 14,
  length = "70vh",
  blend,
  seed = 1,
  ref,
  ...props
}: LightRaysProps) {
  const cycleDuration = Math.max(speed, 0.1)
  const rays = useMemo(
    () => createRays(count, cycleDuration, seed),
    [count, cycleDuration, seed]
  )

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-0 isolate overflow-hidden rounded-[inherit]",
        className
      )}
      style={
        {
          "--light-rays-color": color,
          "--light-rays-blend": blend,
          "--light-rays-blur": `${blur}px`,
          "--light-rays-length": length,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={
            {
              background:
                "radial-gradient(circle at 20% 15%, color-mix(in srgb, var(--light-rays-color) 45%, transparent), transparent 70%)",
            } as CSSProperties
          }
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={
            {
              background:
                "radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--light-rays-color) 35%, transparent), transparent 75%)",
            } as CSSProperties
          }
        />
        {rays.map((ray) => (
          <Ray key={ray.id} {...ray} />
        ))}
      </div>
    </div>
  )
}
