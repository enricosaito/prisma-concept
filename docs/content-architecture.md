# Arquitetura de conteúdo

Como uma carta sai de um arquivo e chega na tela — e o que trocar no dia em que
isso deixar de ser um arquivo.

Para **escrever** uma carta, o guia é [`docs/escrever-cartas.md`](escrever-cartas.md). Este documento
é sobre o código.

## O caminho

```
content/cartas/<slug>.md
        │
        ├─ frontmatter.ts   separa o YAML do texto
        ├─ parse.ts         valida e devolve um Letter, ou explode com um erro em português
        │
        └─ source.ts        ← a camada de acesso. O ÚNICO lugar do repo que lê disco.
                 │
                 ├─ app/page.tsx              getPublishedLetters("newest")
                 ├─ app/cartas/page.tsx       getPublishedLetters()
                 ├─ app/cartas/[slug]/page.tsx  getLetterSlugs / getLetterBySlug / getLetterMetadata
                 └─ app/sitemap.ts            getPublishedLetters / getLatestLetter
                          │
                          └─ components/letter-body.tsx  renderiza o Markdown
```

`lib/letters/types.ts` e `lib/letters/format.ts` são puros — sem `fs`, sem
React, sem `server-only` — então um client component pode importar um tipo ou um
formatador de data sem arrastar o loader junto. É por isso que **não existe um
`index.ts`** nesta pasta: um barrel reexportando `source.ts` faria
`import { formatDate }` puxar `server-only`, e o primeiro componente de cliente
que quisesse formatar uma data receberia um erro de build incompreensível. O
caminho do import diz de que lado da fronteira você está.

## As cinco funções

```ts
getPublishedLetters(order?: "oldest" | "newest"): LetterMeta[]
getLatestLetter(): LetterMeta | undefined
getLetterBySlug(slug): Letter | undefined
getLetterMetadata(slug): LetterMeta | undefined
getLetterSlugs(): string[]
```

`LetterMeta` é a carta sem o texto; `Letter` é `LetterMeta & { body: string }`.
A separação é real: listagens, sitemap e `generateMetadata` recebem `LetterMeta`,
então um componente de listagem **não consegue** depender de um corpo que ele
nunca renderiza.

`body` é o Markdown cru, nunca uma árvore já parseada. Quem parseia é
`letter-body.tsx`, o que mantém o loader livre de React e deixa o renderizador
trocável.

Tudo é memoizado com `cache()` do React, não com uma variável de módulo: editar
um `.md` não invalida o módulo compilado que guardaria essa variável, e o
`next dev` passaria a servir um texto que você já mudou.

## Rascunhos

Uma linha, no topo de `source.ts`:

```ts
const SHOW_DRAFTS =
  process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview"
```

`readAll()` é a única função que enxerga rascunhos e **não é exportada**. Todas
as outras filtram. Com `dynamicParams = false` na rota da carta, a URL de um
rascunho é um 404 duro em produção, sem invocar função nenhuma.

### Por que preview é seguro

Não por configuração do código, e sim por uma do projeto: `ssoProtection` está
ligado com `deploymentType: "all_except_custom_domains"`. Verificado com um
pedido de verdade — um preview responde **302** para o login da Vercel, e
`www.prismaconcept.com.br` responde **200**. Um buscador não faz login, então
rascunho em preview não é alcançável nem indexável.

> **Se essa proteção for desligada, a linha acima tem que sair junto.** É a
> única coisa que separa um rascunho de um URL público.

### Rascunho não derruba o build

Uma carta que vai ser publicada precisa parsear, ponto: ela quebra o build, que
é o motivo de validar. Um rascunho é outra coisa — está pela metade por
definição e não faz parte do site que está sendo publicado, então não pode
impedir você de subir uma correção sem relação nenhuma com ele.

Então, num build que esconde rascunhos, um arquivo que não parseia vira aviso e
é descartado. `looksPublished()` lê o texto cru da frontmatter (o parse é
justamente o que falhou) e erra para o lado seguro: o que ele não conseguir ler
como `status: draft` explícito é tratado como publicado e continua derrubando o
build.

### A ressalva honesta

O **arquivo** `.md` do rascunho continua indo junto no bundle do deploy (aparece
no file trace da Vercel, como qualquer arquivo que o código lê). Nenhuma rota o
serve e não há caminho de HTTP que chegue nele — mas se um rascunho contiver
algo que não pode sair da sua máquina, o lugar dele não é este repositório.

## O validador

`scripts/check-letters.ts`, via `npm run cartas:check`.

Ele **importa `lib/letters/parse.ts` de verdade**, então não existe uma segunda
cópia das regras que possa divergir do site. O que ele acrescenta são as
checagens que o parser não pode fazer: olhar o disco (as imagens existem?), olhar
o conjunto (slug e issue duplicados, link para um rascunho) e olhar o Markdown
pelo que ele vai virar (uma assinatura de citação com hífen não vira `<cite>` e
não dá erro nenhum — só sai errado na página).

Roda direto no node com `--experimental-strip-types`, sem build e sem
dependência nova. É por isso que os imports dentro de `lib/letters/` são
relativos e com extensão `.ts` explícita, e por que o `tsconfig.json` tem
`allowImportingTsExtensions`. O Turbopack e o `tsc` aceitam os dois.

Erros saem com código ≠ 0; avisos não, porque alguns são escolhas legítimas.

## Trocar por um CMS

O trabalho é reimplementar **os cinco corpos de função** acima, mantendo as
assinaturas, e trocar o formato do corpo em `letter-body.tsx`. Nada em `app/` ou
`components/` muda. Para confirmar que a fronteira continua de pé:

```bash
grep -rn "node:fs" lib app components   # deve devolver só lib/letters/source.ts
```

### O modelo mapeia?

`LetterMeta` tem doze campos escalares e dois objetos de imagem. Tanto o Sanity
quanto o Payload modelam isso sem esforço — o modelo não é o problema. **O corpo
é.**

| | Sanity | Payload | Keystatic |
|---|---|---|---|
| Onde a prosa fica | dataset do fornecedor | Postgres ou Mongo | **nestes mesmos arquivos `.md`** |
| Formato do corpo | Portable Text (JSON) | Lexical/Slate (JSON) | Markdown |
| Migração necessária | `.md` → Portable Text | `.md` → Lexical | **nenhuma** |
| Infra nova | conta + dataset + webhook | banco + auth + migrações | nenhuma |
| Histórico da prosa em git | perdido | perdido | mantido |
| Preview de rascunho | nativo (bom) | nativo | o que já temos |

O que mudaria no código, em qualquer um dos três: os cinco corpos de função em
`source.ts` e o formato do corpo em `letter-body.tsx`. Nada em `app/` ou
`components/`. As URLs continuam estáveis porque o slug é dado, não gerado.

### Recomendação

**Nenhum CMS agora, e o próximo passo concreto é o Keystatic** — quando o atrito
aparecer, não antes.

O raciocínio é que Sanity e Payload cobram um preço específico que esta
publicação não pode pagar barato: a prosa sai do disco. Isso quebra duas coisas
que não são detalhe aqui — o histórico em git de cada frase, e a propriedade,
escrita no `AGENTS.md`, de que o texto protegido **é um arquivo seu**. O Payload
ainda exige Postgres ou Mongo, ou seja, um deploy com estado, auth e migrações
para uma pessoa editar uma carta por semana. O Sanity é mais leve, mas troca
Markdown por Portable Text e adiciona uma segunda linguagem de schema.

O Keystatic não cobra nada disso: é uma interface de administração git-backed
que edita exatamente estes `.md`, com upload de imagem. Migração zero, porque não
há o que migrar.

E o mais importante: **o atrito que justificaria um CMS não existe hoje.**
Converter prosa em código, que era o problema real, acabou. Escrever é colar num
`.md` e rodar um comando. Um CMS resolveria "editar do celular sem clonar o
repositório" — e essa dor só é real quando você escrever com frequência longe do
computador. Até lá, seria infraestrutura comprada adiantado.

Para confirmar que a fronteira continua de pé antes de qualquer troca:

```bash
grep -rn "node:fs" lib app components   # deve devolver só lib/letters/source.ts
```

## Decisões que não são óbvias

**Markdown puro, não MDX.** Um `.md` é dado inerte; um `.mdx` é um módulo
JavaScript, onde um `<` ou `{` perdido no meio de um texto em português é um
erro de build cuja única correção é editar a prosa — exatamente o que o
`AGENTS.md` proíbe. `.md` é MDX válido, então mudar de ideia depois é renomear.

**Validação na mão, não zod.** São doze campos escritos por uma pessoa que
também controla o build, e a validação roda dentro de `generateStaticParams`, de
modo que uma carta malformada quebra o `next build` antes de qualquer deploy. O
que importa de verdade é a mensagem nomeando o arquivo e o campo em português, e
customizar um `ZodError` para isso custa mais do que escrever as oitenta linhas.
Vale reconsiderar quando aparecer um segundo tipo de conteúdo.

**`issue` é a identidade.** Explícito, escolhido pelo autor, estável, e já
carrega significado além da exibição — `issueColor()` em `lib/spectrum.ts` o
mapeia para uma faixa do espectro. Um UUID numa publicação endereçada por slug
seria cerimônia.

**A citação vira `<cite>` por retag.** `lib/letters/rehype-quote-cite.ts` troca a
tag do último parágrafo de uma citação quando ele começa com travessão. Ele
**retagueia e nunca reescreve**: nenhum caractere do texto é adicionado,
removido ou trocado. Essa propriedade é o que torna o pipeline compatível com a
regra do `AGENTS.md` — se mexer no arquivo, mantenha-a verdadeira.
