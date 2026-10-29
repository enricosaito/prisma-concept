"use client"

import { Dialog } from "@base-ui/react/dialog"
import { RiCloseLine } from "@remixicon/react"

import { Highlight } from "@/components/highlight"
import { SubscribeForm } from "@/components/subscribe-form"
import { Button } from "@/components/ui/button"
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
 *
 * O gatilho é o Button liso, sem o arco-íris: na barra ele fica sempre à
 * vista, e o brilho animado ali competia com a leitura. O arco-íris segue no
 * "Assinar" do formulário, que é onde a assinatura de fato acontece.
 */
function SubscribeDialog({ className }: { className?: string }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button />} className={className}>
        {/* O Button centra a caixa do texto, e com a Literata isso já põe a
            tinta das maiúsculas no meio. Mas "Newsletter" é quase todo caixa
            baixa, cujo centro fica ~2px abaixo, e a palavra lia baixa. Um
            pixel acima divide a diferença entre os dois centros. O <span> é
            item flex, então o `translate` vale nele. */}
        <span className="-translate-y-px">{navCta.label}</span>
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
              "relative w-full max-w-lg border border-border bg-background p-6 shadow-2xl sm:p-8",
              "transition-all duration-200 ease-snappy",
              "data-ending-style:scale-95 data-ending-style:opacity-0",
              "data-starting-style:scale-95 data-starting-style:opacity-0",
              "motion-reduce:transition-none motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100"
            )}
          >
            <Dialog.Close
              aria-label="Fechar"
              className="absolute top-4 right-4 p-1.5 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <RiCloseLine className="size-5" />
            </Dialog.Close>

            <Dialog.Title className="font-heading text-2xl leading-tight font-medium text-balance sm:text-3xl">
              Assine a <Highlight>Prisma</Highlight>, de graça
            </Dialog.Title>

            {/* Dois parágrafos, então o Description renderiza uma <div>: o
                padrão dele é um <p>, e <p> dentro de <p> é HTML inválido —
                o navegador fecha o primeiro sozinho e o layout quebra. */}
            <Dialog.Description
              render={<div />}
              className="mt-4 space-y-3 text-sm leading-relaxed text-pretty text-muted-foreground"
            >
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
