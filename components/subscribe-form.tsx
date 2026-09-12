"use client"

import * as React from "react"
import { RiCheckLine } from "@remixicon/react"

import { Spinner } from "@/components/spinner"
import { Input } from "@/components/ui/input"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { ShineBorder } from "@/components/ui/shine-border"
import { SPECTRUM } from "@/lib/spectrum"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading" | "success" | "error"

/** Shared with the header CTA so the two "Assinar" buttons match. */
const FIELD = "h-10 rounded-[10px]"

function SubscribeForm({ className }: { className?: string }) {
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")
  const [message, setMessage] = React.useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "loading") return

    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = (await response.json()) as { message?: string }

      if (!response.ok) {
        setStatus("error")
        setMessage(data.message ?? "Não foi possível assinar. Tente de novo.")
        return
      }

      setStatus("success")
      setMessage(data.message ?? "Pronto! Você está na lista.")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("Não foi possível assinar. Verifique sua conexão.")
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-[10px] border border-accent/40 bg-accent/10 px-4 py-3.5",
          className
        )}
      >
        <RiCheckLine className="size-5 shrink-0 text-accent" />
        <p className="text-sm text-foreground">{message}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        {/* A placeholder is not an accessible name, so the field keeps a real
            label — just a visually hidden one. */}
        <label htmlFor="subscribe-email" className="sr-only">
          Seu e-mail
        </label>
        {/* ShineBorder is an absolutely-positioned mask-composite overlay, so
            the field needs a positioned wrapper carrying the same radius for
            its `rounded-[inherit]` to land on. */}
        <div className={cn("relative sm:flex-1", FIELD)}>
          <ShineBorder
            shineColor={[...SPECTRUM]}
            borderWidth={1}
            duration={14}
            className="rounded-[inherit]"
          />
          <Input
            id="subscribe-email"
            type="email"
            required
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={status === "error" || undefined}
            className={cn(FIELD, "w-full px-4")}
          />
        </div>
        <RainbowButton
          type="submit"
          disabled={status === "loading"}
          className={cn(FIELD, "w-full px-6 text-xs sm:w-auto")}
        >
          {status === "loading" ? (
            <>
              <Spinner size="sm" />
              Enviando
            </>
          ) : (
            "Assinar"
          )}
        </RainbowButton>
      </form>

      {status === "error" ? (
        <p role="alert" className="mt-2.5 text-sm text-destructive">
          {message}
        </p>
      ) : (
        <p className="mt-2.5 text-xs text-muted-foreground">
          Torne-se um leitor
        </p>
      )}
    </div>
  )
}

export { SubscribeForm }
