import { Home } from 'lucide-react';
import { Metadata } from 'next';

export const siteConfig: Metadata = {
  title: 'Turborepo - Starter Template',
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
  ],
  openGraph: {
    title: 'Turborepo - Starter Template',
    description: 'A starter template for building applications with Turborepo.',
    url: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://turborepo.org',
    siteName: 'Turborepo - Starter Template',
    images: [
      {
        url: 'https://turborepo.com/_next/image?url=%2Fimages%2Fdocs%2Fslow-tasks-dark.png&w=1920&q=75',
        width: 1200,
        height: 630,
        alt: 'Turborepo - Starter Template',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turborepo - Starter Template',
    description: 'A starter template for building applications with Turborepo.',
    images: [
      'https://turborepo.com/_next/image?url=%2Fimages%2Fdocs%2Fslow-tasks-dark.png&w=1920&q=75',
    ],
  },
};

export const config = {
  name: 'Turborepo.com',
  description: siteConfig.description,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://turborepo.org',
  domain: process.env.NEXT_PUBLIC_DOMAIN ?? 'turborepo.org',
  nav: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
  ],
};
