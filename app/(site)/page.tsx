import type { Metadata } from "next"

import { LetterListItem } from "@/components/letter-card"
import { GridPattern } from "@/components/ui/grid-pattern"
import { getPublishedLetters } from "@/lib/letters/source"
import { jsonLdHtml, websiteJsonLd } from "@/lib/seo"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

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
        <div className="relative mx-auto max-w-5xl px-5 pt-12 pb-10 sm:px-8 sm:pt-20 sm:pb-14">
          {/* No "Ver todas" alongside: the header's own button already goes to
              /cartas, and two links to it a few pixels apart read as a mistake. */}
          <h1 className="mb-6 font-label text-[0.7rem] font-medium tracking-[0.22em] text-muted-foreground uppercase sm:mb-8">
            Cartas
          </h1>
          {/* A list rather than a card grid: the upright covers read as a shelf
              of letters, which a three-up grid of thumbnails does not. The
              letters now open the page, so they are set at `lead` size. */}
          <div className="flex flex-col gap-10 sm:gap-14">
            {letters.map((letter) => (
              <LetterListItem
                key={letter.slug}
                letter={letter}
                variant="lead"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Por quê? */}
      <section className="mx-auto mt-16 max-w-5xl px-5 sm:mt-24 sm:px-8">
        <h2 className="font-label text-[0.7rem] font-medium tracking-[0.22em] text-muted-foreground uppercase">
          Por quê?
        </h2>
        {/* Two columns rather than another card grid: the letters above are
            already a list, and a second one would read as more of the same. */}
        <div className="mt-5 grid gap-7 border-t border-border pt-8 sm:mt-6 sm:pt-9 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
          <p className="font-heading text-2xl leading-snug font-medium text-balance sm:text-[2rem]">
            Vivemos cercados de informação — mas onde estão as ideias que
            realmente nos conectam com o universo?
          </p>
          <div className="space-y-5 text-lg leading-relaxed text-pretty text-muted-foreground">
            <p>{site.description}</p>
            <p>
              Juntamos arte, histórias e ideias para enxergar o mundo de outro
              jeito.
            </p>
            <p>
              Te apresentamos um espaço para questionar profundamente sua visão
              de mundo, se tornar um pensador mais afiado e despertar sua
              curiosidade.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
