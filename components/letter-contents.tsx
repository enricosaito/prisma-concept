"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type Section = { id: string; title: string; level: 2 | 3 }

/** Below this line from the top of the screen, a section counts as being read. */
const READING_LINE = 140

/**
 * O sumário da carta, como no Substack: à esquerda da coluna de leitura, só
 * os traços — um por título, o da seção que se está lendo mais longo e em
 * tinta cheia. No hover um fundo arredondado e leve aparece atrás deles, para
 * dizer que aquilo se clica.
 *
 * O clique abre um painel à parte, ao lado dos traços, com "Sumário" no topo e
 * os títulos em lista: os "## " rentes, os "### " recuados, cortados com
 * reticências quando não cabem. Os traços continuam à vista com ele aberto.
 * Escolher um título leva à seção e fecha o painel; Esc ou um clique fora
 * também fecham.
 *
 * Os títulos são lidos do DOM, e não do Markdown, para que o sumário liste
 * exatamente o que a página mostra, com os ids que LetterBody deu a eles. Os
 * `---` não contam: são só fios.
 *
 * Só a partir do lg: abaixo disso não há margem à esquerda da coluna de
 * leitura, e o painel cobriria o texto. Com menos de duas seções não há o que
 * navegar, e nada aparece.
 */
function LetterContents() {
  const [sections, setSections] = React.useState<Section[]>([])
  const [active, setActive] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const navRef = React.useRef<HTMLElement>(null)
  const toggleRef = React.useRef<HTMLButtonElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const panelId = React.useId()

  React.useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(
        ".prose-letter :is(h2, h3)[id]"
      )
    )
    let frame = 0
    const read = () => {
      frame = 0
      // O último título que já passou da linha de leitura. Antes do
      // primeiro, nenhum.
      let current: string | null = null
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= READING_LINE) current = h.id
        else break
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    // Um quadro depois da montagem: o sumário é decoração do texto que já
    // está na tela, e não precisa entrar no mesmo render.
    frame = requestAnimationFrame(() => {
      setSections(
        headings.map((h) => ({
          id: h.id,
          title: h.textContent?.trim() ?? "",
          level: h.tagName === "H3" ? 3 : 2,
        }))
      )
      read()
    })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Aberto: o foco vai para a seção atual (ou a primeira), e Esc ou um clique
  // fora fecham. Esc devolve o foco aos traços.
  React.useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const target =
      panel?.querySelector<HTMLAnchorElement>("[aria-current]") ??
      panel?.querySelector<HTMLAnchorElement>("a")
    target?.focus({ preventScroll: true })

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setOpen(false)
      toggleRef.current?.focus()
    }
    const onPointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
    }
  }, [open])

  if (sections.length < 2) return null

  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    setOpen(false)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
    history.replaceState(null, "", `#${id}`)
  }

  return (
    <nav
      ref={navRef}
      aria-label="Sumário"
      className="fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 items-center gap-3 lg:flex"
    >
      {/* Os traços. Parados, só eles; no hover e no foco do teclado, um
          fundo leve, sem contorno. */}
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Fechar sumário" : "Abrir sumário"}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex flex-col rounded-lg px-1.5 py-1.5 outline-none",
          // `foreground/5` escurece no claro e clareia no escuro: a tinta do
          // texto troca de lado com o tema, e o realce vai junto.
          "transition-colors duration-200 ease-snappy hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/50",
          open && "bg-foreground/5",
          "motion-reduce:transition-none"
        )}
      >
        {sections.map((section) => {
          const current = section.id === active
          return (
            <span
              key={section.id}
              aria-hidden
              className="flex h-3 w-3 items-center"
            >
              <span
                className={cn(
                  "h-px transition-[width,background-color] duration-200 ease-snappy motion-reduce:transition-none",
                  current ? "w-3 bg-foreground" : "w-2 bg-muted-foreground/60"
                )}
              />
            </span>
          )
        })}
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          className={cn(
            "w-64 rounded-xl border border-border bg-background py-3 shadow-lg",
            "animate-in duration-200 fade-in slide-in-from-left-1 motion-reduce:animate-none"
          )}
        >
          <p className="px-3.5 pb-1.5 font-label text-[0.65rem] font-semibold tracking-[0.18em] text-foreground uppercase">
            Sumário
          </p>
          <ol>
            {sections.map((section) => {
              const current = section.id === active
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(event) => go(event, section.id)}
                    aria-current={current ? "location" : undefined}
                    title={section.title}
                    className={cn(
                      "block truncate py-1.5 pr-3.5 text-sm outline-none",
                      section.level === 3 ? "pl-7" : "pl-3.5",
                      "transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:decoration-accent focus-visible:underline-offset-4",
                      current ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {section.title}
                  </a>
                </li>
              )
            })}
          </ol>
        </div>
      ) : null}
    </nav>
  )
}

export { LetterContents }
