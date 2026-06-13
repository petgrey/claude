/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/claude',
  assetPrefix: '/claude/',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
