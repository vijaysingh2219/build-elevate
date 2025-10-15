import { changeEmailSchema, getTemplate, sendEmail, verifyEmailSchema } from '@workspace/email';
import { changeEmailRateLimiter, verifyEmailRateLimiter } from '@workspace/rate-limit';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { twoFactor } from 'better-auth/plugins';
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
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        const { data, success, error } = changeEmailSchema.safeParse({
          currentEmail: user.email,
          newEmail,
          name: user.name,
          verificationUrl: url,
        });
        if (error || !success) {
          throw new Error('Failed to send email change verification');
        }

        const { success: rateLimitSuccess } = await changeEmailRateLimiter.limit(user.email);
        if (!rateLimitSuccess) {
          console.log('Rate limit exceeded. Please try again later.');
          return;
        }

        const emailTemplate = getTemplate('change-email');
        await sendEmail({
          to: user.email, // Send to current email
          subject: emailTemplate.subject,
          react: emailTemplate.render({
            name: data.name,
            currentEmail: data.currentEmail,
            newEmail: data.newEmail,
            verificationUrl: data.verificationUrl,
          }),
        });
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    twoFactor({
      issuer: 'BuildElevate',
    }),
  ],
});

// Export the inferred session type from better-auth
export type Session = typeof auth.$Infer.Session;
