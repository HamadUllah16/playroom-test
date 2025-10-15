import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  basePath: '/docs',
  trailingSlash: false,
  reactStrictMode: true,
  // outputFileTracingIncludes: {
  //   '/': ['./content/**/*'], // path relative to apps/docs
  // },
  // Ensure llms.txt rewrite works as before
  async rewrites() {
    return [
      {
        source: '/:path*/llms.txt',
        destination: '/llms.txt?slug=:path*',
      },
    ]
  },
}

export default withMDX(config)
