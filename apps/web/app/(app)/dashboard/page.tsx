import { auth } from '@workspace/auth/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

export default async function DashboardPage(): Promise<ReactElement> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect('/sign-in');
  }

  const user = session.user;

  return (
    <section className="max-w-2xl p-12">
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      <div className="rounded-md py-4">
        <p>
          <span>Welcome back, </span>
          <span className="font-bold">{user.name || user.email}</span>!
        </p>
      </div>
    </section>
  );
}
