import { useSession } from '@workspace/auth/client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

type AuthUser = NonNullable<ReturnType<typeof useSession>['data']>['user'];

interface UseAuthUserOptions {
  redirectOnUnauthenticated?: boolean;
  redirectTo?: string;
}

interface UseAuthUserReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: ReturnType<typeof useSession>['error'];
  refetch: ReturnType<typeof useSession>['refetch'];
}

interface UseRequiredAuthUserReturn {
  user: AuthUser;
  isLoading: false;
  error: ReturnType<typeof useSession>['error'];
  refetch: ReturnType<typeof useSession>['refetch'];
}

interface UseRequiredAuthUserLoadingReturn {
  user: null;
  isLoading: true;
  error: ReturnType<typeof useSession>['error'];
  refetch: ReturnType<typeof useSession>['refetch'];
}

/**
 * Hook for handling authentication state with optional auto-redirect functionality.
 *
 * @param options - Configuration options
 * @param options.redirectOnUnauthenticated - Whether to redirect when user is not authenticated
 * @param options.redirectTo - Custom redirect path (defaults to '/sign-in')
 * @returns Authentication state and user data
 */
export function useAuthUser(options?: UseAuthUserOptions): UseAuthUserReturn {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const shouldRedirect = options?.redirectOnUnauthenticated ?? false;
  const redirectTo = options?.redirectTo ?? '/';

  // Only redirect if explicitly enabled and not on auth pages
  useEffect(() => {
    if (shouldRedirect && !session.isPending && !session.data?.user) {
      // Don't redirect if already on auth pages
      if (!pathname.startsWith('/sign-in') && !pathname.startsWith('/sign-up')) {
        router.push(redirectTo);
      }
    }
  }, [shouldRedirect, session.isPending, session.data?.user, router, pathname, redirectTo]);

  return {
    user: session.data?.user || null,
    isLoading: session.isPending,
    isAuthenticated: !!session.data?.user,
    error: session.error,
    refetch: session.refetch,
  };
}

/**
 * Hook that guarantees an authenticated user is present.
 * Automatically redirects to sign-in if not authenticated.
 * Should only be used in components that require authentication.
 *
 * @returns Either user data when authenticated or loading state during auth check/redirect
 */
export function useRequiredAuthUser():
  | UseRequiredAuthUserReturn
  | UseRequiredAuthUserLoadingReturn {
  const { user, isLoading, isAuthenticated, error, refetch } = useAuthUser({
    redirectOnUnauthenticated: true,
  });

  if (isLoading) {
    return {
      user: null,
      isLoading: true,
      error,
      refetch,
    };
  }

  if (!isAuthenticated || !user) {
    return {
      user: null,
      isLoading: true,
      error,
      refetch,
    };
  }

  // This hook guarantees user is not null when not loading
  return {
    user: user!,
    isLoading: false,
    error,
    refetch,
  };
}
