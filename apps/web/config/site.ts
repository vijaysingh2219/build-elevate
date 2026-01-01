import { Home } from 'lucide-react';
import { Metadata } from 'next';
import { env } from '../env';

export const siteConfig: Metadata = {
  title: 'build-elevate',
  description: 'A starter template for building applications with Turborepo.',
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  keywords: [
    'turborepo',
    'starter',
    'template',
    'react',
    'typescript',
    'nextjs',
    'tailwindcss',
    'prisma',
    'postgresql',
    'shadcn/ui',
    'better-auth',
    'resend',
    'react-email',
  ],
  openGraph: {
    title: 'build-elevate',
    description: 'A starter template for building applications with Turborepo.',
    url: env.NEXT_PUBLIC_BASE_URL,
    siteName: 'build-elevate',
    images: [
      {
        url: 'https://turborepo.com/_next/image?url=%2Fimages%2Fdocs%2Fslow-tasks-dark.png&w=1920&q=75',
        width: 1200,
        height: 630,
        alt: 'build-elevate',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'build-elevate',
    description: 'A starter template for building applications with Turborepo.',
    images: [
      'https://turborepo.com/_next/image?url=%2Fimages%2Fdocs%2Fslow-tasks-dark.png&w=1920&q=75',
    ],
  },
};

export const config = {
  name: 'build-elevate',
  description: siteConfig.description,
  baseUrl: env.NEXT_PUBLIC_BASE_URL,
  domain: env.NEXT_PUBLIC_DOMAIN,
  providers: [
    {
      id: 'google',
      name: 'Google',
    },
  ],
  nav: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
  ],
};
