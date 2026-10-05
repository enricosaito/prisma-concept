import type { Metadata } from "next"

import { LetterListItem } from "@/components/letter-card"
import { SubscribeForm } from "@/components/subscribe-form"
import { getPublishedLetters } from "@/lib/letters/source"

export const metadata: Metadata = {
  title: "Cartas",
  description:
    "O arquivo completo da Prisma — todas as cartas sobre tecnologia, arte, design e escrita.",
  alternates: { canonical: "/cartas" },
}

export default function Page() {
  // Oldest first: the archive reads from issue 1 upward, the way a shelf does.
  const letters = getPublishedLetters()

  return (
    <div className="mx-auto max-w-5xl px-5 pt-12 sm:px-8 sm:pt-20">
      <header className="max-w-2xl">
        <p className="font-label text-[0.7rem] font-medium tracking-[0.22em] text-muted-foreground uppercase">
          Arquivo
        </p>
        <h1 className="mt-5 font-heading text-4xl leading-tight font-medium text-balance sm:text-5xl">
          Todas as cartas
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          {letters.length}{" "}
          {letters.length === 1 ? "edição publicada" : "edições publicadas"}. Da
          mais antiga para a mais recente.
        </p>
      </header>

      <div className="mt-10 flex flex-col sm:mt-14">
        {letters.map((letter) => (
          <LetterListItem
            key={letter.slug}
            letter={letter}
            className="border-t border-border/70 py-7 sm:py-9"
          />
        ))}
      </div>

      {/* Fecha a lista: cada item acima tem `border-t`, então sem esta regra
        o último ficaria aberto e o convite colaria nele. É a mesma regra que
        encerra o corpo de uma carta, na mesma cor. */}
      <hr className="mt-12 border-border/70 sm:mt-16" />

      {/* Mesmo tratamento do fim de uma carta: sem painel. Dentro de uma caixa
        com fundo próprio o convite lia como anúncio encaixotado na página;
        solto, lê como a publicação ainda falando. Não havia motivo para o
        arquivo contrariar isso, nem para o site ter dois convites diferentes.

        O título é o daqui, e não o "Gostou desta carta?" da carta: numa página
        que lista todas, ninguém acabou de ler nenhuma. */}
      <div className="mt-10 max-w-[45rem] sm:mt-12">
        <h2 className="font-heading text-xl font-medium">
          Receba a próxima antes de todo mundo.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Inscreva-se gratuitamente e receba as próximas no seu e-mail toda
          semana.
        </p>
        <SubscribeForm className="mt-6" />
      </div>
    </div>
  )
}
