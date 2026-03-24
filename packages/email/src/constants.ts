import {
  ChangeEmailTemplate,
  ResetPasswordTemplate,
  VerificationEmail,
  WelcomeTemplate,
} from './templates';
import type {
  ChangeEmailProps,
  EmailProps,
  EmailType,
  ResetPasswordProps,
  VerificationEmailProps,
  WelcomeEmailProps,
} from './types';

export const EmailTypes = ['welcome', 'verify-email', 'change-email', 'reset-password'] as const;

export const emailTemplates: Record<
  EmailType,
  {
    subject: string;
    render: (props: EmailProps) => React.ReactNode;
  }
> = {
  welcome: {
    subject: 'Welcome!',
    render: (props) => WelcomeTemplate(props as WelcomeEmailProps),
  },
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
