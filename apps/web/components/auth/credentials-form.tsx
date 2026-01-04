'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { sendVerificationEmail, signIn, signUp } from '@workspace/auth/client';
import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { Spinner } from '@workspace/ui/components/spinner';
import { signInSchema, signUpSchema } from '@workspace/utils/schemas';
import { SignInFormValues, SignUpFormValues } from '@workspace/utils/types';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function CredentialsForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm<SignInFormValues | SignUpFormValues>({
    resolver: zodResolver(mode === 'sign-up' ? signUpSchema : signInSchema),
    defaultValues:
      mode === 'sign-up' ? { name: '', email: '', password: '' } : { email: '', password: '' },
  });

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: SignInFormValues | SignUpFormValues) => {
      if (mode === 'sign-up') {
        const signUpValues = values as SignUpFormValues;
        return signUp.email({
          email: signUpValues.email,
          password: signUpValues.password,
          name: signUpValues.name,
        });
      }
      const signInValues = values as SignInFormValues;
      return signIn.email({
        email: signInValues.email,
        password: signInValues.password,
        callbackURL: callbackUrl,
      });
    },
    onSuccess: (data, variables) => {
      if (data?.error) {
        if (data.error.status === 403 && data.error.code === 'EMAIL_NOT_VERIFIED') {
          toast.error('Please verify your email address before signing in.', {
            action: {
              label: 'Resend email',
              onClick: async () => {
                try {
                  const { error } = await sendVerificationEmail({ email: variables.email });
                  if (error) {
                    toast.error('Too many requests. Please try again later.');
                    return;
                  }
                  toast.success('Verification email sent. Please check your inbox.');
                } catch (error) {
                  console.error('Error resending verification email: ', error);
                  toast.error('Failed to resend verification email.');
                }
              },
            },
          });
          return;
        }
        toast.error(data.error.message || 'Something went wrong');
      } else {
        if (mode === 'sign-up') {
          toast.success(
            'Account created successfully! Please check your email to verify your account.',
          );
          router.push('/sign-in');
        } else {
          const signInData = data.data;

          // Check if 2FA is required
          if ('twoFactorRedirect' in signInData && signInData.twoFactorRedirect === true) {
            toast.info('Two-factor authentication required');
            router.push(`/two-factor?callbackUrl=${encodeURIComponent(callbackUrl)}`);
            return;
          }

          toast.success('Signed in successfully!');
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });

  async function onSubmit(values: SignInFormValues | SignUpFormValues) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        {mode === 'sign-up' && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel>
                  Name <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="text-muted-foreground absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
                    <Input
                      type="text"
                      placeholder="e.g. Your Name"
                      autoComplete="name"
                      className="pl-10"
                      required
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <FormLabel>
                Email <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
                  <Input
                    type="email"
                    placeholder="yourname@example.com"
                    autoComplete="email"
                    className="pl-10"
                    required
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>We&apos;ll never share your email with anyone else.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <FormLabel>
                Password <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
                    autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                    className="pl-10"
                    required
                    {...field}
                  />
                  <Button
                    type="button"
                    size="icon"
                    className="text-muted-foreground hover:text-muted-foreground absolute right-0 top-1/2 -translate-y-1/2 transform bg-transparent hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                {mode === 'sign-in' ? (
                  <span className="flex items-center justify-between">
                    <span>Enter the password for your account.</span>
                    <Link
                      href="/forgot-password"
                      className="text-muted-foreground hover:text-foreground underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </span>
                ) : (
                  <>Choose a strong password with at least 8 characters.</>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mb-6 w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              {mode === 'sign-in' ? 'Signing in...' : 'Creating account...'}
            </>
          ) : mode === 'sign-in' ? (
            'Sign in'
          ) : (
            'Sign up'
          )}
        </Button>
      </form>
      {mode === 'sign-in' ? (
        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      ) : (
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      )}
    </Form>
  );
}
