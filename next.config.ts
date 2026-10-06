import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    // The archive has been renamed twice: /carta -> /biblioteca -> /cartas.
    // Both older paths point straight at /cartas rather than chaining through
    // each other, so an old link costs one redirect, not two. 308, so it is
    // cached and the method is preserved.
    //
    // Enquanto o /cartas abaixo for temporário, /carta e /biblioteca custam
    // dois saltos em vez de um: eles continuam apontando para /cartas, que
    // por ora manda para /. É deliberado — eles são permanentes e dizem a
    // verdade sobre onde o arquivo mora, e quando a página voltar o caminho
    // volta a ser direto sem que ninguém mexa neles.
    return [
      // Temporários, 307, e é de propósito. /cartas e /assinar existiam como
      // páginas e saíram enquanto há uma carta publicada: o arquivo não tinha
      // o que arquivar e a assinatura virou um diálogo. Um 308 permanente
      // ficaria em cache no navegador e no índice do Google, e trazer as
      // páginas de volta exigiria esperar esse cache expirar. Com 307, apagar
      // estas duas entradas restaura tudo na hora.
      //
      // Cobrem endereços que estão soltos no mundo: o botão dos e-mails de
      // boas-vindas já enviados aponta para /cartas, e ninguém pode consertar
      // um e-mail entregue.
      {
        source: "/cartas",
        destination: "/",
        permanent: false,
      },
      {
        source: "/assinar",
        destination: "/",
        permanent: false,
      },
      {
        source: "/carta",
        destination: "/cartas",
        permanent: true,
      },
      {
        source: "/carta/:slug",
        destination: "/cartas/:slug",
        permanent: true,
      },
      {
        source: "/biblioteca",
        destination: "/cartas",
        permanent: true,
      },
      {
        source: "/biblioteca/:slug",
        destination: "/cartas/:slug",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
