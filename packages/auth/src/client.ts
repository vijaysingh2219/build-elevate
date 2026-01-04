import { twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { keys } from './keys';

export const authClient = createAuthClient({
  baseURL: keys().NEXT_PUBLIC_BASE_URL,
  plugins: [twoFactorClient()],
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  revokeSession,
  sendVerificationEmail,
  listAccounts,
  linkSocial,
  unlinkAccount,
  twoFactor,
  changePassword,
  changeEmail,
  updateUser,
  deleteUser,
  requestPasswordReset,
  resetPassword,
  $Infer,
} = authClient;
