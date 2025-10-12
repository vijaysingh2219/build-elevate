export interface EmailServiceConfig {
  resendToken: string;
  defaultFromAddress?: string;
  isDevelopment: boolean;
}

export function loadEmailConfig(): EmailServiceConfig {
  const resendToken = process.env.RESEND_TOKEN;
  const defaultFromAddress = process.env.RESEND_EMAIL_FROM;
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!resendToken) {
    throw new Error(
      'RESEND_TOKEN is not defined in environment variables. ' +
        'Please add RESEND_TOKEN to your .env file.',
    );
  }

  return {
    resendToken,
    defaultFromAddress,
    isDevelopment,
  };
}
