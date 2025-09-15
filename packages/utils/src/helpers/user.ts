import { emailSchema } from '../schemas';

export function getUsernameFromEmail(email: string): string {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return '';

  const normalizedEmail = email.trim().toLowerCase();

  const atIndex = normalizedEmail.indexOf('@');
  if (atIndex <= 0) return '';

  const username = normalizedEmail.slice(0, atIndex);
  return username;
}
