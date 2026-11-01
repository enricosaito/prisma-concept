import Link from "next/link"
import { RiLockLine } from "@remixicon/react"

import { PrismaIcon } from "@/components/prisma-icon"
import { SeaEdge } from "@/components/sea-edge"
import { SubscribeDialog } from "@/components/subscribe-dialog"
import { Wordmark } from "@/components/wordmark"
import { formatDate, formatDateShort, formatIssue } from "@/lib/letters/format"
import type { LetterMeta } from "@/lib/letters/types"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

/** O id que a barra observa para saber se o masthead ainda está à vista. */
export const MASTHEAD_ID = "masthead"

/** Etiqueta: Archivo, caixa alta, pequena e espaçada — a voz das legendas. */
const LABEL =
  "font-label text-[0.65rem] font-semibold tracking-[0.18em] uppercase sm:text-[0.7rem] sm:tracking-[0.22em]"

const LINK =
  "rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"

/**
 * O masthead da home, como a capa de um jornal: uma faixa de serviço no alto,
 * o nome grande no centro com a linha que diz o que a publicação é, e os
 * links por baixo, separados por pontos.
 *
 * Só na home. Nas cartas e no resto do site fica a barra compacta: um
 * masthead deste tamanho empurraria o título da carta para baixo da dobra.
 * Aqui ele rola com a página, e a barra compacta só aparece quando ele sai de
 * vista (ver site-header.tsx).
 *
 * No azul da barra, nos dois temas, e termina na mesma onda que pende dela.
 */
function HomeMasthead({ latest }: { latest?: LetterMeta }) {
  return (
    <div id={MASTHEAD_ID} className="relative">
      <div className="dark navy bg-background text-foreground">
        {/* A faixa de serviço: a carta mais recente à esquerda, a pena no
            meio, a assinatura à direita. Sem a data de hoje, como no jornal: a
            página é gerada no build, e a data envelheceria até o próximo.
            `1fr auto 1fr` centra a pena seja qual for a largura dos lados. */}
        <div className="border-b border-border">
          <div
            className={cn(
              LABEL,
              "mx-auto grid h-10 max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:h-11 sm:px-8"
            )}
          >
            {latest ? (
              <Link
                href={`/cartas/${latest.slug}`}
                className={cn(LINK, "justify-self-start whitespace-nowrap")}
              >
                Nº {formatIssue(latest.issue)}
                <span aria-hidden className="mx-2 opacity-60">
                  ·
                </span>
                {/* No celular a data curta, para a faixa caber numa linha. */}
                <time dateTime={latest.date}>
                  <span className="sm:hidden">
                    {formatDateShort(latest.date)}
                  </span>
                  <span className="hidden sm:inline">
                    {formatDate(latest.date)}
                  </span>
                </time>
              </Link>
            ) : (
              <span />
            )}
            <PrismaIcon
              bare
              className="size-5 text-muted-foreground sm:size-6"
            />
            <SubscribeDialog
              className={cn(LINK, "justify-self-end text-right uppercase")}
            >
              Assine — grátis
            </SubscribeDialog>
          </div>
        </div>

        <div className="mx-auto flex max-w-5xl flex-col items-center px-5 pt-10 pb-8 text-center sm:px-8 sm:pt-14 sm:pb-10">
          {/* O h1 da home é a lista de publicações, abaixo; o nome aqui é a
              marca, não o título da página. */}
          <p className="leading-none">
            <Wordmark className="block text-[clamp(4rem,19vw,9.5rem)] leading-[0.9] tracking-normal" />
          </p>
          <p className="mt-4 max-w-[34ch] font-heading text-base text-pretty text-muted-foreground italic sm:mt-5 sm:max-w-[46ch] sm:text-lg">
            {site.descriptor}
          </p>

          {/* Cinco destinos. Biblioteca (literatura e não ficção) e Galeria
              (visuais e obras de arte) ainda não existem: ficam à vista, sem
              link, para anunciar o que vem, em vez de levar a uma página
              vazia. */}
          <nav aria-label="Seções" className="mt-8 sm:mt-10">
            <ul
              className={cn(
                LABEL,
                // Mais justo no celular, e sem os pontos. Cinco não cabem numa
                // linha: a largura limitada parte em três e dois, e não em
                // quatro e um órfão.
                "flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5 max-sm:max-w-68 max-sm:text-[0.6rem] max-sm:tracking-[0.12em] sm:gap-x-5"
              )}
            >
              <NavItem>
                <Link href="#publicacoes" className={LINK}>
                  Publicações
                </Link>
              </NavItem>
              <NavItem>
                <EmBreve>Biblioteca</EmBreve>
              </NavItem>
              <NavItem>
                <EmBreve>Galeria</EmBreve>
              </NavItem>
              <NavItem>
                <Link href="#sobre" className={LINK}>
                  Sobre nós
                </Link>
              </NavItem>
              <NavItem last>
                <SubscribeDialog className={cn(LINK, "uppercase")}>
                  Newsletter
                </SubscribeDialog>
              </NavItem>
            </ul>
          </nav>
        </div>
      </div>
      <SeaEdge flip className="absolute inset-x-0 top-full -mt-px" />
    </div>
  )
}

/**
 * Uma seção que ainda não existe: à vista, apagada e sem link.
 *
 * Ao passar o mouse (ou focar pelo teclado, ou tocar no celular) ela apaga
 * mais um pouco — recua, em vez de acender como um link — e um selo com um
 * cadeado e "Em breve" aparece embaixo. O selo é absoluto, para não empurrar
 * os vizinhos da linha.
 *
 * Focável (`tabIndex`) para que quem navega pelo teclado também leia o aviso;
 * o "Em breve" fica no nome acessível pelo texto do próprio selo.
 */
function EmBreve({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-disabled
      tabIndex={0}
      className="group/breve relative cursor-not-allowed rounded-sm text-muted-foreground/45 transition-colors outline-none hover:text-muted-foreground/25 focus-visible:text-muted-foreground/25 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {children}
      <span
        className={cn(
          "pointer-events-none absolute top-full left-1/2 mt-2 flex -translate-x-1/2 items-center gap-1 rounded-md border border-border bg-card px-2 py-1 whitespace-nowrap text-muted-foreground shadow-sm",
          "opacity-0 transition-opacity duration-150 group-hover/breve:opacity-100 group-focus-visible/breve:opacity-100"
        )}
      >
        <RiLockLine aria-hidden className="size-3" />
        Em breve
      </span>
    </span>
  )
}

function NavItem({
  children,
  last,
}: {
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <li className="flex items-center sm:gap-x-5">
      {children}
      {last ? null : (
        <span aria-hidden className="hidden text-muted-foreground/45 sm:inline">
          ·
        </span>
      )}
    </li>
  )
}

export { HomeMasthead }
