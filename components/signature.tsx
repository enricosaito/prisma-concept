"use client"

import { useEffect, useId, useState } from "react"
import { motion } from "motion/react"
import { parse as parseFont } from "opentype.js"

type SignatureGlyph = {
  advanceWidth?: number
  getPath: (
    x: number,
    y: number,
    fontSize: number
  ) => {
    toPathData: (decimalPlaces?: number) => string
    getBoundingBox: () => { x1: number; y1: number; x2: number; y2: number }
  }
}

type SignatureFont = {
  unitsPerEm: number
  charToGlyph: (char: string) => SignatureGlyph
}

type Box = { x: number; y: number; width: number; height: number }

const SVG_HEIGHT = 100
const PATH_DELAY_STEP = 0.2
const OPACITY_DELAY_OFFSET = 0.01
const fontCache = new Map<string, SignatureFont>()

function getFontCacheKey(path: string): string {
  try {
    return new URL(path, window.location.origin).href
  } catch {
    return path
  }
}

function getPathTransition(index: number, duration: number, delay: number) {
  const pathDelay = delay + index * PATH_DELAY_STEP

  return {
    pathLength: {
      delay: pathDelay,
      duration,
      ease: "easeInOut" as const,
    },
    opacity: {
      delay: pathDelay + OPACITY_DELAY_OFFSET,
      duration: 0.01,
    },
  }
}

async function loadFontFromPaths(fontPaths: string[]): Promise<SignatureFont> {
  for (const path of fontPaths) {
    try {
      const cacheKey = getFontCacheKey(path)
      const cachedFont = fontCache.get(cacheKey)

      if (cachedFont) {
        return cachedFont
      }

      const response = await fetch(path)

      if (!response.ok) {
        continue
      }

      const fontBuffer = await response.arrayBuffer()
      const font = parseFont(fontBuffer) as SignatureFont
      fontCache.set(cacheKey, font)

      return font
    } catch {
      // Try next path
    }
  }

  throw new Error(
    `Font could not be loaded from the provided path${fontPaths.length === 1 ? "" : "s"}: ${fontPaths.join(", ")}`
  )
}

async function buildSignaturePaths({
  text,
  fontSize,
  baseline,
  horizontalPadding,
  fontSrc,
}: {
  text: string
  fontSize: number
  baseline: number
  horizontalPadding: number
  fontSrc: string[]
}): Promise<{ paths: string[]; box: Box }> {
  const font = await loadFontFromPaths(fontSrc)

  let x = horizontalPadding
  const nextPaths: string[] = []

  // Union of the glyph outlines. A script face throws ascenders, descenders and
  // swashes well past the em box, so the viewBox has to follow the actual ink —
  // an SVG clips to its viewBox, and a fixed box silently cut this signature.
  let x1 = Infinity
  let y1 = Infinity
  let x2 = -Infinity
  let y2 = -Infinity

  for (const char of text) {
    const glyph = font.charToGlyph(char)
    const path = glyph.getPath(x, baseline, fontSize)
    nextPaths.push(path.toPathData(3))

    const bb = path.getBoundingBox()
    if (Number.isFinite(bb.x1)) {
      x1 = Math.min(x1, bb.x1)
      y1 = Math.min(y1, bb.y1)
      x2 = Math.max(x2, bb.x2)
      y2 = Math.max(y2, bb.y2)
    }

    const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm
    x += advanceWidth * (fontSize / font.unitsPerEm)
  }

  // Nothing measurable (all-whitespace text): fall back to the advance run.
  if (!Number.isFinite(x1)) {
    return {
      paths: nextPaths,
      box: { x: 0, y: 0, width: x + horizontalPadding, height: fontSize },
    }
  }

  // Room for the 2px outline stroke, which is drawn centred on the outline.
  const pad = fontSize * 0.06

  return {
    paths: nextPaths,
    box: {
      x: x1 - pad,
      y: y1 - pad,
      width: x2 - x1 + pad * 2,
      height: y2 - y1 + pad * 2,
    },
  }
}

function renderMotionPaths({
  paths,
  stroke,
  strokeWidth,
  strokeLinecap,
  strokeLinejoin,
  duration,
  delay,
}: {
  paths: string[]
  stroke: string
  strokeWidth: number
  strokeLinecap: "round" | "butt"
  strokeLinejoin: "round"
  duration: number
  delay: number
}) {
  return paths.map((d, index) => (
    <motion.path
      key={index}
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      variants={PATH_VARIANTS}
      transition={getPathTransition(index, duration, delay)}
      vectorEffect="non-scaling-stroke"
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
    />
  ))
}

const PATH_VARIANTS = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
}

interface SignatureProps {
  text?: string
  color?: string
  fontSize?: number
  duration?: number
  delay?: number
  className?: string
  inView?: boolean
  once?: boolean
  /** Font files to try, in order. Must be an .otf/.ttf served from /public. */
  fontSrc?: string | string[]
  /** Rendered instead of the stroked SVG when no font file could be loaded. */
  fallback?: React.ReactNode
}

export function Signature({
  text = "Signature",
  color = "#000",
  fontSize = 14,
  duration = 1.5,
  delay = 0,
  className,
  inView = false,
  once = true,
  fontSrc = "/LastoriaBoldRegular.otf",
  fallback = null,
}: SignatureProps) {
  const [paths, setPaths] = useState<string[]>([])
  const [failed, setFailed] = useState(false)
  const [box, setBox] = useState<Box>({ x: 0, y: 0, width: 300, height: 100 })
  const horizontalPadding = fontSize * 0.1
  const topMargin = Math.max(5, (SVG_HEIGHT - fontSize) / 2)
  const baseline = Math.min(SVG_HEIGHT - 5, topMargin + fontSize)
  const maskId = `signature-reveal-${useId().replace(/:/g, "")}`

  const fontSources = Array.isArray(fontSrc) ? fontSrc : [fontSrc]
  const fontKey = fontSources.join(",")

  useEffect(() => {
    let isCancelled = false

    async function loadSignaturePaths() {
      try {
        const { paths: nextPaths, box: nextBox } = await buildSignaturePaths({
          text,
          fontSize,
          baseline,
          horizontalPadding,
          fontSrc: fontKey.split(","),
        })

        if (isCancelled) {
          return
        }

        setPaths(nextPaths)
        setBox(nextBox)
        setFailed(false)
      } catch {
        if (isCancelled) {
          return
        }

        setPaths([])
        setBox({
          x: 0,
          y: 0,
          width: text.length * fontSize * 0.6,
          height: fontSize,
        })
        setFailed(true)
      }
    }

    void loadSignaturePaths()

    return () => {
      isCancelled = true
    }
  }, [text, fontSize, baseline, horizontalPadding, fontKey])

  // Without the font file the SVG would be silently blank, so show something.
  if (failed) {
    return <>{fallback}</>
  }

  return (
    <motion.svg
      key={paths.length}
      width={box.width}
      height={box.height}
      viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
      fill="none"
      className={className}
      initial="hidden"
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : "visible"}
      viewport={{ once }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {renderMotionPaths({
            paths,
            stroke: "white",
            strokeWidth: fontSize * 0.22,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            duration,
            delay,
          })}
        </mask>
      </defs>

      {renderMotionPaths({
        paths,
        stroke: color,
        strokeWidth: 2,
        strokeLinecap: "butt",
        strokeLinejoin: "round",
        duration,
        delay,
      })}

      <g mask={`url(#${maskId})`}>
        {paths.map((d, index) => (
          <path key={index} d={d} fill={color} />
        ))}
      </g>
    </motion.svg>
  )
}
