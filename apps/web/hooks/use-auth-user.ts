import { useSession } from 'next-auth/react';

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username: string | null;
  isOAuth: boolean;
}

export function useAuthUser() {
  const { data: session, status } = useSession();
  return {
    user: session?.user as User,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}
