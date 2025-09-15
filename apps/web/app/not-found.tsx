import Logo from '@/components/logo';
import { Button } from '@workspace/ui/components/button';
import { ArrowLeftIcon, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Logo/Icon */}
        <Logo variant="notFound" />

        {/* 404 Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-foreground text-6xl font-bold md:text-8xl">404</h1>
          <h2 className="text-muted-foreground text-xl font-semibold md:text-2xl">
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <p className="text-muted-foreground max-w-md text-center">
          The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or
          you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="default" size="lg" className="rounded-xl">
            <Link href="/">
              <ArrowLeftIcon />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl">
            <Link href="/dashboard">
              <Home />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
