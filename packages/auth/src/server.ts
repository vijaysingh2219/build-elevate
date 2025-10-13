import { getTemplate, sendEmail, verifyEmailSchema } from '@workspace/email';
import { verifyEmailRateLimiter } from '@workspace/rate-limit';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../../db/src/client';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { data, success, error } = verifyEmailSchema.safeParse({
        email: user.email,
        name: user.name,
        verificationUrl: url,
      });
      if (error || !success) {
        throw new Error('Failed to send verification email');
      }

      const { success: rateLimitSuccess } = await verifyEmailRateLimiter.limit(user.email);
      if (!rateLimitSuccess) {
        console.log('Rate limit exceeded. Please try again later.');
        return;
      }

      const emailTemplate = getTemplate('verify-email');
      await sendEmail({
        to: user.email,
        subject: emailTemplate.subject,
        react: emailTemplate.render({
          name: data.name,
          email: data.email,
          verificationUrl: data.verificationUrl,
        }),
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

// Export the inferred session type from better-auth
export type Session = typeof auth.$Infer.Session;
