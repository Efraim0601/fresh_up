/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PWA (manifest + service worker) sera branche en Phase 1/2 via next-pwa
  // ou une implementation Workbox manuelle. Non actif dans ce scaffold.
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
