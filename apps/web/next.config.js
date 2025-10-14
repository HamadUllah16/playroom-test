/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  async rewrites() {
    const docsUrl = process.env.DOCS_URL;
    return [
      // Handle /images/* requests (redirect to docs app)
      {
        source: '/images/:path*',
        destination: `${docsUrl}/docs/images/:path*`
      },
      // Static assets for docs (with /docs prefix)
      {
        source: '/docs/images/:path*',
        destination: `${docsUrl}/docs/images/:path*`
      },
      {
        source: '/docs/demos/:path*',
        destination: `${docsUrl}/docs/demos/:path*`
      },
      // Docs pages (with / for navigation but served from docs app with /docs)
      {
        source: '/docs',
        destination: `${docsUrl}/docs`
      },
      {
        source: '/docs/:path*',
        destination: `${docsUrl}/docs/:path*`
      }
    ]
  },
};
export default nextConfig;