"use client"

import { Dialog } from "@base-ui/react/dialog"
import { RiArrowRightSLine, RiCloseLine } from "@remixicon/react"

import { PrismaIcon } from "@/components/prisma-icon"
import { SubscribeForm } from "@/components/subscribe-form"
import { Wordmark } from "@/components/wordmark"
import { Button } from "@/components/ui/button"
import { navCta } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * O convite para assinar, em tela cheia sobre a página atual — sem trocar de
 * rota, então "Agora não" devolve o leitor exatamente onde estava.
 *
 * Substitui /assinar. Com uma carta publicada, mandar o leitor para outra
 * página só para digitar um e-mail cobrava uma navegação por um campo — e a
 * página ficava com três blocos de argumento em volta de um input.
 *
 * O texto é do autor, escrito para esta tela: o logotipo e o lema, com ponto
 * final. Não é o `site.description` e não deve ser trocado por ele: aquele
 * descreve a publicação; aqui a marca fala por si.
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
        {/* A tela inteira, no mar: o convite toma a página em vez de flutuar
            numa caixa sobre ela, e não há fundo borrado porque não sobra
            página à vista. `dark navy` pinta o azul e o texto marfim nos dois
            temas, como a barra e o rodapé; a `sea-texture` traz as linhas da
            gravura subindo do pé da tela. A rolagem fica no Popup, para que um
            celular deitado role o convite em vez de cortá-lo.

            A textura vai num filho, e não no Popup: `.sea-texture` declara
            `position: relative`, e por ser CSS solto ela vence o `fixed` do
            Tailwind — o convite caía no fluxo, lá no pé da página. */}
        <Dialog.Popup
          className={cn(
            "dark navy fixed inset-0 z-50 overflow-y-auto bg-background text-foreground",
            "transition-opacity duration-300 ease-snappy",
            "data-ending-style:opacity-0 data-starting-style:opacity-0",
            "motion-reduce:transition-none"
          )}
        >
          <div className="sea-texture flex min-h-full flex-col">
            <Dialog.Close
              aria-label="Fechar"
              className="absolute top-4 right-4 p-2 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 sm:top-6 sm:right-6"
            >
              <RiCloseLine className="size-6" />
            </Dialog.Close>

            {/* `m-auto` centra na vertical quando cabe e deixa rolar do topo
              quando não cabe — `justify-center` cortaria o alto. */}
            <div className="m-auto flex w-full max-w-md flex-col items-center px-5 py-20 text-center">
              <PrismaIcon bare className="size-14 sm:size-16" />

              {/* O nome da publicação no logotipo, como a capa de uma
                  revista. Para o leitor de tela o título diz o que a tela é. */}
              <Dialog.Title className="mt-8 text-6xl leading-none font-normal sm:text-7xl">
                <span className="sr-only">Assine a </span>
                <Wordmark />
              </Dialog.Title>

              <Dialog.Description className="mt-5 font-heading text-lg text-pretty text-muted-foreground italic sm:text-xl">
                Aponte contra um mar de problemas.
              </Dialog.Description>

              <SubscribeForm className="mt-10 w-full text-left" />

              <p className="mt-4 text-xs text-muted-foreground">
                Inscrição gratuita. Cancele quando quiser.
              </p>

              <Dialog.Close className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
                Agora não
                <RiArrowRightSLine className="size-4" />
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { SubscribeDialog }
