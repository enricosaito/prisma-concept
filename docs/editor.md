# O editor

Um editor no navegador, em `/keystatic`, sobre os mesmos arquivos `.md` de
sempre. Não é um CMS que guarda o conteúdo em outro lugar: é uma interface
sobre `content/cartas/`. Editar pelo editor e editar no seu editor de texto são
a mesma coisa, e nada no site precisou saber que ele existe.

Foi escolhido no lugar de um CMS hospedado porque a prosa continua sendo um
arquivo seu, versionado no git frase por frase — a propriedade em que a regra
do `AGENTS.md` se apoia.

```bash
npm run dev     # depois abra http://localhost:3000/keystatic
```

---

## Escrever

**New Carta** cria uma carta. O formulário à direita é a frontmatter; o painel
à esquerda é o texto, com negrito, itálico, links, listas e citação com campo
próprio para a fonte.

**Save** grava no arquivo. Continua sendo você quem commita — o editor mexe no
disco, não no git.

Enquanto **Situação** for *Rascunho*, a carta não existe para o site publicado:
não é gerada, não entra na contagem do arquivo, não entra no sitemap, e a URL
dá 404. Trocar para *Publicada* e commitar é o que a põe no ar.

> O editor guarda as alterações não salvas no navegador. Se você abrir uma
> carta e os campos vierem estranhos depois de alguma mudança de schema, limpe
> os dados do site em localhost — é rascunho velho, não o arquivo.

---

## A frontmatter tem todos os campos, sempre

Esta é a única coisa que o editor mudou nos arquivos, e vale saber por quê.

Antes, um campo opcional não usado era simplesmente omitido. O Keystatic valida
o arquivo inteiro contra o schema: uma chave que ele não conhece impede a carta
de abrir, e uma chave ausente onde ele espera um valor impede o save. Então
agora todos os campos existem sempre:

| Campo | Vazio é |
| --- | --- |
| `seoTitle`, `seoDescription`, `cover.position`, `cover.ratio`, `thumb.position` | `""` |
| `updated` | `null` — o campo de data não aceita texto vazio |

Para o site isso não muda nada: `lib/letters/parse.ts` trata vazio e nulo como
ausente, exatamente como tratava a chave omitida. O modelo em memória é o mesmo,
e as quatro páginas saem com HTML idêntico ao de antes.

---

## O caminho das imagens é texto

O campo de imagem do Keystatic quer gerir o arquivo ele mesmo e não reconheceu
os caminhos que a frontmatter já guardava: lia vazio, e salvar teria apagado as
capas. Por isso `cover.src` e `thumb.src` são campos de texto.

Na prática: capa nova vai para `public/covers/` e o caminho se escreve no campo,
como `/covers/minha-capa.jpg`. Para arte preparada fora em 3:5, isso já era o
fluxo.

`npm run cartas:check` avisa se um caminho apontar para um arquivo que não
existe.

---

## O editor tem a própria raiz

O app tem dois layouts raiz, via grupos de rota: `(site)` e `(editor)`. Não é
preferência — dentro do layout da PRISMA o Keystatic renderizava um documento
vazio, sem erro nenhum no console. Grupos de rota não aparecem na URL, então
nenhum endereço mudou.

`app/(editor)/layout.tsx` de propósito **não** importa `globals.css`: as cores e
a tipografia da PRISMA são para as cartas, e aplicá-las por cima do editor só
faria os dois brigarem.

---

## Editar de qualquer lugar, depois

Hoje o editor é local: roda com `npm run dev`, na sua máquina. Para escrever de
qualquer navegador sem clonar o repositório, o Keystatic tem o modo GitHub — ele
commita por você, e aí publicar é apertar Save e esperar o deploy.

A troca é em `keystatic.config.ts`:

```ts
storage: { kind: "github", repo: "enricosaito/prisma-concept" }
```

Mais um GitHub App (criado por você em github.com/settings/apps) e três
variáveis de ambiente. Vale fazer quando a vontade de escrever longe do
computador aparecer — não antes.
