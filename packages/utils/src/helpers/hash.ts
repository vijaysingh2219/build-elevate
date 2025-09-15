import { compare, hash } from 'bcryptjs';

export function generateToken(): string {
  return crypto.getRandomValues(new Uint8Array(32)).toString();
}

export const hashToken = async (token: string) => {
  const SALT_ROUNDS = 10;
  return hash(token, SALT_ROUNDS);
};

export const verifyToken = async (plainToken: string, hashedToken: string) => {
  return compare(plainToken, hashedToken);
};
