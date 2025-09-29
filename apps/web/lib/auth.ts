import { PrismaAdapter } from '@auth/prisma-adapter';
import { getUsernameFromEmail, verifyToken } from '@workspace/utils/helpers';
import { loginSchema } from '@workspace/utils/schemas';
import type { NextAuthResult, Session } from 'next-auth';
import NextAuth from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { prisma } from '../../../packages/db/src';

const NEXT_AUTH_CONFIG = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: {
          type: 'email',
          label: 'Email',
          placeholder: 'johndoe@gmail.com',
        },
        password: {
          type: 'password',
          label: 'Password',
          placeholder: '*****',
        },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const passwordsMatch = await verifyToken(password, user.password);
        if (!passwordsMatch) return null;

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/sign-in',
    error: '/error',
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (['github', 'google'].includes(account?.provider || '')) {
        if (!user.email) {
          return '/error?type=email-required';
        }
      }

      if (account?.provider !== 'credentials') return true;

      // NOTE: Email verification is not yet implemented
      // To enable, uncomment the following lines and the related code in the registration route

      // const existingUser = await prisma.user.findUnique({
      //   where: { id: user.id },
      // });

      // Prevent sign in without email verification
      // if (!existingUser?.emailVerified) return '/error?type=email-not-verified';

      return true;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }: { token: JWT }) {
      if (!token.sub) return token;

      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub },
      });
      if (!existingUser) return token;

      const existingAccount = await prisma.account.findFirst({
        where: { userId: existingUser.id },
      });

      token.id = existingUser.id;
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.username = existingUser.username;
      token.email = existingUser.email;
      return token;
    },
  },
  adapter: {
    ...PrismaAdapter(prisma),
    async createUser(user: Omit<AdapterUser, 'id'>) {
      const username = getUsernameFromEmail(user.email ?? '');

      // Create user in the database
      const newUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          username,
          password: null,
          image: user.image,
        },
      });

      return {
        id: newUser.id,
        name: newUser.name ?? undefined,
        username: newUser.username ?? null,
        email: newUser.email ?? '',
        emailVerified: newUser.emailVerified ?? null,
        image: newUser.image ?? undefined,
        isOAuth: true,
      };
    },
  },
  session: { strategy: 'jwt' },
});

export async function registerUser(values: { email: string; password: string; username?: string }) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || 'Failed to sign up');
  }

  return data;
}

export const handlers: typeof NEXT_AUTH_CONFIG.handlers = NEXT_AUTH_CONFIG.handlers;
export const auth: NextAuthResult['auth'] = NEXT_AUTH_CONFIG.auth;
export const signIn: NextAuthResult['signIn'] = NEXT_AUTH_CONFIG.signIn;
export const signOut: NextAuthResult['signOut'] = NEXT_AUTH_CONFIG.signOut;

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Failed to fetch user');
  }
};
