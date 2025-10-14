import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  basePath: '/docs',
  trailingSlash: false,
  reactStrictMode: true,
  experimental: {
    // Ensure MDX content files are traced into the serverless functions in production
    outputFileTracingIncludes: {
      '/llms.txt': ['./content/**/*'],
      '/llms-full.txt': ['./content/**/*'],
      '/api/[protocol]': ['./content/**/*'],
    },
  },
  async rewrites() {
    return [
      {
        source: '/:path*/llms.txt',
        // Forward the slug as a query param so the route can reliably resolve it after rewrite
        destination: '/llms.txt?slug=:path*',
      },
    ];
  },
};

export default withMDX(config);
