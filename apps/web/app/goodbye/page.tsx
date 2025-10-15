import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function GoodbyePage() {
  return (
    <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-b px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-2xl">Account Deleted Successfully</CardTitle>
          <CardDescription>
            Your account and all associated data have been permanently removed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground text-sm">
            We&apos;re sorry to see you go! Your account has been successfully deleted from our
            system.
          </p>
          <p className="text-muted-foreground text-sm">
            If you change your mind, you&apos;re always welcome to create a new account and join us
            again.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/sign-up">Create New Account</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
