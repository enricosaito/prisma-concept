import { Editor } from "./editor"

/**
 * O editor, em /keystatic — agora também em produção.
 *
 * Antes esta página dava 404 fora de desenvolvimento, porque no modo local o
 * Keystatic gravava o disco do servidor e isso não faz sentido num deploy. No
 * modo GitHub ele grava o repositório pela API, então a página publicada é o
 * ponto: é dela que você escreve de qualquer navegador.
 *
 * Quem protege agora é o GitHub. Sem uma sessão autenticada o editor não lê nem
 * escreve nada, e entrar não basta: o App só enxerga este repositório, e só
 * quem tem permissão de escrita nele consegue commitar.
 *
 * ⚠️ Um `NotFoundError` apontando para a linha do `<Editor />` abaixo não vem
 * daqui. O `@keystatic/core` tem um `notFound()` próprio, com classe e error
 * boundary próprios, que ele lança quando a entrada aberta não existe —
 * tipicamente uma carta apagada cuja URL ficou na barra de endereços. O Next
 * atribui o erro ao componente React mais próximo que consegue nomear, que é
 * esta página. Confira se a entrada ainda existe em `content/cartas/` antes de
 * mexer aqui.
 */

/**
 * Nada aqui é estático, e dizer isso evita um travamento.
 *
 * Sem esta linha o Next tenta analisar a rota para gerar caminhos estáticos —
 * o log mostra "Failed to generate static paths for /keystatic/[[...params]]" —
 * e para isso carrega o módulo da página num worker. Esse módulo puxa a
 * interface inteira do Keystatic, o worker morre, e tudo que chega na rota vira
 * 500 com "Jest worker encountered child process exceptions".
 */
export const dynamic = "force-dynamic"

const VARIAVEIS = [
  "KEYSTATIC_GITHUB_CLIENT_ID",
  "KEYSTATIC_GITHUB_CLIENT_SECRET",
  "KEYSTATIC_SECRET",
] as const

export default function Page() {
  const faltando = VARIAVEIS.filter((nome) => !process.env[nome])

  /**
   * Em desenvolvimento o editor sobe mesmo sem credenciais, porque é dele que
   * sai a configuração: o Keystatic detecta o que falta e conduz a criação do
   * GitHub App, gravando as variáveis no `.env.local` no fim. Mostrar o aviso
   * aqui trancaria justamente a porta por onde se entra.
   */
  if (faltando.length && process.env.NODE_ENV === "development") {
    return <Editor />
  }

  /**
   * Em produção é o contrário: sem credenciais a interface carregaria e não
   * conseguiria ler nada — a casca vazia que já apareceu uma vez no domínio
   * público. Melhor dizer o que falta do que mostrar um editor que não edita.
   */
  if (faltando.length) {
    return (
      <main
        style={{
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          maxWidth: "34rem",
          margin: "12vh auto",
          padding: "0 1.5rem",
          lineHeight: 1.6,
        }}
      >
        <h1 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
          O editor ainda não está configurado
        </h1>
        <p style={{ marginBottom: "1rem" }}>
          Faltam estas variáveis de ambiente:
        </p>
        <ul style={{ marginBottom: "1rem", paddingLeft: "1.25rem" }}>
          {faltando.map((nome) => (
            <li key={nome}>
              <code>{nome}</code>
            </li>
          ))}
        </ul>
        <p>
          O passo a passo está em <code>docs/editor.md</code>. Enquanto isso, as
          cartas continuam editáveis como arquivos em <code>content/cartas/</code>.
        </p>
      </main>
    )
  }

  return <Editor />
}
