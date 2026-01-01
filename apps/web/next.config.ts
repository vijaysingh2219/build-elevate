import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@workspace/ui', '@workspace/auth', '@workspace/email'],
  output: 'standalone',
};

export default nextConfig;
