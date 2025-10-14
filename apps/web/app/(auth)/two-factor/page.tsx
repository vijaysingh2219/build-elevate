import { TwoFactorVerification } from '@/components/two-factor-verification';
import { Suspense } from 'react';

export default function TwoFactorPage() {
  return (
    <Suspense fallback={<TwoFactorVerificationSkeleton />}>
      <TwoFactorVerification />
    </Suspense>
  );
}

function TwoFactorVerificationSkeleton() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="border-border bg-card text-card-foreground rounded-xl border shadow">
          <div className="flex flex-col space-y-1.5 p-6 text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <div className="h-6 w-6 animate-pulse rounded bg-gray-300" />
            </div>
            <div className="mx-auto h-6 w-3/4 animate-pulse rounded bg-gray-300" />
            <div className="mx-auto mt-2 h-4 w-full animate-pulse rounded bg-gray-200" />
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="mx-auto h-4 w-32 animate-pulse rounded bg-gray-300" />
                <div className="flex justify-center">
                  <div className="flex gap-2">
                    {Array.from({ length: 6 }, (_, i) => (
                      <div key={i} className="h-12 w-10 animate-pulse rounded-md bg-gray-200" />
                    ))}
                  </div>
                </div>
                <div className="mx-auto h-3 w-48 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300" />
              <div className="mx-auto h-4 w-40 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
