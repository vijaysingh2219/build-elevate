import { VerificationEmail } from './templates';
import type { EmailType } from './types';

export const EmailTypes = ['verify-email'] as const;

export const emailTemplates: Record<
  EmailType,
  {
    subject: string;
    render: (props: { name: string; email: string; verificationUrl: string }) => React.ReactNode;
  }
> = {
  'verify-email': {
    subject: 'Verify your email address',
    render: ({ email, name, verificationUrl }) =>
      VerificationEmail({ email, name, verificationUrl }),
  },
};
