/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Handle node: protocol imports
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        zlib: false,
        buffer: false,
        crypto: false,
        'node:fs': false,
        'node:path': false,
        'node:stream': false,
        'node:buffer': false,
        'node:crypto': false,
        'node:zlib': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
