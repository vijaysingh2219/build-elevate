import { twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [twoFactorClient()],
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  sendVerificationEmail,
  twoFactor,
  changePassword,
  changeEmail,
  updateUser,
  deleteUser,
  forgetPassword,
  resetPassword,
  $Infer,
} = authClient;
