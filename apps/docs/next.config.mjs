import fs from 'fs'
import path from 'path'
import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

// Resolve absolute path to your content directory
const contentPath = path.join(process.cwd(), '/content')

// Log during build (useful for debugging in Vercel logs)
if (fs.existsSync(contentPath)) {
  console.log('✅ Including content directory in build:', contentPath)
} else {
  console.warn('⚠️ Content directory not found:', contentPath)
}

/** @type {import('next').NextConfig} */
const config = {
  basePath: '/docs',
  trailingSlash: false,
  reactStrictMode: true,

  experimental: {
    // Ensure the server bundle includes markdown sources used at runtime
    outputFileTracingIncludes: {
      '/llms.txt': ['./content/**', './.source/**'],
    },
  },

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
