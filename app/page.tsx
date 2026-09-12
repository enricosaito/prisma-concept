import Link from "next/link"
import { RiArrowRightLine } from "@remixicon/react"

import { BlurReveal } from "@/components/blur-reveal"
import { Highlight } from "@/components/highlight"
import { PostCard } from "@/components/post-card"
import { SubscribeForm } from "@/components/subscribe-form"
import { GridPattern } from "@/components/ui/grid-pattern"
import { getAllPosts } from "@/lib/posts"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

export default function Page() {
  const letters = getAllPosts()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Dashed grid, barely there — masked to a soft radial so it fades out
            before it reaches the edges of the section. */}
        <GridPattern
          width={44}
          height={44}
          strokeDasharray="3 5"
          className={cn(
            "fill-none stroke-foreground/[0.07] dark:stroke-foreground/[0.09]",
            "[mask-image:radial-gradient(420px_circle_at_18%_28%,black,transparent)]",
            "sm:[mask-image:radial-gradient(680px_circle_at_22%_30%,black,transparent)]"
          )}
        />
        <div className="relative mx-auto max-w-5xl px-5 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-20">
          {/* Separate reveals inside one heading: BlurReveal only accepts a
              plain string, so the highlighted phrase needs its own. */}
          <h1 className="max-w-4xl font-heading text-4xl leading-[1.08] font-medium tracking-tight sm:text-[3.25rem] lg:text-6xl">
            <BlurReveal as="span" className="inline" delay={0.15}>
              Ideias sob novas
            </BlurReveal>{" "}
            <Highlight>
              <BlurReveal as="span" className="inline" delay={0.45}>
                perspectivas
              </BlurReveal>
            </Highlight>
            {/* Hard break where the manifesto asks for one; the second line
                still wraps on its own at narrow widths. */}
            <br />
            <BlurReveal as="span" className="inline" delay={0.75}>
              para quem pensa além do óbvio.
            </BlurReveal>
          </h1>

          <BlurReveal
            as="p"
            delay={1.1}
            speedReveal={3}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            {site.description}
          </BlurReveal>

          <SubscribeForm className="mt-9 max-w-md" />
        </div>
      </section>

      {/* Biblioteca */}
      <section className="mx-auto mt-20 max-w-5xl px-5 sm:px-8">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
            Biblioteca
          </h2>
          <Link
            href="/biblioteca"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Ver todas
            <RiArrowRightLine className="size-3.5 text-accent transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {letters.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Por quê? */}
      <section className="mx-auto mt-24 max-w-5xl px-5 sm:px-8">
        <h2 className="font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
          Por quê?
        </h2>
        {/* Two columns rather than another card grid: the Biblioteca above is
            already a list, and a second one would read as more of the same. */}
        <div className="mt-6 grid gap-7 border-t border-border pt-9 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
          <p className="font-heading text-2xl leading-snug font-medium tracking-tight text-balance sm:text-[1.75rem]">
            A internet está cheia de opiniões rasas, conteúdo de IA{" "}
            e super estímulos — nosso objetivo é fazer o oposto.
          </p>
          <div className="space-y-5 text-lg leading-relaxed text-pretty text-muted-foreground">
            <p>
              Nós te damos um espaço para pensar profundamente sobre o mundo,
              para você se tornar um pensador mais afiado e mais criativo.
              Viver melhor, ter uma visão mais ampla e mais clara. Tomar melhores decisões,
              ter melhores relacionamentos e construir algo para si mesmo.
            </p>
            <p>
              Um prisma não inventa cor nenhuma. As cores já estavam ali, dentro
              da mesma luz — ele só muda o ângulo até que você consiga ver. É o que esta
              carta tenta fazer a cada quinze dias: pegar um assunto só e
              virá-lo devagar, até aparecer o que sempre esteve junto.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
