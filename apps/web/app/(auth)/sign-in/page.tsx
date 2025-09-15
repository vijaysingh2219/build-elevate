import { AuthForm } from '@/components/auth-form';
import { Suspense } from 'react';

export default function SignInPage() {
  return (
    <Suspense>
      <AuthForm mode="sign-in" />
    </Suspense>
  );
}
