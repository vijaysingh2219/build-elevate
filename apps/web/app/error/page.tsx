'use client';

import Logo from '@/components/logo';
import { Button } from '@workspace/ui/components/button';
import { ArrowLeftIcon, HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

type ErrorType = 'email-required' | 'email-not-verified' | 'unknown';

const errorMessages: Record<
  ErrorType,
  {
    code?: string;
    title: string;
    description: string;
    buttons?: {
      text: string;
      href: string;
      variant: 'link' | 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost';
      icon: React.ElementType;
    }[];
  }
> = {
  'email-required': {
    code: '403',
    title: 'Email Required',
    description:
      "We couldn't retrieve your email from the provider. Please use a different login method.",
    buttons: [
      {
        text: 'Back to Sign In',
        href: '/sign-in',
        variant: 'default',
        icon: ArrowLeftIcon,
      },
      {
        text: 'Go to Home',
        href: '/',
        variant: 'outline',
        icon: HomeIcon,
      },
    ],
  },
  'email-not-verified': {
    code: '403',
    title: 'Email Not Verified',
    description:
      'Please verify your email address before signing in. Check your inbox for a verification email.',
    buttons: [
      {
        text: 'Back to Sign In',
        href: '/sign-in',
        variant: 'default',
        icon: ArrowLeftIcon,
      },
      {
        text: 'Go to Home',
        href: '/',
        variant: 'outline',
        icon: HomeIcon,
      },
    ],
  },
  unknown: {
    code: '500',
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again later.',
    buttons: [
      {
        text: 'Go Back',
        href: 'go-back', // this is handled specially
        variant: 'default',
        icon: ArrowLeftIcon,
      },
      {
        text: 'Back to Home',
        href: '/',
        variant: 'outline',
        icon: ArrowLeftIcon,
      },
    ],
  },
};

function ErrorPageContent() {
  const searchParams = useSearchParams();
  const errorType = (searchParams.get('type') as ErrorType) || 'unknown';
  const router = useRouter();

  const { code, title, description, buttons } = errorMessages[errorType] || errorMessages.unknown;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Logo/Icon */}
        <Logo variant="notFound" />

        {/* Code Heading */}
        <div className="flex flex-col gap-2">
          {code && <h1 className="text-foreground text-6xl font-bold md:text-8xl">{code}</h1>}
          <h2 className="text-muted-foreground text-xl font-semibold md:text-2xl">{title}</h2>
        </div>

        {/* Description */}
        <p className="text-muted-foreground max-w-md text-center">{description}</p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {buttons?.map((button) => {
            const isGoBack = button.href === 'go-back';
            return isGoBack ? (
              <Button
                key={button.text}
                onClick={() => router.back()}
                variant={button.variant}
                size="lg"
                className="cursor-pointer rounded-xl"
                title={button.text}
                aria-label={button.text}
              >
                <button.icon />
                <span>{button.text}</span>
              </Button>
            ) : (
              <Button
                key={button.text}
                asChild
                variant={button.variant}
                size="lg"
                className="rounded-xl"
                title={button.text}
                aria-label={button.text}
              >
                <Link href={button.href}>
                  <button.icon />
                  <span>{button.text}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense>
      <ErrorPageContent />
    </Suspense>
  );
}
