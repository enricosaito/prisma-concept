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
        // Frosted glass: a translucent ground plus blur and a touch of
        // saturation, so content scrolling under it tints the bar instead of
        // disappearing. Falls back to a near-opaque bar where backdrop-filter
        // is unsupported, otherwise the text would sit on bare content.
        "bg-background/90 supports-[backdrop-filter]:bg-background/68",
        "backdrop-blur-xl backdrop-saturate-150",
        // A borda de baixo é só a hairline do `border-b` acima. Aqui havia um
        // fio do espectro atravessando a barra inteira; saiu. O espectro
        // continua onde ele diz alguma coisa — o número da edição, a seta
        // "Ler", o sublinhado do link ativo —, e não como moldura.
        // translate-y by its own height, so the bar clears itself at both h-16
        // and sm:h-20 without either being hardcoded here.
        "transition-transform duration-200 ease-snappy",
        hidden
          ? [
              "-translate-y-full",
              // Tabbing into a bar parked off-screen would focus something the
              // reader cannot see, so focus brings it back.
              "focus-within:translate-y-0",
              // Sliding the nav on every direction change is exactly what
              // reduced motion is asking us not to do: leave it in place.
              "motion-reduce:translate-y-0",
            ]
          : "translate-y-0",
        "motion-reduce:transition-none"
      )}
    >
      {/* Full-bleed on purpose: the bar spans the viewport and pins the
          wordmark and the nav to the gutters, while page sections keep their
          centred max-w-5xl measure.

          Duas colunas no mobile e três a partir do `sm`. O que faz isso
          funcionar é que `display: none` tira o elemento do fluxo do grid, e
          não apenas da vista: no mobile o símbolo e o menu somem, sobram duas
          células, e o nome cai na primeira — à esquerda. No desktop as quatro
          crianças voltam a ser três e o nome volta ao centro. Uma declaração
          de colunas por faixa, sem nenhum condicional em JavaScript. */}
      <div className="grid h-16 w-full grid-cols-[1fr_auto] items-center gap-4 px-5 sm:h-20 sm:grid-cols-[1fr_auto_1fr] sm:px-8">
        {/* Só no desktop. No mobile o nome sozinho à esquerda já identifica a
            publicação, e o selo ao lado dele numa barra de 360px gastava
            espaço repetindo o que o nome diz. */}
        <Link
          href="/"
          aria-label="PRISMA — início"
          className="hidden justify-self-start rounded-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:block"
        >
          {/* O SELO casado com a altura de maiúscula do wordmark, não escolhido
              a olho: a "against" tem maiúscula de 0.851em — medido com a
              opentype.js na própria fonte —, o que dá 40.8px a 48px.

              É o selo que mede isso, e não a pena dentro dele, porque no
              negativo o selo é o logo. A pena ocupa 64% da caixa, então ela
              fica em ~26px — é o que acontece com qualquer logo em selo ao
              lado de um nome, e é a proporção desenhada no arquivo.

              Não mexe na altura da barra: ela é fixa em h-16 / sm:h-20. */}
          <PrismaIcon className="size-[40.8px]" />
        </Link>

        {/* À esquerda no mobile, centrado no desktop. Lá ele divide a barra com
            o selo e o menu e o centro é o lugar do masthead; aqui ele é o único
            elemento à esquerda, e centrá-lo deixaria um vão à esquerda sem nada
            que o justifique. */}
        <Link
          href="/"
          className="justify-self-start rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:justify-self-center"
        >
          <Wordmark className="text-4xl tracking-normal sm:text-5xl" />
        </Link>

        {/* Um <div> e não um <nav>: com o "Início" fora, o que resta aqui é
            um controle de tema e um botão que abre um diálogo. Nenhum dos
            dois navega para lugar nenhum, e anunciar um marco de navegação
            que não leva a nada é pior do que não ter marco. */}
        <div className="hidden items-center gap-1 justify-self-end sm:flex">
          <ThemeToggle className="mr-1" />
          <SubscribeDialog className="ml-2 h-10 rounded-[10px] px-6 text-[0.8rem]" />
        </div>

        {/* No mobile a barra guarda só isto. Saíram o hamburguer e a gaveta que
            ele abria: dentro dela havia um único link, "Início", para onde o
            nome ao lado já leva. Um painel que desliza para oferecer o destino
            em que você já está não é navegação, é cerimônia. */}
        <ThemeToggle className="justify-self-end sm:hidden" />
      </div>
    </header>
  )
}

export { SiteHeader }
