import { AuthForm } from '@/components/auth/auth-form';
import { Suspense } from 'react';

export default function SignUpPage() {
  return (
    <Suspense>
      <AuthForm mode="sign-up" />
    </Suspense>
  );
}
