import { ChangeEmailTemplate, ResetPasswordTemplate, VerificationEmail } from './templates';
import type {
  ChangeEmailProps,
  EmailType,
  ResetPasswordProps,
  VerificationEmailProps,
} from './types';

export const EmailTypes = ['verify-email', 'change-email', 'reset-password'] as const;

export const emailTemplates: Record<
  EmailType,
  {
    subject: string;
    render: (
      props: VerificationEmailProps | ChangeEmailProps | ResetPasswordProps,
    ) => React.ReactNode;
  }
> = {
  'verify-email': {
    subject: 'Verify your email address',
    render: (props) => VerificationEmail(props as VerificationEmailProps),
  },
  'change-email': {
    subject: 'Confirm your email address change',
    render: (props) => ChangeEmailTemplate(props as ChangeEmailProps),
  },
  'reset-password': {
    subject: 'Reset your password',
    render: (props) => ResetPasswordTemplate(props as ResetPasswordProps),
  },
};
