import { PostListItem } from "@/components/post-card"
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
        <div className="relative mx-auto max-w-5xl px-5 pt-14 pb-16 sm:px-8 sm:pt-20 sm:pb-24">
          {/* No "Ver todas" alongside: the header's own button already goes to
              /cartas, and two links to it a few pixels apart read as a mistake. */}
          <h1 className="mb-7 font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
            Cartas
          </h1>
          {/* A list rather than a card grid: the upright covers read as a shelf
              of letters, which a three-up grid of thumbnails does not. The
              letters now open the page, so they are set at `lead` size. */}
          <div className="flex flex-col gap-12">
            {letters.map((post) => (
              <PostListItem key={post.slug} post={post} variant="lead" />
            ))}
          </div>
        </div>
      </section>

      {/* Por quê? */}
      <section className="mx-auto mt-24 max-w-5xl px-5 sm:px-8">
        <h2 className="font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
          Por quê?
        </h2>
        {/* Two columns rather than another card grid: the letters above are
            already a list, and a second one would read as more of the same. */}
        <div className="mt-6 grid gap-7 border-t border-border pt-9 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
          <p className="font-heading text-2xl leading-snug font-medium tracking-tight text-balance sm:text-[1.75rem]">
            A internet está cheia de opiniões rasas, conteúdo de IA e super
            estímulos — nosso objetivo é fazer o oposto.
          </p>
          <div className="space-y-5 text-lg leading-relaxed text-pretty text-muted-foreground">
            <p>{site.description}</p>
            <p>
              Te apresentamos um espaço para questionar profundamente o mundo,
              se tornar um pensador mais afiado e despertar sua curiosidade.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
