# Como publicar uma carta

Uma carta é **um arquivo** nesta pasta. Nada mais precisa ser editado — nem
rota, nem lista, nem código. A home, o arquivo, o sitemap e as tags de
compartilhamento se montam a partir daqui.

## Os três passos

1. **Copie `modelo.md`** e renomeie para o slug da carta.
   O nome do arquivo vira a URL: `nada-vem-do-nada.md` → `/cartas/nada-vem-do-nada`.
   Só minúsculas, números e hifens. Sem acento, sem espaço, sem maiúscula.
2. **Preencha a frontmatter** (o bloco entre as duas linhas `---`) e cole o
   texto abaixo dela.
3. **Troque `status: draft` por `status: published`** quando a carta estiver
   pronta, e faça o commit. A carta entra no ar no deploy seguinte.

Enquanto o status for `draft`, a carta aparece em `npm run dev` e **não existe**
para o site publicado: não é gerada, não entra na contagem do arquivo, não entra
no sitemap, e a URL dá 404.

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
