"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { RiCloseLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NAME_MAX_LENGTH, validateName } from "@/lib/comments/validation"
import { cn } from "@/lib/utils"

/**
 * PROTÓTIPO. O passo de entrar, simulado, no momento em que o leitor tenta
 * publicar — e só então.
 *
 * Pede um nome e nada mais. Diz com todas as letras que é uma simulação: não
 * há conta, verificação nem e-mail. Quando houver um provedor de verdade, este
 * diálogo sai inteiro; o rascunho e o fluxo de publicar ficam como estão.
 */
function PrototypeSignInDialog({
  open,
  draft,
  onComplete,
  onCancel,
}: {
  open: boolean
  draft: string
  onComplete: (name: string) => void
  onCancel: () => void
}) {
  const [name, setName] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const errorId = React.useId()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const problem = validateName(name)
    setError(problem)
    if (!problem) onComplete(name)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel()
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            // 60%: the page under it is often already dark (the dark theme),
            // and 40% left the panel floating on barely-dimmed text.
            "fixed inset-0 z-50 bg-black/60",
            "transition-opacity duration-200 ease-snappy data-ending-style:opacity-0 data-starting-style:opacity-0",
            "motion-reduce:transition-none"
          )}
        />
        <Dialog.Popup
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
            "border border-border bg-background p-6 text-foreground sm:p-8",
            "transition-[opacity,scale] duration-200 ease-snappy",
            "data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0",
            "motion-reduce:transition-none"
          )}
        >
          <Dialog.Close
            aria-label="Fechar"
            className="absolute top-3 right-3 p-2 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <RiCloseLine className="size-5" />
          </Dialog.Close>

          <p className="font-label text-[0.7rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
            Publicar comentário
          </p>
          <Dialog.Title className="mt-3 font-heading text-xl font-medium">
            Como você quer assinar?
          </Dialog.Title>

          <form onSubmit={onSubmit} noValidate className="mt-6">
            <label
              htmlFor="prototype-reader-name"
              className="font-label text-xs font-medium tracking-wide text-foreground"
            >
              Nome
            </label>
            <Input
              id="prototype-reader-name"
              autoComplete="name"
              maxLength={NAME_MAX_LENGTH}
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (error) setError(null)
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className="mt-2 h-10 rounded-none px-3"
            />
            {error ? (
              <p
                id={errorId}
                role="alert"
                className="mt-2 text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}

            {/* O que vai ser publicado, num balão: o leitor assina sabendo o
                quê. Cortado em cinco linhas — é um lembrete, não o texto. */}
            {draft.trim() ? (
              <figure className="mt-6">
                <figcaption className="sr-only">Seu comentário</figcaption>
                <blockquote className="relative rounded-2xl rounded-bl-sm bg-foreground/5 px-4 py-3">
                  <p className="line-clamp-5 text-sm leading-relaxed break-words whitespace-pre-line text-foreground/85">
                    “{draft.trim()}”
                  </p>
                </blockquote>
              </figure>
            ) : null}

            {/* Quiet, like "Agora não" on the subscribe screen: one loud
                button per screen. */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-x-6 gap-y-3">
              <Dialog.Close className="text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
                Voltar ao rascunho
              </Dialog.Close>
              <Button
                type="submit"
                className="h-10 bg-clip-border px-5 text-xs"
              >
                Continuar e publicar
              </Button>
            </div>
          </form>

          {/* Enquanto isto for simulação, o diálogo diz — em letra pequena, no
              pé, para não atravessar o caminho de quem está publicando. */}
          <Dialog.Description className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Protótipo: nenhuma conta é criada e nada é verificado. O comentário
            fica salvo só neste navegador.
          </Dialog.Description>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { PrototypeSignInDialog }
