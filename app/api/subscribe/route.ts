import { subscribe, type SubscribeOutcome } from "@/lib/newsletter"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** What the reader is told. The outcome is deliberately not spelled out in
 *  detail — whether an address is already on the list is not something an
 *  anonymous form should confirm to whoever typed it. */
const MESSAGES: Record<SubscribeOutcome["state"], string> = {
  subscribed: "Pronto! Você está na lista.",
  resubscribed: "Pronto! Você está na lista.",
  already: "Pronto! Você está na lista.",
  unconfigured: "Pronto! Você está na lista.",
  error: "Não foi possível assinar agora. Tente de novo em instantes.",
}

export async function POST(request: Request) {
  let email: unknown

  try {
    const body = (await request.json()) as { email?: unknown }
    email = body.email
  } catch {
    return Response.json({ message: "Requisição inválida." }, { status: 400 })
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return Response.json(
      { message: "Digite um e-mail válido." },
      { status: 400 }
    )
  }

  const outcome = await subscribe(email)

  if (!outcome.ok) {
    return Response.json({ message: MESSAGES.error }, { status: 502 })
  }

  return Response.json({
    message: MESSAGES[outcome.state],
    // The form ignores this; it is here so a failed deploy (keys missing in
    // production) is visible from a single curl rather than from silence.
    stored: outcome.state !== "unconfigured",
  })
}
