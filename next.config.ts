/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper caching behavior for Next.js 15
  experimental: {
    // Enable the new App Router cache
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
