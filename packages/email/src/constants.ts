import { ChangeEmailTemplate, VerificationEmail } from './templates';
import type { ChangeEmailProps, EmailType, VerificationEmailProps } from './types';

export const EmailTypes = ['verify-email', 'change-email'] as const;

export const emailTemplates: Record<
  EmailType,
  { subject: string; render: (props: VerificationEmailProps | ChangeEmailProps) => React.ReactNode }
> = {
  'verify-email': {
    subject: 'Verify your email address',
    render: (props) => VerificationEmail(props as VerificationEmailProps),
  },
  'change-email': {
    subject: 'Confirm your email address change',
    render: (props) => ChangeEmailTemplate(props as ChangeEmailProps),
  },
};
