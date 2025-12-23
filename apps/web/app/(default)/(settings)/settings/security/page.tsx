'use client';

import { ConnectedAccounts, ConnectedAccountsSkeleton } from '@/components/connected-accounts';
import { DeleteAccountForm } from '@/components/delete-account-form';
import { PasswordForm } from '@/components/password-form';
import { TwoFactorSetup } from '@/components/two-factor-setup';
import { useRequiredAuthUser } from '@/hooks/use-auth-user';
import { useHasPassword } from '@/hooks/use-has-password';
import { Skeleton } from '@workspace/ui/components/skeleton';

export default function SecurityPage() {
  const { user, isLoading } = useRequiredAuthUser();
  const { isLoading: checkingPassword, refetch: refetchPasswordStatus } = useHasPassword();

  if (isLoading || checkingPassword) {
    return (
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        {/* Header Section */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Password Form Card Skeleton */}
        <div className="bg-card space-y-6 rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Connected Accounts Skeleton */}
        <ConnectedAccountsSkeleton />

        {/* Two Factor Setup Card Skeleton */}
        <div className="bg-card space-y-6 rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Delete Account Card Skeleton */}
        <div className="border-destructive/50 bg-destructive/5 space-y-6 rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground">
          Manage your account security settings and two-factor authentication.
        </p>
      </div>

      {/* Password management - shows Set Password or Change Password based on user's current state */}
      <PasswordForm onSuccess={() => refetchPasswordStatus()} />

      <ConnectedAccounts />

      <TwoFactorSetup isEnabled={user.twoFactorEnabled ?? false} showStatus={true} />

      {/* Danger Zone - Delete Account */}
      <DeleteAccountForm />
    </section>
  );
}
