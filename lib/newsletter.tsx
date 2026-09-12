import { Resend, type ErrorResponse } from "resend"

import { WelcomeEmail } from "@/emails/welcome"
import { site } from "@/lib/site"

/**
 * The list itself: adding a reader to Resend and welcoming them.
 *
 * Everything Resend-shaped lives here so `app/api/subscribe/route.ts` stays a
 * thin HTTP wrapper, and so a second entry point (an import script, a form
 * action) can reuse the same rules rather than re-deriving them.
 */

/**
 * Resend's `error` objects serialise to `{}` through most structured loggers,
 * which turns a real failure into a blank line in production. Spell the fields
 * out so the log says what actually went wrong.
 */
function logResendError(what: string, error: ErrorResponse): void {
  console.error(
    `[subscribe] ${what}: ${error.name} (${error.statusCode ?? "no status"}) — ${error.message}`
  )
}

/**
 * Resend renamed Audiences to Segments. Both ids are accepted so this keeps
 * working either side of that migration; the segment API is preferred when
 * both are present.
 */
function listConfig() {
  const segmentId = process.env.RESEND_SEGMENT_ID?.trim()
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim()

  if (segmentId) return { kind: "segment" as const, id: segmentId }
  if (audienceId) return { kind: "audience" as const, id: audienceId }
  return null
}

/** Built per call: the key is read at request time, not at module load. */
function resendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  return apiKey ? new Resend(apiKey) : null
}

function fromAddress(): string {
  return process.env.RESEND_FROM?.trim() || `${site.signature} <${site.email}>`
}

export type SubscribeOutcome =
  /** Added to the list, welcome sent. */
  | { ok: true; state: "subscribed" }
  /** Was on the list already — no second welcome. */
  | { ok: true; state: "already" }
  /** Had unsubscribed before and is back. */
  | { ok: true; state: "resubscribed" }
  /** No Resend credentials in this environment; the address went nowhere. */
  | { ok: true; state: "unconfigured" }
  | { ok: false; state: "error"; reason: string }

/**
 * Idempotent by design: a reader who submits the form twice is told they are
 * already in rather than being welcomed twice.
 */
export async function subscribe(rawEmail: string): Promise<SubscribeOutcome> {
  const address = rawEmail.trim().toLowerCase()
  const resend = resendClient()
  const list = listConfig()

  if (!resend || !list) {
    // Local dev without keys still exercises the whole form flow.
    console.info("[subscribe] Resend not configured; not stored:", address)
    return { ok: true, state: "unconfigured" }
  }

  // Scoping the lookup to a legacy audience is required; segments are
  // account-wide, so the email alone identifies the contact.
  const lookup =
    list.kind === "audience"
      ? { email: address, audienceId: list.id }
      : { email: address }

  try {
    const existing = await resend.contacts.get(lookup)

    if (existing.data && !existing.data.unsubscribed) {
      return { ok: true, state: "already" }
    }

    if (existing.data?.unsubscribed) {
      const revived = await resend.contacts.update({
        ...lookup,
        unsubscribed: false,
      })

      if (revived.error) {
        logResendError("resubscribe failed", revived.error)
        return { ok: false, state: "error", reason: revived.error.message }
      }

      await sendWelcome(resend, address)
      return { ok: true, state: "resubscribed" }
    }

    // `contacts.get` 404s for an unknown address, which is the normal path.
    const created =
      list.kind === "audience"
        ? await resend.contacts.create({
            audienceId: list.id,
            email: address,
            unsubscribed: false,
          })
        : await resend.contacts.create({
            email: address,
            unsubscribed: false,
            segments: [{ id: list.id }],
          })

    if (created.error) {
      logResendError("contact create failed", created.error)
      return { ok: false, state: "error", reason: created.error.message }
    }

    await sendWelcome(resend, address)
    return { ok: true, state: "subscribed" }
  } catch (error) {
    console.error("[subscribe] unexpected Resend failure:", error)
    return { ok: false, state: "error", reason: "network" }
  }
}

/**
 * Never fails the signup. The reader is on the list either way, and telling
 * them otherwise would only make them submit the form again.
 */
async function sendWelcome(resend: Resend, address: string): Promise<void> {
  try {
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: address,
      replyTo: site.email,
      subject: `Bem-vindo à ${site.signature}`,
      react: <WelcomeEmail url={site.url} />,
      headers: {
        // Gmail and Outlook surface a one-click unsubscribe from this; without
        // it a reader's only exit is the spam button, which costs the domain.
        "List-Unsubscribe": `<mailto:${site.email}?subject=unsubscribe>`,
      },
    })

    if (error) {
      logResendError("welcome email failed", error)
    }
  } catch (error) {
    console.error("[subscribe] welcome email threw:", error)
  }
}
