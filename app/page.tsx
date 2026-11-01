import type { Metadata } from "next"
import Image from "next/image"

import { LetterListItem } from "@/components/letter-card"
import { SeaEdge } from "@/components/sea-edge"
import { SubscribeForm } from "@/components/subscribe-form"
import { getPublishedLetters } from "@/lib/letters/source"
import { jsonLdHtml, websiteJsonLd } from "@/lib/seo"
import { site } from "@/lib/site"
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

      {/* Hero. Sem a grade tracejada que havia atrás: lia como planta
          técnica, interface, e não como página impressa. */}
      <section>
        <div className="mx-auto max-w-5xl px-5 pt-12 pb-10 sm:px-8 sm:pt-20 sm:pb-14">
          {/* No "Ver todas" alongside: the header's own button already goes to
              /cartas, and two links to it a few pixels apart read as a mistake. */}
          <h1 className="mb-6 font-label text-[0.7rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase sm:mb-8">
            Cartas
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

      {/* Por quê? */}
      <section className="mx-auto mt-16 max-w-5xl px-5 sm:mt-24 sm:px-8">
        <h2 className="font-label text-[0.7rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
          Por quê?
        </h2>
        {/* Two columns rather than another card grid: the letters above are
            already a list, and a second one would read as more of the same. */}
        <div className="mt-5 grid gap-7 border-t border-foreground/80 pt-8 sm:mt-6 sm:pt-9 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
          <p className="font-heading text-2xl leading-snug font-bold text-balance sm:text-[2rem]">
            Vivemos cercados de informação — mas onde estão as ideias que
            realmente nos transformam?
          </p>
          {/* Na tinta cheia, não no cinza de apoio: é o argumento da página, e
              no cinza lia como nota de rodapé.

              Texto do autor, escrito para esta seção. Não é o
              `site.description`, que segue descrevendo a publicação nas
              metatags. */}
          <div className="space-y-5 text-lg leading-relaxed text-pretty text-foreground">
            <p>
              Reunimos filosofia, arte e histórias com o objetivo de te conectar
              com ideias que importam — Como viver melhor. Pensar com mais
              clareza. Fundamentar-se na realidade.
            </p>
            <p>
              Te damos as ferramentas para se tornar um pensador mais afiado
              capaz de questionar o universo à sua volta, navegar pelas
              incertezas do futuro e resgatar a infinita beleza escondida em sua
              vida.
            </p>
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

          Abre com o lema, grande e em semibold, logo abaixo da onda: é onde o
          mar começa, e o convite para assinar vem como resposta a ele. As
          linhas da gravura já estão cheias aqui (`--sea-mask: none`), atrás
          do lema, e seguem assim pelo rodapé: o mar tem presença onde o lema
          o enfrenta, e não só no fundo da página.

          `relative z-10` porque o rodapé logo abaixo é posicionado (por causa
          da textura) e, vindo depois, pintava por cima do fim desta seção —
          comia a borda de baixo do campo e o brilho do botão. O `pb-4` tira o
          formulário de cima da junta.

          Duas colunas a partir do md: o lema e o convite à esquerda, o navio à
          direita — a gravura enfrentando o mar que o lema nomeia. No celular o
          navio desce para baixo do formulário, menor, para que o convite
          continue logo abaixo da onda. A gravura é branca sobre transparente,
          recolorida para o marfim do texto (#F5F1E8), e por isso só funciona
          sobre o azul; é decorativa, então `alt=""`. */}
      <SeaEdge className="mt-16 sm:mt-24" />
      <section className="dark navy sea-texture relative z-10 -mb-px bg-background pt-12 pb-4 text-foreground [--sea-mask:none] sm:pt-20">
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-5 sm:px-8 md:grid-cols-2 md:gap-10">
          <div>
            <p className="max-w-[18ch] font-heading text-4xl leading-[1.1] font-semibold text-balance sm:text-6xl">
              {site.motto}
            </p>
            <div className="mt-12 sm:mt-16">
              <h2 className="font-heading text-xl font-medium">
                Junte-se a quem não se contenta com o óbvio.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ideias para expandir sua maneira de ver o mundo, direto na sua
                caixa de entrada
              </p>
              <SubscribeForm className="mt-6" />
            </div>
          </div>
          <Image
            src={navio}
            alt=""
            sizes="(min-width: 1024px) 460px, (min-width: 768px) 45vw, 320px"
            className="mx-auto h-auto w-full max-w-xs md:max-w-md"
          />
        </div>
      </section>
    </>
  )
}
