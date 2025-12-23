'use client';

import { ConnectedAccounts, ConnectedAccountsSkeleton } from '@/components/connected-accounts';
import { DeleteAccountForm, DeleteAccountFormSkeleton } from '@/components/delete-account-form';
import { ExtraSecurity, ExtraSecuritySkeleton } from '@/components/extra-security';
import { PasswordForm, PasswordFormSkeleton } from '@/components/password-form';
import { TwoFactorSetup, TwoFactorSetupSkeleton } from '@/components/two-factor-setup';
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
        <PasswordFormSkeleton />

        {/* Connected Accounts Skeleton */}
        <ConnectedAccountsSkeleton />

        {/* Two Factor Setup Card Skeleton */}
        <TwoFactorSetupSkeleton />

        {/* Extra Security Card Skeleton */}
        <ExtraSecuritySkeleton />

        {/* Delete Account Card Skeleton */}
        <DeleteAccountFormSkeleton />
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

      <ExtraSecurity />

      {/* Danger Zone - Delete Account */}
      <DeleteAccountForm />
    </section>
  );
}
