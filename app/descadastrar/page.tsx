import type { Metadata } from "next"

import { UnsubscribeButton } from "./unsubscribe-button"

export const metadata: Metadata = {
  title: "Cancelar inscrição",
  // Fora do índice: é uma página de serviço, alcançada por um link assinado de
  // dentro de um e-mail, e não tem nada que um buscador deva oferecer a alguém.
  robots: { index: false, follow: false },
}

/**
 * Onde o leitor confirma a saída.
 *
 * Ela existe porque o GET da rota de descadastro não pode dar baixa em ninguém:
 * pré-carregadores de link, antivírus de e-mail e o próprio Gmail buscam as URLs
 * de uma mensagem para inspecioná-las, e se um GET mudasse estado, metade da
 * lista cairia fora sem ninguém ter clicado. O botão aqui dá o POST.
 *
 * O caminho de um clique dos clientes de e-mail não passa por aqui — eles dão
 * POST direto na rota, e o leitor nunca vê esta página. Ela é para quem clica no
 * link do rodapé.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>
}) {
  const { t } = await searchParams

  return (
    <div className="mx-auto max-w-5xl px-5 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[32rem]">
        <h1 className="font-heading text-3xl leading-tight font-medium text-balance sm:text-4xl">
          Cancelar a inscrição
        </h1>

        {t ? (
          <>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Você deixa de receber as cartas. Pode voltar quando quiser — e o
              arquivo continua aberto de todo jeito.
            </p>
            <UnsubscribeButton token={t} />
          </>
        ) : (
          /* Sem token não há quem descadastrar, e pedir o e-mail aqui daria a
             qualquer um a chance de tirar outra pessoa da lista. */
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Este link está incompleto. Use o link “Cancele a inscrição” que vem
            no fim de qualquer e-mail nosso.
          </p>
        )}
      </div>
    </div>
  )
}
