"use client"

import * as React from "react"
import { RiCheckLine } from "@remixicon/react"

import { FlowButton } from "@/components/flow-button"
import { LabelInput } from "@/components/label-input"
import { Spinner } from "@/components/spinner"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading" | "success" | "error"

function SubscribeForm({
  className,
  /**
   * The surface the form sits on. The floating label paints over the input's
   * border, so it has to match the panel behind it.
   */
  surface = "background",
}: {
  className?: string
  surface?: "background" | "secondary"
}) {
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
          "flex items-center gap-3 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3.5",
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
        <LabelInput
          id="subscribe-email"
          label="Seu e-mail"
          type="email"
          required
          autoComplete="email"
          placeholder=" "
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={status === "error" || undefined}
          containerClassName={cn(
            "sm:flex-1",
            surface === "secondary" && "[--label-surface:var(--secondary)]"
          )}
          inputClassName="h-10 rounded-full px-4"
        />
        <FlowButton
          type="submit"
          size="lg"
          disabled={status === "loading"}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/85 sm:w-auto dark:bg-primary dark:hover:bg-primary/85"
        >
          {status === "loading" ? (
            <>
              <Spinner size="sm" />
              Enviando
            </>
          ) : (
            "Assinar"
          )}
        </FlowButton>
      </form>

      {status === "error" ? (
        <p role="alert" className="mt-2.5 text-sm text-destructive">
          {message}
        </p>
      ) : (
        <p className="mt-2.5 text-xs text-muted-foreground">
          Sem spam. Cancele quando quiser.
        </p>
      )}
    </div>
  )
}

export { SubscribeForm }
