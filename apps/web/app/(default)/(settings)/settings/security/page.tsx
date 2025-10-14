'use client';

import { PasswordForm } from '@/components/password-form';
import { TwoFactorSetup } from '@/components/two-factor-setup';
import { useRequiredAuthUser } from '@/hooks/use-auth-user';
import { useHasPassword } from '@/hooks/use-has-password';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';

export default function SecurityPage() {
  const { user, isLoading } = useRequiredAuthUser();
  const { isLoading: checkingPassword, refetch: refetchPasswordStatus } = useHasPassword();

  if (isLoading || checkingPassword) {
    return (
      <section className="w-xl mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div>
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account security settings and two-factor authentication.
        </p>
      </div>

      {/* Password management - shows Set Password or Change Password based on user's current state */}
      <PasswordForm onSuccess={() => refetchPasswordStatus()} />

      <TwoFactorSetup isEnabled={user.twoFactorEnabled ?? false} />

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Additional security information about your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm">Email Verified</p>
            <p className="font-medium">{user.emailVerified ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Two-Factor Authentication</p>
            <p className="font-medium">{user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
