import { Metadata } from 'next';

export const generatePageMetadata = (
  title: string,
  description: string,
  options?: {
    ogImage?: string;
    noindex?: boolean;
  },
): Metadata => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://build-elevate.vercel.app';
  const ogImage = options?.ogImage || '/og-image.png';
  const formattedTitle = `${title} | build-elevate`;

  return {
    title: formattedTitle,
    description,
    robots: {
      index: !options?.noindex,
      follow: true,
    },
    openGraph: {
      title: formattedTitle,
      description,
      url: baseUrl,
      siteName: 'build-elevate',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: formattedTitle,
      description,
      images: [ogImage],
    },
  };
};

// Page-specific metadata
export const pageMetadata = {
  home: {
    title: 'build-elevate | Fullstack Turborepo Starter Template',
    description:
      'A modern fullstack starter template with Next.js, TypeScript, Prisma, Better Auth, and shadcn/ui. Build scalable applications with Turborepo.',
  },
  dashboard: {
    title: 'Dashboard',
    description: 'Manage your account and view your dashboard.',
  },
  profile: {
    title: 'Profile',
    description: 'View and edit your profile information.',
  },
  settings: {
    general: {
      title: 'General Settings',
      description: 'Update your general account settings and preferences.',
    },
    security: {
      title: 'Security Settings',
      description: 'Manage your account security, passwords, and sessions.',
    },
    activity: {
      title: 'Activity',
      description: 'View your account activity and login history.',
    },
  },
  auth: {
    signIn: {
      title: 'Sign In',
      description: 'Sign in to your build-elevate account.',
    },
    signUp: {
      title: 'Sign Up',
      description: 'Create a new build-elevate account.',
    },
    forgotPassword: {
      title: 'Forgot Password',
      description: 'Reset your password.',
    },
    resetPassword: {
      title: 'Reset Password',
      description: 'Create a new password for your account.',
    },
    twoFactor: {
      title: 'Two-Factor Authentication',
      description: 'Enter your two-factor authentication code to verify your identity.',
    },
  },
  goodbye: {
    title: 'Account Deleted',
    description: 'Your account has been successfully deleted.',
  },
  notFound: {
    title: '404 - Page Not Found',
    description: 'The page you are looking for could not be found.',
  },
  error: {
    title: 'Error',
    description: 'An error occurred while processing your request.',
  },
};
