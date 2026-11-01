import type { Metadata } from "next"
import Image, { type StaticImageData } from "next/image"

import { HomeMasthead } from "@/components/home-masthead"
import { LetterListItem } from "@/components/letter-card"
import { SeaEdge } from "@/components/sea-edge"
import { SubscribeForm } from "@/components/subscribe-form"
import { getPublishedLetters } from "@/lib/letters/source"
import { jsonLdHtml, websiteJsonLd } from "@/lib/seo"
import { site } from "@/lib/site"
import beleza from "@/public/brand/beleza.png"
import navio from "@/public/brand/navio.png"

// Title and description come from the root layout; this exists for the
// canonical, which the home page needs more than any other route — it is the
// one with query strings and a trailing-slash variant pointing at it.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

export default function Page() {
  // Newest first here, oldest first on /cartas. A reader arriving at the home
  // page wants what just came out; the archive is a shelf you read in order.
  const letters = getPublishedLetters("newest")

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(websiteJsonLd()) }}
      />

      <HomeMasthead latest={letters[0]} />

      {/* Hero. Sem a grade tracejada que havia atrás: lia como planta
          técnica, interface, e não como página impressa. É o destino do
          "Publicações" do masthead. */}
      <section id="publicacoes" className="scroll-mt-20">
        <div className="mx-auto max-w-5xl px-5 pt-14 pb-10 sm:px-8 sm:pt-20 sm:pb-14">
          {/* No "Ver todas" alongside: the header's own button already goes to
              /cartas, and two links to it a few pixels apart read as a mistake. */}
          <h1 className="mb-6 font-label text-[0.7rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase sm:mb-8">
            Publicações
          </h1>
          {/* A list rather than a card grid: the upright covers read as a shelf
              of letters, which a three-up grid of thumbnails does not. The
              letters now open the page, so they are set at `lead` size. */}
          <div className="flex flex-col gap-10 sm:gap-14">
            {letters.map((letter, indice) => (
              <LetterListItem
                key={letter.slug}
                letter={letter}
                variant="lead"
                // Só a primeira: é ela que está acima da dobra.
                eager={indice === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Assinar, no fim da home.

          Existe porque sem ela não havia caminho nenhum no celular: o botão da
          barra só aparece a partir do sm, e quem chega pelo Instagram num
          telefone caía numa página sem como assinar — precisava abrir uma carta
          e rolar até o fim.

          Sem painel: encaixotado, o convite lia como anúncio deixado na
          página.

          É o fundo do mar. A página entra nele pela onda da SeaEdge, e daqui
          para baixo, com o rodapé, é uma faixa azul-marinho só, nos dois
          temas. O espaço acima da onda é margem, e fica com o fundo da
          página. O rodapé, ao ver que está na home, não desenha a própria
          onda: esta já é a dele.

          Três faixas: um lema, o Por quê? no azul mais fundo, e o
          lema da publicação com o navio e o convite, perto do rodapé — a gravura
          enfrentando o mar que o lema nomeia. As linhas da gravura já estão
          cheias desde a onda (`--sea-mask: none`) e seguem assim pelo rodapé.

          `relative z-10` na última faixa porque o rodapé logo abaixo é
          posicionado (por causa da textura) e, vindo depois, pintava por cima
          do fim dela — comia a borda de baixo do campo e o brilho do botão. O
          `pb-4` tira o formulário de cima da junta.

          As gravuras são brancas sobre transparente, recoloridas para o
          marfim do texto (#F5F1E8), e por isso só funcionam sobre o azul; são
          decorativas, então `alt=""`. */}
      <SeaEdge className="mt-16 sm:mt-24" />
      {/* `z-10` para que a onda pendurada embaixo pinte por cima do Por quê?,
          que vem depois.

          É o destino do "Sobre nós" do masthead: este lema e o Por quê? logo
          abaixo dizem quem somos. O `scroll-mt` é a altura da onda de cima,
          para o salto parar com ela à vista e não cortar o mar no topo. */}
      <section
        id="sobre"
        className="dark navy sea-texture z-10 scroll-mt-4 bg-background pt-12 pb-20 text-foreground [--sea-mask:none] sm:scroll-mt-6 sm:pt-20 sm:pb-28"
      >
        <Lema
          frase="Resgate a infinita beleza escondida em sua vida"
          gravura={beleza}
        />
        {/* Termina em onda, como a barra: o marinho pende sobre o azul mais
            fundo em vez de acabar numa régua. */}
        <SeaEdge flip className="absolute inset-x-0 top-full -mt-px" />
      </section>

      {/* Por quê?, entre os dois lemas. No azul mais fundo do tema escuro, sem
          o `navy`: é o meio do mar, mais escuro que a superfície acima e que
          o fundo abaixo, e separa as duas gravuras. Sem as linhas da gravura:
          elas ficam só no marinho, e o azul fundo liso marca a pausa entre os
          dois. Duas colunas e não uma grade de cards: as cartas acima já são
          uma lista. */}
      <section className="dark relative bg-background py-20 text-foreground sm:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <h2 className="font-label text-[0.7rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
            Por quê?
          </h2>
          <div className="mt-5 grid gap-7 border-t border-foreground/60 pt-8 sm:mt-6 sm:pt-9 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
            <p className="font-heading text-2xl leading-snug font-bold text-balance sm:text-[2rem]">
              Vivemos cercados de informação — mas onde estão as ideias que
              realmente nos transformam?
            </p>
            {/* Na tinta cheia, não no cinza de apoio: é o argumento da página,
                e no cinza lia como nota de rodapé.

                Texto do autor, escrito para esta seção. Não é o
                `site.description`, que segue descrevendo a publicação nas
                metatags. */}
            <div className="space-y-5 text-lg leading-relaxed text-pretty text-foreground">
              <p>
                Reunimos filosofia, arte e histórias com o objetivo de te
                conectar com ideias que importam — Como viver melhor. Pensar com
                mais clareza. Fundamentar-se na realidade.
              </p>
              <p>
                Te damos as ferramentas para se tornar um pensador mais afiado
                capaz de questionar o universo à sua volta, navegar pelas
                incertezas do futuro e resgatar a infinita beleza escondida em
                sua vida.
              </p>
            </div>
          </div>
        </div>
        {/* E o marinho volta subindo em onda, pousada no pé desta seção, sobre
            o azul fundo dela. */}
        <SeaEdge className="absolute inset-x-0 bottom-0" />
      </section>

      {/* `relative z-10` e `-mb-px` ficam no último bloco, o que encosta no
          rodapé (ver o comentário acima). */}
      <section className="dark navy sea-texture relative z-10 -mb-px bg-background pt-20 pb-4 text-foreground [--sea-mask:none] sm:pt-28">
        <Lema frase={site.motto} gravura={navio} convite />
      </section>
    </>
  )
}

/**
 * Um lema da home: a frase grande à esquerda, a gravura à direita. No celular
 * a gravura desce para baixo do texto, menor.
 *
 * O convite para assinar só vai no último, o que encosta no rodapé: repetido
 * a cada lema, o mesmo formulário lia como insistência.
 */
function Lema({
  frase,
  gravura,
  convite = false,
}: {
  frase: string
  gravura: StaticImageData
  convite?: boolean
}) {
  return (
    <div className="mx-auto grid max-w-5xl items-center gap-12 px-5 sm:px-8 md:grid-cols-2 md:gap-10">
      <div>
        <p className="max-w-[18ch] font-heading text-4xl leading-[1.1] font-semibold text-balance sm:text-6xl">
          {frase}
        </p>
        {convite ? <Convite /> : null}
      </div>
      <Image
        src={gravura}
        alt=""
        sizes="(min-width: 1024px) 460px, (min-width: 768px) 45vw, 320px"
        className="mx-auto h-auto w-full max-w-xs md:max-w-md"
      />
    </div>
  )
}

function Convite() {
  return (
    <div className="mt-12 sm:mt-16">
      <h2 className="font-heading text-xl font-medium">
        Junte-se a quem não se contenta com o óbvio.
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Ideias para expandir sua maneira de ver o mundo, direto na sua caixa de
        entrada
      </p>
      <SubscribeForm className="mt-6" />
    </div>
  )
}
