import type { Block } from "@/lib/posts"

/** Renders the typed block list of a post. Styling lives in `.prose-letter`. */
function PostContent({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-letter">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return <h2 key={index}>{block.text}</h2>
          case "quote":
            return (
              <blockquote key={index}>
                {block.text}
                {block.cite ? (
                  <cite className="mt-2 block font-mono text-xs tracking-wide text-muted-foreground not-italic">
                    — {block.cite}
                  </cite>
                ) : null}
              </blockquote>
            )
          case "list":
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )
          case "p":
          default:
            return <p key={index}>{block.text}</p>
        }
      })}
    </div>
  )
}

export { PostContent }
