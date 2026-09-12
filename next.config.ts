import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The archive was at /carta before it was renamed Biblioteca. Any link
      // already shared — or indexed — keeps working. 308, so it is cached and
      // the method is preserved.
      {
        source: "/carta",
        destination: "/biblioteca",
        permanent: true,
      },
      {
        source: "/carta/:slug",
        destination: "/biblioteca/:slug",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
