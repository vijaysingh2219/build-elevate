'use client';

import { registerUser } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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
import { loginSchema } from '@workspace/utils/schemas';
import { LoginFormValues } from '@workspace/utils/types';
import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function CredentialsForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(mode === 'sign-up' ? { username: undefined } : {}),
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('Account created! Please sign in.');
      router.push('/sign-in');
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong');
    },
  });

  async function onSubmit(values: LoginFormValues) {
    if (mode === 'sign-in') {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        switch (result.error) {
          case 'CredentialsSignin':
            toast.error('Sign in failed. Please check your credentials.');
            break;
          case 'user_not_found':
            toast.error('No account found with that email.');
            break;
          case 'invalid_password':
            toast.error('Incorrect password.');
            break;
          case 'invalid_format':
            toast.error('Invalid email or password format.');
            break;
          case 'missing_credentials':
            toast.error('Please enter both email and password.');
            break;
          default:
            toast.error('Something went wrong. Please try again.');
        }
      } else if (result?.ok) {
        const url = new URL(result.url || '');
        if (url.pathname.startsWith('/error')) {
          router.push('/error' + url.search);
        } else {
          toast.success('Signed in!');
          router.push('/dashboard');
        }
      } else if (!result?.ok) {
        toast.error('Something went wrong. Please try again.');
      }
    } else {
      if (values.username?.trim() === '') {
        values.username = undefined;
      }
      mutate(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        {mode === 'sign-up' && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="text-muted-foreground absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
                    <Input
                      type="text"
                      placeholder="e.g. your-name"
                      autoComplete="name"
                      className="pl-10"
                      required={false}
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
                  <>Enter the password for your account.</>
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
