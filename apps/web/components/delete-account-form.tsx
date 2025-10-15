'use client';

import { useHasPassword } from '@/hooks/use-has-password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { deleteUser } from '@workspace/auth/client';
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
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
import { deleteAccountSchema } from '@workspace/utils/schemas';
import { DeleteAccountFormValues } from '@workspace/utils/types';
import { AlertCircle, Lock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function DeleteAccountForm() {
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();
  const { data: hasPassword, isLoading: checkingPassword } = useHasPassword();

  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: '',
      confirmation: '',
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (values: DeleteAccountFormValues) => {
      const result = await deleteUser({
        password: values.password,
        callbackURL: '/goodbye',
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to delete account');
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      setShowDialog(false);
      form.reset();

      // Redirect to goodbye page
      router.push('/goodbye');
    },
    onError: (error: Error) => {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account');
    },
  });

  const handleDeleteAccount = (values: DeleteAccountFormValues) => {
    deleteAccountMutation.mutate(values);
  };

  const handleOpenDialog = () => {
    if (checkingPassword) return;

    if (hasPassword === false) {
      toast.error('Please set a password first to delete your account', {
        description: 'OAuth users need to set a password before they can delete their account.',
      });
      return;
    }

    setShowDialog(true);
  };

  return (
    <>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Show warning if user doesn't have a password */}
          {!checkingPassword && hasPassword === false && (
            <Alert variant="default">
              <AlertCircle />
              <AlertTitle>Password Required</AlertTitle>
              <AlertDescription>
                You signed in with Google OAuth and don&apos;t have a password set. Please set a
                password first to delete your account.
                <Button asChild variant="link" className="h-auto p-0">
                  <Link href="#set-password">Set Password</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action is permanent and irreversible. All your data, including your profile,
              settings, and any associated content will be permanently deleted.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            onClick={handleOpenDialog}
            disabled={checkingPassword || hasPassword === false}
          >
            {checkingPassword ? (
              <>
                <Spinner />
                Checking...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please confirm you want to permanently delete your
              account.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleDeleteAccount)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className="text-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="text-muted-foreground absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Enter your password to confirm it&apos;s you.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type &quot;DELETE&quot; to confirm <span className="text-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="DELETE" autoComplete="off" {...field} />
                    </FormControl>
                    <FormDescription>
                      Type DELETE in capital letters to confirm deletion.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  disabled={deleteAccountMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={
                    deleteAccountMutation.isPending || form.watch('confirmation') !== 'DELETE'
                  }
                >
                  {deleteAccountMutation.isPending ? (
                    <>
                      <Spinner />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
