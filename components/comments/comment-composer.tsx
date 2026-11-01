"use client"

import * as React from "react"

import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import type { Reader } from "@/lib/comments/types"
import {
  COMMENT_MAX_LENGTH,
  COUNTER_THRESHOLD,
  validateBody,
} from "@/lib/comments/validation"
import { cn } from "@/lib/utils"

/** What a publish attempt came to. `cancelled` is the reader closing the
 *  sign-in step: not an error, and the draft stays. */
type PublishResult = "published" | "cancelled"

type Status = "idle" | "submitting" | "published" | "error"

/**
 * The draft lives in sessionStorage as well as in state, per letter. A real
 * sign-in may leave the page — a magic link, an OAuth redirect — and the
 * reader has to come back to the words they wrote, not an empty box.
 */
function useDraft(essayId: string) {
  const key = `prisma:comment-draft:v1:${essayId}`
  const [draft, setDraftState] = React.useState("")

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = window.sessionStorage.getItem(key)
        if (saved) setDraftState(saved)
      } catch {}
    })
    return () => cancelAnimationFrame(frame)
  }, [key])

  const setDraft = React.useCallback(
    (value: string) => {
      setDraftState(value)
      try {
        if (value) window.sessionStorage.setItem(key, value)
        else window.sessionStorage.removeItem(key)
      } catch {}
    },
    [key]
  )

  return [draft, setDraft] as const
}

/**
 * Write first, sign in at the moment of publishing. The field is open to
 * anyone; `onPublish` decides whether the reader has to identify themselves
 * and handles that, so this component knows nothing about authentication.
 */
function CommentComposer({
  essayId,
  reader,
  onPublish,
  onSignOut,
}: {
  essayId: string
  reader: Reader | null
  onPublish: (body: string) => Promise<PublishResult>
  onSignOut: () => void
}) {
  const [draft, setDraft] = useDraft(essayId)
  const [status, setStatus] = React.useState<Status>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const fieldId = React.useId()
  const errorId = React.useId()
  const counterId = React.useId()

  const length = draft.trim().length
  const hasText = length > 0
  const showCounter = length >= COMMENT_MAX_LENGTH * COUNTER_THRESHOLD
  const over = length > COMMENT_MAX_LENGTH

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // A second Enter or click while one is on its way does nothing.
    if (status === "submitting") return

    const problem = validateBody(draft)
    if (problem) {
      setError(problem)
      setStatus("error")
      return
    }

    setError(null)
    setStatus("submitting")
    try {
      const result = await onPublish(draft)
      if (result === "published") {
        setDraft("")
        setStatus("published")
      } else {
        setStatus("idle")
      }
    } catch {
      setError(
        "Não foi possível publicar. Seu texto continua aqui; tente de novo."
      )
      setStatus("error")
    }
  }

  const describedBy =
    [error ? errorId : null, showCounter ? counterId : null]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor={fieldId} className="sr-only">
        Seu comentário
      </label>
      <textarea
        id={fieldId}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value)
          if (status === "error" || status === "published") {
            setStatus("idle")
            setError(null)
          }
        }}
        onKeyDown={(event) => {
          // ⌘/Ctrl+Enter publica, como em quase todo campo de texto longo.
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
          }
        }}
        rows={4}
        placeholder="Escreva um comentário…"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "block [field-sizing:content] max-h-[60vh] min-h-32 w-full resize-y rounded-none border border-input bg-transparent px-4 py-3",
          "text-base leading-relaxed text-foreground placeholder:text-muted-foreground",
          "transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "aria-invalid:border-destructive dark:bg-input/30",
          "motion-reduce:transition-none"
        )}
      />

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2.5 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      {/* `min-h-10`, a altura do botão: a linha não pula quando ele surge. */}
      <div className="mt-3 flex min-h-10 flex-wrap items-center justify-between gap-x-4 gap-y-3">
        {reader ? (
          <p className="text-sm text-muted-foreground">
            Publicando como{" "}
            <span className="font-medium text-foreground">{reader.name}</span>
            {" · "}
            <button
              type="button"
              onClick={onSignOut}
              className="underline decoration-accent underline-offset-4 transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Trocar
            </button>
          </p>
        ) : null}

        <div className="ml-auto flex items-center gap-4">
          {showCounter ? (
            <span
              id={counterId}
              className={cn(
                "font-label text-xs tabular-nums",
                over ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {length.toLocaleString("pt-BR")} /{" "}
              {COMMENT_MAX_LENGTH.toLocaleString("pt-BR")}
              <span className="sr-only"> caracteres</span>
            </span>
          ) : null}
          {/* Só aparece quando há o que publicar: com a caixa vazia, um botão
              à espera pede uma ação que ainda não existe. */}
          {hasText || status === "submitting" ? (
            <Button
              type="submit"
              disabled={status === "submitting"}
              className={cn(
                "h-10 bg-clip-border px-6 text-xs",
                "animate-in duration-200 fade-in motion-reduce:animate-none"
              )}
            >
              {status === "submitting" ? (
                <>
                  <Spinner size="sm" />
                  Publicando
                </>
              ) : (
                "Publicar"
              )}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Sempre no DOM, para que o leitor de tela anuncie quando o texto
          muda; o "Publicado" visível é o mesmo nó. */}
      <p
        aria-live="polite"
        className="mt-2 min-h-5 text-sm text-muted-foreground"
      >
        {status === "published" ? "Comentário publicado." : ""}
      </p>
    </form>
  )
}

export { CommentComposer }
export type { PublishResult }
