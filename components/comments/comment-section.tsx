"use client"

import * as React from "react"

import {
  CommentComposer,
  type PublishResult,
} from "@/components/comments/comment-composer"
import { CommentList } from "@/components/comments/comment-list"
import { PrototypeSignInDialog } from "@/components/comments/prototype-sign-in-dialog"
import { Button } from "@/components/ui/button"
import { prototypeStore } from "@/lib/comments/prototype-store"
import { PrototypeReaderProvider, useReader } from "@/lib/comments/reader"
import type { Comment, CommentStore } from "@/lib/comments/types"

type Load =
  | { state: "loading" }
  | { state: "error" }
  | { state: "ready"; comments: Comment[] }

function countLabel(n: number) {
  return n === 1 ? "1 comentário" : `${n} comentários`
}

/**
 * The comment section under a letter: loads the letter's comments from a
 * `CommentStore`, lists them, and publishes through the reader boundary.
 *
 * Responsibilities stay apart — presentation in CommentList, the draft and
 * its validation in CommentComposer, identity in `useReader`, persistence in
 * the store. This component only joins them.
 */
function CommentSectionInner({
  essayId,
  store,
}: {
  essayId: string
  store: CommentStore
}) {
  const { reader, requestSignIn, signOut } = useReader()
  const [load, setLoad] = React.useState<Load>({ state: "loading" })
  const [attempt, setAttempt] = React.useState(0)

  React.useEffect(() => {
    let live = true
    store
      .list(essayId)
      .then((comments) => {
        if (live) setLoad({ state: "ready", comments })
      })
      .catch(() => {
        if (live) setLoad({ state: "error" })
      })
    return () => {
      live = false
    }
  }, [essayId, store, attempt])

  async function publish(body: string): Promise<PublishResult> {
    const author = reader ?? (await requestSignIn(body))
    if (!author) return "cancelled"
    const comment = await store.create(
      { essayId, body, parentCommentId: null },
      author
    )
    setLoad((current) =>
      current.state === "ready"
        ? { state: "ready", comments: [...current.comments, comment] }
        : current
    )
    return "published"
  }

  const count = load.state === "ready" ? load.comments.length : null

  return (
    <section
      aria-labelledby="comments-heading"
      aria-busy={load.state === "loading"}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="comments-heading" className="font-heading text-xl font-medium">
          Discussão sobre essa publicação
        </h2>
        {count !== null && count > 0 ? (
          <p className="font-label text-xs font-medium tracking-wide text-muted-foreground">
            {countLabel(count)}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <CommentComposer
          essayId={essayId}
          reader={reader}
          onPublish={publish}
          onSignOut={signOut}
        />
      </div>

      <div className="mt-6">
        {load.state === "loading" ? (
          <p className="border-t border-border py-6 text-sm text-muted-foreground">
            Carregando comentários…
          </p>
        ) : load.state === "error" ? (
          <div role="alert" className="border-t border-border py-6">
            <p className="text-sm text-foreground">
              Não foi possível carregar os comentários.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setLoad({ state: "loading" })
                setAttempt((n) => n + 1)
              }}
              className="mt-3 h-9 px-4 text-xs"
            >
              Tentar de novo
            </Button>
          </div>
        ) : load.comments.length === 0 ? (
          <p className="border-t border-border py-6 text-base leading-relaxed text-muted-foreground">
            Ninguém comentou ainda. Se esta carta te deixou pensando em alguma
            coisa, comece a conversa.
          </p>
        ) : (
          <CommentList comments={load.comments} />
        )}
      </div>
    </section>
  )
}

/**
 * Drop-in for a letter page. The provider is the prototype's; with real
 * authentication it moves up to the layout and this becomes just the section.
 */
function CommentSection({
  essayId,
  store = prototypeStore,
}: {
  essayId: string
  store?: CommentStore
}) {
  return (
    <PrototypeReaderProvider SignIn={PrototypeSignInDialog}>
      <CommentSectionInner essayId={essayId} store={store} />
    </PrototypeReaderProvider>
  )
}

export { CommentSection }
