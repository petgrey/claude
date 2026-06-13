/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip static generation issues in build environments
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
