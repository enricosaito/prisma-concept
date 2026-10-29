import type { Metadata } from "next"
import { Libre_Caslon_Text, Newsreader, Source_Serif_4 } from "next/font/google"

import { getLatestLetter } from "@/lib/letters/source"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Página temporária de comparação de fontes para os títulos. Não é linkada de
 * lugar nenhum, não entra no sitemap e pede para não ser indexada: existe só
 * para o autor escolher a fonte olhando, e sai depois da escolha.
 *
 * Cada candidata compõe os textos reais do site — o título da carta mais
 * recente, o título do "Por quê?", o lema —, sobre o papel, sobre o mar à
 * noite e sobre o azul Oxford. Só os títulos mudam; o corpo é sempre a
 * Literata do site, porque é contra ela que o título vai ser lido.
 */
export const metadata: Metadata = {
  title: "Tipos",
  robots: { index: false, follow: false },
}

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-cand-source",
})

const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-cand-newsreader",
})

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cand-caslon",
})

type Candidate = {
  name: string
  note: string
  family: string
  // O Fraunces precisa do eixo WONK posto à mão para mostrar o antes.
  settings?: string
  // A Libre Caslon só tem 400 e 700; o 500 dos títulos cairia no 400.
  medium?: number
}

const CANDIDATES: Candidate[] = [
  {
    name: "Fraunces, como estava (WONK ligado)",
    note: "O antes. As letras tortas de propósito: charme, mas lido como capricho.",
    family: "var(--font-heading)",
    settings: '"WONK" 1',
  },
  {
    name: "Fraunces sem WONK",
    note: "O que está no branch agora. Mesma fonte e mesmas medidas, mais sóbria.",
    family: "var(--font-heading)",
    settings: '"WONK" 0',
  },
  {
    name: "Source Serif 4",
    note: "Robusta e institucional. A mais confiável das quatro; a menos vistosa.",
    family: "var(--font-cand-source)",
  },
  {
    name: "Newsreader",
    note: "Desenhada para manchete de jornal. Séria e editorial, com mais tensão.",
    family: "var(--font-cand-newsreader)",
  },
  {
    name: "Libre Caslon Text",
    note: "Clássica e com autoridade — a letra das declarações e dos panfletos.",
    family: "var(--font-cand-caslon)",
    medium: 400,
  },
]

function Specimen({
  candidate,
  title,
  tone,
}: {
  candidate: Candidate
  title: string
  tone: "light" | "dark"
}) {
  const face = {
    fontFamily: candidate.family,
    fontVariationSettings: candidate.settings ?? "normal",
  }
  const medium = candidate.medium ?? 500

  return (
    <div
      className={cn(
        "bg-background px-6 py-8 text-foreground sm:px-8",
        tone === "dark" && "dark"
      )}
    >
      <p className="font-label text-[0.65rem] font-medium tracking-[0.22em] text-muted-foreground uppercase">
        {tone === "light" ? "Papel" : "Mar à noite"}
      </p>
      <h2
        className="mt-4 text-2xl leading-[1.15] text-balance sm:text-3xl"
        style={{ ...face, fontWeight: medium }}
      >
        {title}
      </h2>
      <p
        className="mt-8 text-2xl leading-snug font-bold text-balance"
        style={face}
      >
        Vivemos cercados de informação — mas onde estão as ideias que realmente
        nos transformam?
      </p>
      <p className="mt-5 text-base leading-relaxed text-pretty">
        {site.description}
      </p>
    </div>
  )
}

export default function TiposPage() {
  const title = getLatestLetter()?.title ?? site.tagline

  return (
    <div
      className={cn(
        sourceSerif.variable,
        newsreader.variable,
        libreCaslon.variable,
        "mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16"
      )}
    >
      <p className="font-label text-[0.7rem] font-medium tracking-[0.22em] text-muted-foreground uppercase">
        Comparação de fontes · página temporária
      </p>
      <p className="mt-3 max-w-[40rem] text-base leading-relaxed text-muted-foreground">
        Só os títulos mudam. O corpo é a Literata do site em todas.
      </p>

      <div className="mt-12 flex flex-col gap-16">
        {CANDIDATES.map((candidate) => (
          <section key={candidate.name}>
            <h2 className="font-label text-sm font-medium tracking-[0.16em] uppercase">
              {candidate.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {candidate.note}
            </p>

            <div className="mt-5 grid border border-border md:grid-cols-2">
              <Specimen candidate={candidate} title={title} tone="light" />
              <Specimen candidate={candidate} title={title} tone="dark" />
            </div>
            <div className="dark oxford bg-background px-6 py-10 text-foreground sm:px-8">
              <p
                className="max-w-[18ch] text-4xl leading-[1.1] text-balance sm:text-6xl"
                style={{
                  fontFamily: candidate.family,
                  fontVariationSettings: candidate.settings ?? "normal",
                  fontWeight: candidate.medium ?? 500,
                }}
              >
                {site.motto}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
