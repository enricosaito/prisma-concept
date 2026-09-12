import type { Metadata } from "next"
import { RiInstagramLine } from "@remixicon/react"

import { Highlight } from "@/components/highlight"
import { SubscribeForm } from "@/components/subscribe-form"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Assinar",
  description:
    "Assine a Prisma e receba, a cada quinze dias, uma carta sobre tecnologia, arte, design e escrita.",
}

const promises = [
  {
    title: "Uma carta a cada quinze dias",
    body: "Um assunto por edição, escrito para ser lido em menos de dez minutos.",
  },
  {
    title: "Quatro temas, um ângulo",
    body: "Tecnologia, arte, design e escrita — sempre pelo que têm em comum, não pelo que os separa.",
  },
  {
    title: "Arquivo sempre aberto",
    body: "Tudo o que já saiu continua disponível aqui, de graça, sem login.",
  },
]

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-4xl leading-tight font-medium tracking-tight text-balance sm:text-5xl">
          Assine a <Highlight>Prisma</Highlight>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">
          {site.description}
        </p>

        <SubscribeForm className="mx-auto mt-10 max-w-md text-left" />
      </div>

      <dl className="mx-auto mt-20 grid max-w-3xl gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        {promises.map((item) => (
          <div key={item.title} className="bg-background p-6">
            <dt className="font-heading text-base font-medium tracking-tight text-balance">
              {item.title}
            </dt>
            <dd className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mx-auto mt-16 max-w-2xl border-t border-border pt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Prefere acompanhar por imagem?
        </p>
        <a
          href={site.instagram}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
        >
          <RiInstagramLine className="size-4" />
          Siga no Instagram
        </a>
      </div>
    </div>
  )
}
