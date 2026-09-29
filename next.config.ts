import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    // The archive has been renamed twice: /carta -> /biblioteca -> /cartas.
    // Both older paths point straight at /cartas rather than chaining through
    // each other, so an old link costs one redirect, not two. 308, so it is
    // cached and the method is preserved.
    return [
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
