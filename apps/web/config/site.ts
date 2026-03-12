import { Home } from 'lucide-react';
import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://build-elevate.vercel.app';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? 'turborepo.org';

const DESCRIPTION = 'A starter template for building applications with Turborepo.';

export const siteConfig: Metadata = {
  title: 'Build Elevate',
  description: DESCRIPTION,
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  metadataBase: new URL(BASE_URL),
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
    title: 'Build Elevate',
    description: 'A starter template for building applications with Turborepo.',
    url: BASE_URL,
    siteName: 'Build Elevate',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Build Elevate',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build Elevate',
    description: 'A starter template for building applications with Turborepo.',
    images: [`${BASE_URL}/og-image.png`],
  },
};

export const config = {
  name: 'Build Elevate',
  description: DESCRIPTION,
  baseUrl: BASE_URL,
  domain: DOMAIN,
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
