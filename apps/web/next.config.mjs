/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui', '@workspace/auth', '@workspace/email', '@workspace/db', '@workspace/rate-limiter', '@workspace/utils', '@t3-oss/env-nextjs'],
  output: 'standalone'
};

export default nextConfig;
