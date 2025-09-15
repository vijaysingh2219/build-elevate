import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Public routes that anyone can access
const PUBLIC_ROUTES = ['/sign-in', '/sign-up', '/error'];

// Routes only for unauthenticated users
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;

  const { pathname, search } = req.nextUrl;

  const isPublicRoute =
    pathname === '/' || PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.includes(route));

  // ✅ 1. Block unauthenticated access to protected routes
  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = encodeURIComponent(pathname + search);
    const redirectUrl = new URL(`/sign-in?callbackUrl=${callbackUrl}`, nextUrl);
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ 2. Prevent logged-in users from visiting auth routes
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|public|api).*)'],
};
