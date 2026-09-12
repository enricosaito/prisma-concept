import Link from "next/link"
import { RiArrowRightLine } from "@remixicon/react"

import { BlurReveal } from "@/components/blur-reveal"
import { Highlight } from "@/components/highlight"
import { FeaturedPostCard, PostCard } from "@/components/post-card"
import { SubscribeForm } from "@/components/subscribe-form"
import { LightRays } from "@/components/ui/light-rays"
import { getFeaturedPost, getRecentPosts } from "@/lib/posts"
import { site } from "@/lib/site"

const topics = ["Tecnologia", "Arte", "Design", "Escrita"]

export default function Page() {
  const featured = getFeaturedPost()
  const recent = getRecentPosts(3)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Light dispersing through the page, behind the opening lines.
            `screen` only lightens, so it would vanish on the pale theme —
            normal blending there, screen in the dark. */}
        <LightRays
          aria-hidden
          color="var(--hero-ray-color)"
          blur={48}
          speed={18}
          length="80vh"
          className="isolation-auto [--hero-ray-color:rgba(184,144,98,0.34)] [--light-rays-blend:normal] dark:[--hero-ray-color:rgba(201,168,108,0.30)] dark:[--light-rays-blend:screen]"
        />
        <div className="relative mx-auto max-w-5xl px-5 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-20">
          <BlurReveal
            as="p"
            speedReveal={2.4}
            className="font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase"
          >
            Carta quinzenal
          </BlurReveal>

          {/* Three reveals inside one heading so the bronze italic survives —
            BlurReveal only accepts a plain string as its children. */}
          <h1 className="mt-6 max-w-3xl font-heading text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-6xl">
            <BlurReveal as="span" className="inline" delay={0.15}>
              A mesma luz,
            </BlurReveal>{" "}
            <Highlight>
              <BlurReveal as="span" className="inline" delay={0.45}>
                separada
              </BlurReveal>
            </Highlight>{" "}
            <BlurReveal as="span" className="inline" delay={0.7}>
              em quatro cores.
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

          <ul className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/70 pt-6 font-mono text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
            {topics.map((topic) => (
              <li key={topic} className="flex items-center gap-2">
                <span aria-hidden className="size-1 rounded-full bg-accent" />
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured letter */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8">
        <h2 className="mb-6 font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
          Última carta
        </h2>
        <FeaturedPostCard post={featured} />
      </section>

      {/* Archive preview */}
      <section className="mx-auto mt-20 max-w-5xl px-5 sm:px-8">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
            No arquivo
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
          {recent.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto mt-20 max-w-5xl px-5 sm:px-8">
        <div className="rounded-xl border border-border bg-secondary px-6 py-10 sm:px-12 sm:py-14">
          <h2 className="max-w-lg font-heading text-2xl leading-snug font-medium tracking-tight text-balance sm:text-3xl">
            Uma carta a cada quinze dias. Nada além disso.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Ensaios curtos, notas de processo e recortes do que andei lendo.
            Direto na sua caixa de entrada.
          </p>
          <SubscribeForm className="mt-8 max-w-md" />
        </div>
      </section>
    </>
  )
}
