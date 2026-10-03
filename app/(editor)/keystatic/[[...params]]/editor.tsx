"use client"

import { makePage } from "@keystatic/next/ui/app"

import config from "@/keystatic.config"

/**
 * A interface do editor.
 *
 * `"use client"` não é opcional: a config carrega as definições dos campos, que
 * são funções, e um componente de servidor não consegue passá-las adiante. Sem
 * isto a página monta e renderiza um documento vazio, sem erro nenhum no
 * console — leva um tempo até se perceber o que houve.
 */
export const Editor = makePage(config)
