import z from 'zod';
import { EmailTypes } from './constants';
import { resendEmailSchema } from './schemas';

export type EmailType = (typeof EmailTypes)[number];

export type EmailContent = z.infer<typeof resendEmailSchema>;

export interface VerificationEmailProps {
  name: string;
  email: string;
  verificationUrl: string;
}

export interface ChangeEmailProps {
  currentEmail: string;
  newEmail: string;
  name: string;
  verificationUrl: string;
}

export interface ResetPasswordProps {
  name: string;
  resetUrl: string;
}

export interface WelcomeEmailProps {
  name: string;
  getStartedUrl: string;
}

export type EmailProps =
  | VerificationEmailProps
  | ChangeEmailProps
  | ResetPasswordProps
  | WelcomeEmailProps;
