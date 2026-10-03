# Como publicar uma carta

> Agora também dá para escrever pelo navegador: `npm run dev` e
> http://localhost:3000/keystatic. O guia do editor está em
> [`docs/editor.md`](../../docs/editor.md). O que está abaixo continua valendo —
> os arquivos são os mesmos, e editar à mão segue funcionando.

Uma carta é **um arquivo** nesta pasta. Nada mais precisa ser editado — nem
rota, nem lista, nem código. A home, o arquivo, o sitemap e as tags de
compartilhamento se montam a partir daqui.

## Os três passos

1. **Copie `modelo.md`** e renomeie para o slug da carta.
   O nome do arquivo vira a URL: `nada-vem-do-nada.md` → `/cartas/nada-vem-do-nada`.
   Só minúsculas, números e hifens. Sem acento, sem espaço, sem maiúscula.
2. **Preencha a frontmatter** (o bloco entre as duas linhas `---`) e cole o
   texto abaixo dela.
3. **Rode `npm run cartas:check`**, corrija o que ele apontar, troque
   `status: draft` por `status: published` e faça o commit. A carta entra no ar
   no deploy seguinte.

Enquanto o status for `draft`, a carta **não existe** para o site publicado: não
é gerada, não entra na contagem do arquivo, não entra no sitemap, e a URL dá
404.

## Conferindo antes de publicar

```bash
npm run cartas:check
```

Lê todas as cartas e lista **todos** os problemas de uma vez — não para no
primeiro. Além de validar a frontmatter, ele checa o que só dá para saber
olhando o disco e o texto:

- imagens de `cover`/`thumb` que não existem em `public/`
- links internos quebrados, e link de uma carta publicada para um rascunho
  (que daria 404 em produção)
- `#` onde devia ser `##`
- assinatura de citação que **não vai virar `<cite>`** — hífen no lugar do
  travessão, ou colada no mesmo parágrafo da citação
- carta publicada com data no futuro

Erros derrubam o comando; avisos não, porque alguns podem estar certos de
propósito. No fim ele imprime o que está no ar e o que é rascunho.

## Vendo o rascunho antes de publicar

**No computador:** `npm run dev` mostra rascunhos como se estivessem publicados.

**No celular, ou para mandar para alguém:** faça push da branch e abra o preview
deployment da Vercel. Rascunhos aparecem lá, com a tipografia e o layout de
produção. Esses URLs ficam atrás do login da Vercel — quem não estiver logado na
conta é redirecionado —, então o rascunho não é público e nenhum buscador chega
nele. **Produção nunca mostra rascunho**, em nenhuma hipótese.

## O que a `date` faz e o que ela não faz

Ela ordena o arquivo e aparece sob o título. **Ela não agenda.** Uma carta com
`status: published` e data no mês que vem vai ao ar no próximo deploy do mesmo
jeito — e ainda aparece como a mais recente na home. Para agendar de verdade,
deixe em `draft` e troque no dia. O `cartas:check` avisa quando vê uma data no
futuro, porque quase sempre é um ano digitado errado.

## A frontmatter

| Campo            | Obrigatório | O que é                                                      |
| ---------------- | ----------- | ------------------------------------------------------------ |
| `issue`          | sim         | O número da carta. Único, e não muda depois de publicada.     |
| `status`         | sim¹        | `draft` ou `published`.                                       |
| `date`           | sim         | `"AAAA-MM-DD"`. Ordena o arquivo e aparece sob o título.       |
| `category`       | sim         | `Tecnologia`, `Arte`, `Design` ou `Escrita`.                   |
| `readingMinutes` | sim         | Minutos de leitura, do seu próprio julgamento.                 |
| `title`          | sim         | O título da carta.                                            |
| `dek`            | sim         | A linha que aparece sob o título nas listagens.                |
| `cover`          | não         | A imagem no topo da carta. `src` + `alt`.                      |
| `thumb`          | não         | A imagem nas listagens, quando a arte pede um formato em pé.   |
| `updated`        | não         | `"AAAA-MM-DD"`, só quando você revisa uma carta já publicada.  |
| `seoTitle`       | não         | Substitui o título no Google, quando ele ficaria longo demais. |
| `seoDescription` | não         | Substitui o `dek` na descrição de busca.                       |

¹ Se você esquecer `status`, a carta é tratada como rascunho. É de propósito:
esquecer um campo deve custar uma carta que não saiu, nunca uma que saiu antes
da hora.

**Coloque todo texto entre aspas.** Um título com `: ` no meio quebra o YAML
sem aspas, e o `dek` quase sempre tem um travessão.

Sobre imagens: `src` é um caminho dentro de `public/`, começando com `/`. O
`alt` é obrigatório — descreva o que a imagem mostra para quem não pode vê-la,
ou use `""` se ela for puramente decorativa. A proporção da casa para `thumb` é
**3:5** (por exemplo 1080×1800); `cover` fica bem em 3:2. Para fugir disso,
`ratio: "3 / 5"` manda na caixa e `position: "top"` escolhe o corte.

## O texto

Markdown comum. Uma linha em branco separa um parágrafo do outro; não importa se
o parágrafo está numa linha só ou quebrado em várias.

```markdown
## Um título de seção

Parágrafo normal, com **negrito**, _itálico_ e [um link](https://exemplo.com).

- item de lista
- outro item

> A citação.
>
> — Quem disse
```

Dois detalhes que valem lembrar:

- **Use `##` para as seções**, não `#`. O `#` é o título da carta, e ele já vem
  da frontmatter.
- **A assinatura de uma citação** é o último parágrafo dela, começando com
  travessão (`—`, não hífen). O travessão fica no texto; o site só muda a tag.

## O que o site nunca faz com o seu texto

Nada. Não há correção automática, não há "smart quotes", não há reflow: os
caracteres que você digitar são os que vão para a tela. Esta pasta está no
`.prettierignore` justamente por isso — o formatador reescreveria seus
parágrafos no primeiro "format on save".

A regra que proíbe o agente de alterar a prosa está em `AGENTS.md`, na raiz.
