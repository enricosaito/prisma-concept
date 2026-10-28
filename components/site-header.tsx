"use client"

import * as React from "react"
import Link from "next/link"

import { PrismaIcon } from "@/components/prisma-icon"
import { SubscribeDialog } from "@/components/subscribe-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Wordmark } from "@/components/wordmark"
import { cn } from "@/lib/utils"

/** Distance scrolled before the bar is allowed to retreat at all. */
const HIDE_AFTER = 96
/** Movement below this is trackpad jitter or rubber-banding, not intent. */
const DEADZONE = 6

/**
 * The bar gets out of the way going down and comes back the moment the reader
 * scrolls up.
 *
 * Direction is all this computes; the movement itself is a CSS transition on
 * the header, so reversing mid-slide retargets from wherever the bar currently
 * sits instead of restarting from the top.
 */
function useHiddenOnScrollDown() {
  const [hidden, setHidden] = React.useState(false)

  React.useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const read = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - lastY

      // Leave lastY alone below the deadzone so slow scrolls still accumulate
      // toward a decision rather than being discarded a pixel at a time.
      if (Math.abs(delta) < DEADZONE) return
      lastY = y

      // Near the top the bar always shows: that is where the page starts, and
      // iOS rubber-banding can report a negative offset here.
      setHidden(y > HIDE_AFTER && delta > 0)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return hidden
}

function SiteHeader() {
  const hidden = useHiddenOnScrollDown()

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/40",
        // A barra é escura nos dois temas. Os tokens de cor (`--background`,
        // `--foreground`…) são redefinidos dentro de `.dark` em globals.css, e
        // a variante `dark:` casa com qualquer descendente de `.dark`; com a
        // classe aqui, tudo na barra resolve para os valores do escuro, e o
        // ThemeToggle só muda a página embaixo dela (e o próprio ícone).
        "dark",
        // Fundo sólido, a cor da página. Já foi vidro fosco (translúcido, com
        // blur), mas o conteúdo passando por baixo sujava a barra.
        "bg-background",
        // A borda de baixo é só a hairline do `border-b` acima. Aqui havia um
        // fio do espectro atravessando a barra inteira; saiu. O espectro
        // continua onde ele diz alguma coisa — o número da edição, a seta
        // "Ler", o sublinhado do link ativo —, e não como moldura.
        // translate-y by its own height, so the bar clears itself at both h-14
        // and sm:h-16 without either being hardcoded here. The button keeps
        // 12px above and below it at both sizes (--btn 32/40 in 56/64).
        "transition-transform duration-200 ease-snappy",
        // Só a partir do `sm`. No mobile a barra fica parada: ela carrega o
        // botão da newsletter, e lá ele não tem outro lugar onde esteja sempre
        // à mão.
        hidden
          ? [
              "sm:-translate-y-full",
              // Tabbing into a bar parked off-screen would focus something the
              // reader cannot see, so focus brings it back.
              "sm:focus-within:translate-y-0",
              // Sliding the nav on every direction change is exactly what
              // reduced motion is asking us not to do: leave it in place.
              "sm:motion-reduce:translate-y-0",
            ]
          : "translate-y-0",
        "motion-reduce:transition-none"
      )}
    >
      {/* The glass spans the viewport, but its contents sit on the same
          centred max-w-5xl measure as the page sections and the footer, so
          the seal and the button line up with the edges of the text below
          instead of being pinned to the gutters of a wide screen.

          A pena e o nome formam um bloco só, à esquerda, e a newsletter fica
          à direita, nas duas larguras.

          Três medidas mandam na barra: `--nib`, a altura da pena; `--cap`, a
          altura de maiúscula do nome; e `--btn`, a altura do botão. A pena
          fica cerca de um terço acima das maiúsculas, para que o símbolo pese
          um pouco mais que as letras sem engoli-las. Os três dividem o mesmo
          centro, então ficam alinhados mesmo com alturas diferentes. */}
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-5 [--btn:32px] [--cap:15.5px] [--nib:21px] sm:h-16 sm:px-8 sm:[--btn:40px] sm:[--cap:24px] sm:[--nib:32px]">
        {/* Um link só para os dois: são o mesmo destino, e dois links lado a
            lado para a home seriam duas paradas de Tab para o mesmo lugar.

            O nome não pode simplesmente ter `--cap` de fonte: o corpo da
            fonte é maior que as maiúsculas. A "against" tem maiúscula de
            0.851em — medida com a opentype.js na própria fonte —, então a
            fonte é `--cap / 0.851` para que a maiúscula dê `--cap`. Ela se
            assenta no centro da caixa de linha, então `items-center` centra
            as maiúsculas na pena e no botão.

            Centrar as maiúsculas no botão, porém, não basta: "Newsletter" é
            caixa baixa, e o olho centra caixa baixa pela altura-x, que fica
            abaixo do centro do botão. O `translate-y` desce o nome até o
            centro das maiúsculas coincidir com o centro da altura-x do
            "Newsletter" — 1.5px nas duas larguras, medidos no
            navegador com a Literata do botão e já descontado o pixel que o
            próprio "Newsletter" sobe (ver subscribe-dialog.tsx). Se a fonte
            ou o tamanho do botão mudarem, meça de novo. */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-[calc(var(--nib)*0.25)] rounded-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <PrismaIcon bare className="size-[var(--nib)]" />
          <Wordmark className="translate-y-[1.5px] text-[calc(var(--cap)/0.851)] leading-none tracking-normal" />
        </Link>

        {/* Um <div> e não um <nav>: o que fica aqui é um controle de tema e um
            botão que abre um diálogo. Nenhum dos dois navega para lugar
            nenhum, e anunciar um marco de navegação que não leva a nada é pior
            do que não ter marco.

            O tema é um quadrado de `--btn` de lado, então tem a altura do
            botão ao lado. O botão leva `bg-clip-border` porque o Button pinta
            o fundo só dentro da borda transparente de 1px; sem isso o creme
            fica 2px mais baixo que o contorno do quadrado. */}
        <div className="flex items-center gap-2">
          <ThemeToggle className="size-[var(--btn)] [&_svg]:size-4 sm:[&_svg]:size-[18px]" />
          {/* Nas duas larguras, porque é a ação da página. Em caixa baixa,
              sem o espaçamento largo dos outros botões e na Literata do
              texto, e não na Archivo das etiquetas, para soar como a
              publicação e não gritar numa barra que fica sempre à vista. */}
          <SubscribeDialog className="h-[var(--btn)] gap-1.5 bg-clip-border px-2.5 font-sans text-[0.8125rem] tracking-normal normal-case sm:gap-2 sm:px-4 sm:text-[0.9375rem]" />
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
