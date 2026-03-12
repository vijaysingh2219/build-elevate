'use client';

import { NameField } from '@/components/form';
import { EmailField } from '@/components/form/email';
import { useRequiredAuthUser } from '@/hooks/use-auth-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { changeEmail, updateUser } from '@workspace/auth/client';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Form } from '@workspace/ui/components/form';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Spinner } from '@workspace/ui/components/spinner';
import { updateProfileSchema } from '@workspace/utils/schemas';
import { UpdateProfileFormValues } from '@workspace/utils/types';
import { User } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function GeneralSettingsPage() {
  const { user, isLoading, refetch } = useRequiredAuthUser();

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (values: UpdateProfileFormValues) => {
      if (!user) throw new Error('User not authenticated');

      const nameChanged = values.name !== user.name;
      const emailChanged = values.email !== user.email;

      if (nameChanged) {
        await updateUser({
          name: values.name,
        });
      }

      if (emailChanged) {
        await changeEmail({
          newEmail: values.email,
          callbackURL: '/settings/general',
        });
      }

      return { nameChanged, emailChanged };
    },
    onSuccess: (result) => {
      if (result.emailChanged) {
        toast.success(
          'Verification email sent! Please check your current email to approve the change.',
          { duration: 5000 },
        );
      } else {
        toast.success('Profile updated successfully!');
      }
      refetch();
    },
    onError: (error: Error) => {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    },
  });

  function onSubmit(values: UpdateProfileFormValues) {
    updateProfileMutation.mutate(values);
  }

  if (isLoading) {
    return (
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        {/* Header Section */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Profile Form Card Skeleton */}
        <div className="bg-card space-y-6 rounded-lg border p-6">
          <div className="space-y-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and personal details.
        </p>
      </div>

      <Card id="profile-information" className="scroll-mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your name and email address. If you change your email, you&apos;ll need to verify
            it again.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <NameField
                control={form.control}
                name="name"
                label="Name"
                description="This is the name that will be displayed on your profile."
              />

              <EmailField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
                description={
                  <>
                    <span className="block">
                      Your email address is used for signing in and receiving notifications.
                    </span>
                    <span className="text-primary mt-2 block">
                      Changing your email will require verification. A confirmation link will be
                      sent to your current email address.
                    </span>
                  </>
                }
              />
            </CardContent>
            <CardFooter className="mt-4">
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending || !form.formState.isDirty}
                className="w-full"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Spinner />
                    Updating profile...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </section>
  );
}
