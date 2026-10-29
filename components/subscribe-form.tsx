"use client"

import * as React from "react"
import { RiCheckLine } from "@remixicon/react"

import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading" | "success" | "error"

/**
 * Shared by the field and the "Assinar" button so the two sit flush. Square,
 * like every button on the site: a rounded field beside a square button would
 * read as two different systems.
 */
const FIELD = "h-10 rounded-none"

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
        {/* Parado. Aqui já houve uma ShineBorder, um brilho correndo pela
            borda, e o "Assinar" era o arco-íris animado: no lugar exato em que
            se pede o e-mail do leitor, os dois liam como truque de startup e
            custavam confiança. Firmeza aqui é não se mexer. */}
        <div className="sm:flex-1">
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
        <Button
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
        </Button>
      </form>

      {/* Nothing sits under the field at rest — the blocks that use this form
          already say what subscribing gets you, so a helper line here only
          repeated them. The slot still belongs to the error. */}
      {status === "error" ? (
        <p role="alert" className="mt-2.5 text-sm text-destructive">
          {message}
        </p>
      ) : null}
    </div>
  )
}

export { SubscribeForm }
