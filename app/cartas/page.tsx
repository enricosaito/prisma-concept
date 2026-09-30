import type { Metadata } from "next"

import { PostListItem } from "@/components/post-card"
import { SubscribeForm } from "@/components/subscribe-form"
import { getAllPosts } from "@/lib/posts"

export const metadata: Metadata = {
  title: "Cartas",
  description:
    "O arquivo completo da Prisma — todas as cartas sobre tecnologia, arte, design e escrita.",
}

export default function Page() {
  const posts = getAllPosts()

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
          {posts.length}{" "}
          {posts.length === 1 ? "edição publicada" : "edições publicadas"}. Da
          mais antiga para a mais recente.
        </p>
      </header>

      <div className="mt-10 flex flex-col sm:mt-14">
        {posts.map((post) => (
          <PostListItem
            key={post.slug}
            post={post}
            className="border-t border-border/70 py-7 sm:py-9"
          />
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-border bg-secondary px-6 py-8 sm:mt-16 sm:px-10 sm:py-10">
        <h2 className="font-heading text-xl font-medium sm:text-2xl">
          Receba a próxima antes de todo mundo.
        </h2>
        <SubscribeForm className="mt-6 max-w-md" />
      </div>
    </div>
  )
}
