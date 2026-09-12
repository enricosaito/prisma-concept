import type { Metadata } from "next"

import { PostRow } from "@/components/post-card"
import { SubscribeForm } from "@/components/subscribe-form"
import { getAllPosts } from "@/lib/posts"

export const metadata: Metadata = {
  title: "Biblioteca",
  description:
    "O arquivo completo da Prisma — todas as cartas sobre tecnologia, arte, design e escrita.",
}

export default function Page() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-5xl px-5 pt-16 sm:px-8 sm:pt-24">
      <header className="max-w-2xl">
        <p className="font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
          Arquivo
        </p>
        <h1 className="mt-5 font-heading text-4xl leading-tight font-medium tracking-tight text-balance sm:text-5xl">
          Todas as cartas
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          {posts.length}{" "}
          {posts.length === 1 ? "edição publicada" : "edições publicadas"}. Da
          mais recente para a mais antiga.
        </p>
      </header>

      <div className="mt-14 flex flex-col">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-border bg-secondary px-6 py-10 sm:px-10">
        <h2 className="font-heading text-xl font-medium tracking-tight sm:text-2xl">
          Receba a próxima antes de todo mundo.
        </h2>
        <SubscribeForm className="mt-6 max-w-md" />
      </div>
    </div>
  )
}
