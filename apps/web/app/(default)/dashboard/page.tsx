'use client';

import { useAuthUser } from '@/hooks/use-auth-user';
import DashboardLoading from './loading';

export default function DashboardPage() {
  const { user, isLoading } = useAuthUser();
  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <section className="max-w-2xl p-12">
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      <div className="rounded-md py-4">
        <p>
          <span>Welcome back, </span>
          <span className="font-bold">{user.name || user.username || user.email}</span>!
        </p>
      </div>
    </section>
  );
}
