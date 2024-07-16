/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  trailingSlash: true,
  cleanDistDir: true,
  transpilePackages: [],
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'content-type', value: 'application/json' }]
      }
    ]
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;