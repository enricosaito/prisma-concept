"use client"

import { Dialog } from "@base-ui/react/dialog"
import { RiCloseLine } from "@remixicon/react"

import { Highlight } from "@/components/highlight"
import { SubscribeForm } from "@/components/subscribe-form"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { navCta } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * O convite para assinar, numa janela em vez de uma página.
 *
 * Substitui /assinar. Com uma carta publicada, mandar o leitor para outra
 * página só para digitar um e-mail cobrava uma navegação por um campo — e a
 * página ficava com três blocos de argumento em volta de um input.
 *
 * O texto é do autor, escrito para esta janela. Ele NÃO é o `site.description`
 * e não deve ser trocado por ele: aquele é a descrição canônica que vai para a
 * aba do navegador, para o cartão de compartilhamento e para a seção "Por quê?"
 * da home, e descreve a publicação. Este aqui vende a assinatura, que é outro
 * trabalho. Os dois divergem de propósito.
 */
function SubscribeDialog({
  className,
  size,
}: {
  className?: string
  size?: "default" | "sm" | "lg"
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={<RainbowButton size={size} />}
        className={className}
      >
        {navCta.label}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm",
            "transition-opacity duration-200 ease-snappy",
            "data-ending-style:opacity-0 data-starting-style:opacity-0",
            "motion-reduce:transition-none"
          )}
        />

        {/* O Viewport é só o container que posiciona; a rolagem fica nele para
          que uma janela mais alta que a tela role por dentro em vez de vazar. */}
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-5">
          <Dialog.Popup
            className={cn(
              "relative w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-2xl sm:p-8",
              "transition-all duration-200 ease-snappy",
              "data-ending-style:scale-95 data-ending-style:opacity-0",
              "data-starting-style:scale-95 data-starting-style:opacity-0",
              "motion-reduce:transition-none motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100"
            )}
          >
            <Dialog.Close
              aria-label="Fechar"
              className="absolute top-4 right-4 rounded-sm p-1.5 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <RiCloseLine className="size-5" />
            </Dialog.Close>

            <Dialog.Title className="font-heading text-2xl leading-tight font-medium text-balance sm:text-3xl">
              Assine a <Highlight>Prisma</Highlight>, grátis
            </Dialog.Title>

            {/* Dois parágrafos, então o Description renderiza uma <div>: o
                padrão dele é um <p>, e <p> dentro de <p> é HTML inválido —
                o navegador fecha o primeiro sozinho e o layout quebra. */}
            <Dialog.Description
              render={<div />}
              className="mt-4 space-y-3 text-sm leading-relaxed text-pretty text-muted-foreground"
            >
              <p>
                PRISMA é uma carta semanal onde nos aprofundamos sobre diversos
                assuntos em filosofia, arte, tecnologia, que vão te fazer ter
                melhores ideias e ser um pensador mais afiado.
              </p>
              <p>
                Você vai receber gratuitamente uma carta toda semana sobre o
                futuro, a mente e a internet.
              </p>
            </Dialog.Description>

            <SubscribeForm className="mt-6" />
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { SubscribeDialog }
