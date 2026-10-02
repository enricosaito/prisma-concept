# Arquitetura de conteúdo

Como uma carta sai de um arquivo e chega na tela — e o que trocar no dia em que
isso deixar de ser um arquivo.

Para **escrever** uma carta, o guia é `content/cartas/README.md`. Este documento
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
const SHOW_DRAFTS = process.env.NODE_ENV === "development"
```

`readAll()` é a única função que enxerga rascunhos e **não é exportada**. Todas
as outras filtram. Como `next build` roda com `NODE_ENV=production` em todo
lugar — local, preview da Vercel e produção —, um rascunho nunca chega a ser
gerado. Com `dynamicParams = false` na rota da carta, a URL de um rascunho é um
404 duro, sem invocar função nenhuma.

Uma ressalva honesta: o **arquivo** `.md` do rascunho continua indo junto no
bundle do deploy (ele aparece no file trace da Vercel, como qualquer arquivo que
o código lê). Ele não é servido por nenhuma rota e não há caminho de HTTP que
chegue nele — mas se um rascunho contiver algo que não pode sair da sua máquina,
o lugar dele não é este repositório.

## Trocar por um CMS

O trabalho é reimplementar **os cinco corpos de função** acima, mantendo as
assinaturas, e trocar o formato do corpo em `letter-body.tsx`. Nada em `app/` ou
`components/` muda. Para confirmar que a fronteira continua de pé:

```bash
grep -rn "node:fs" lib app components   # deve devolver só lib/letters/source.ts
```

Quando chegar a hora, o candidato mais provável é o **Keystatic**: um admin
git-backed que edita exatamente estes arquivos `.md`. Sem banco, sem migração de
conteúdo, sem tirar a prosa do seu controle — você ganha uma interface com
upload de imagem e perde nada. Sanity e Payload resolvem um problema que esta
publicação não tem: o Payload exige Postgres ou Mongo (um deploy com estado,
auth e migrações para uma pessoa editar uma carta por semana), e o Sanity move a
prosa para o dataset de um fornecedor, o que custa o histórico em git e a
propriedade de que o texto protegido é um arquivo seu.

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
