"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"

type RingColor =
  | "muted"
  | "primary"
  | "secondary"
  | "destructive"
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "pink"
  | "orange"
  | "cyan"
  | "indigo"
  | "violet"
  | "rose"
  | "amber"
  | "lime"
  | "emerald"
  | "sky"
  | "slate"
  | "fuchsia"

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  ringColor?: RingColor
  containerClassName?: string
  /** Classes for the <input> itself (height, radius, padding). */
  inputClassName?: string
}

const ringColorMap: Record<RingColor, string> = {
  muted: "focus:ring-muted",
  primary: "focus:ring-primary",
  secondary: "focus:ring-secondary",
  destructive: "focus:ring-destructive",
  red: "focus:ring-red-600",
  blue: "focus:ring-blue-600",
  green: "focus:ring-green-600",
  yellow: "focus:ring-yellow-600",
  purple: "focus:ring-purple-600",
  pink: "focus:ring-pink-600",
  orange: "focus:ring-orange-600",
  cyan: "focus:ring-cyan-600",
  indigo: "focus:ring-indigo-600",
  violet: "focus:ring-violet-600",
  rose: "focus:ring-rose-600",
  amber: "focus:ring-amber-600",
  lime: "focus:ring-lime-600",
  emerald: "focus:ring-emerald-600",
  sky: "focus:ring-sky-600",
  slate: "focus:ring-slate-600",
  fuchsia: "focus:ring-fuchsia-600",
}

export function LabelInput({
  label = "",
  ringColor = "muted",
  containerClassName,
  inputClassName,
  className,
  type = "text",
  placeholder = "",
  ...props
}: LabelInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const isPasswordType = type === "password"
  const inputType = isPasswordType ? (isVisible ? "text" : "password") : type

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <div className={cn("group relative w-full", className, containerClassName)}>
      <input
        className={cn(
          "peer block h-10 w-full rounded-lg border border-input bg-transparent px-3.5 text-sm text-foreground outline-none autofill:shadow-[inset_0_0_0px_1000px_var(--color-background)] focus:ring-2",
          isPasswordType && "pr-9",
          ringColorMap[ringColor],
          inputClassName
        )}
        placeholder={placeholder}
        type={inputType}
        {...props}
      />
      {/* The floating label sits on top of the border, so its background has to
          match whatever surface the field is placed on. Override per-instance
          with `[--label-surface:var(--secondary)]` on the container. */}
      <label className="will pointer-events-none absolute inset-y-0 left-[7px] my-auto block h-fit origin-top-left -translate-y-[19px] scale-[.8] bg-[var(--label-surface,var(--background))] px-2 text-sm text-nowrap text-muted-foreground transition-transform duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-[19px] peer-focus:scale-[.8]">
        {label}
      </label>
      {isPasswordType && (
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  )
}

export default LabelInput
