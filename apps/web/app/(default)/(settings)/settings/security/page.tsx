'use client';

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
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
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

      <TwoFactorSetup isEnabled={user.twoFactorEnabled ?? false} showStatus={true} />

      {/* Danger Zone - Delete Account */}
      <DeleteAccountForm />
    </section>
  );
}
