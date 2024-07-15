/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  trailingSlash: true,
  cleanDistDir: true,
  transpilePackages: [
    "@ant-design",
    "antd",
    "rc-util",
    "rc-pagination",
    "rc-picker",
  ],
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'content-type', value: 'application/json' }]
      }
    ]
  }
};

module.exports = nextConfig;