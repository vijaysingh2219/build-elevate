'use client';

import { PasswordField } from '@/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '@workspace/auth/client';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Form } from '@workspace/ui/components/form';
import { Spinner } from '@workspace/ui/components/spinner';
import { resetPasswordSchema } from '@workspace/utils/schemas';
import { ResetPasswordFormValues } from '@workspace/utils/types';
import { CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      setTokenError(true);
      if (error === 'invalid_token') {
        toast.error('Invalid or expired reset link', {
          description: 'Please request a new password reset link.',
        });
      }
    }
  }, [error]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (values: ResetPasswordFormValues) => {
      if (!token) {
        throw new Error('Reset token is missing');
      }

      const result = await resetPassword({
        newPassword: values.password,
        token,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to reset password');
      }

      return result.data;
    },
    onSuccess: () => {
      setResetSuccess(true);
      form.reset();
    },
    onError: (error: Error) => {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Failed to reset password');
    },
  });

  const handleSubmit = (values: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(values);
  };

  if (tokenError || !token) {
    return (
      <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-b px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <Lock className="h-10 w-10 text-red-600 dark:text-red-500" />
            </div>
            <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
            <CardDescription>This password reset link is invalid or has expired</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm">
              Password reset links expire after 1 hour for security reasons.
            </p>
            <p className="text-muted-foreground text-sm">
              Please request a new password reset link to continue.
            </p>
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/forgot-password">Request New Link</Link>
              </Button>
            </div>
            <div className="pt-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-in">Back to Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-b px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
            </div>
            <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
            <CardDescription>Your password has been successfully updated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm">
              You can now sign in with your new password.
            </p>
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-b px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <PasswordField
                control={form.control}
                name="password"
                label="New Password"
                placeholder="Minimum 8 characters"
                description="Password must be 8-100 characters long and contain a mix of letters and numbers"
                autoComplete="new-password"
              />

              <PasswordField
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter your password"
                description="Re-enter your password to confirm"
                autoComplete="new-password"
              />

              <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending ? (
                  <>
                    <Spinner />
                    Resetting password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>

              <div className="text-center">
                <Button asChild variant="link" className="text-sm">
                  <Link href="/sign-in">Back to Sign In</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-b px-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center py-12">
              <Spinner />
            </CardContent>
          </Card>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
