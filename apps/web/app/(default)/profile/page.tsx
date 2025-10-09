'use client';

import { useRequiredAuthUser } from '@/hooks/use-auth-user';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { formatDate } from '@workspace/utils';
import ProfileLoading from './loading';

export default function ProfilePage() {
  const { user, isLoading } = useRequiredAuthUser();

  if (isLoading) {
    return <ProfileLoading />;
  }

  const cardDetails = [
    { label: 'Name', value: user.name || '—' },
    { label: 'User ID', value: user.id },
    { label: 'Email Verified', value: user.emailVerified ? 'Yes' : 'No' },
    { label: 'Profile Image', value: user.image ? 'Available' : 'No image set' },
    { label: 'Created At', value: formatDate(user.createdAt, 'PPpp') },
    { label: 'Updated At', value: formatDate(user.updatedAt, 'PPpp') },
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="ring-border h-20 w-20 rounded-md ring-2">
              <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
              <AvatarFallback className="text-3xl capitalize">
                {user.name?.[0] ?? '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-semibold">
                {user.name || 'Unnamed User'}
              </CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          {cardDetails.map(({ label, value }) => (
            <div key={label}>
              <p className="text-muted-foreground">{label}</p>
              <p className="break-words font-medium">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
