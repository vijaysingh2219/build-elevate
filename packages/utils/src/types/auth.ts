import { z } from 'zod';
import {
  changePasswordSchema,
  emailSchema,
  passwordSchema,
  setPasswordSchema,
  signInSchema,
  signUpSchema,
  updateProfileSchema,
} from '../schemas';

export type EmailInput = z.infer<typeof emailSchema>;

export type PasswordInput = z.infer<typeof passwordSchema>;

export type SignInFormValues = z.infer<typeof signInSchema>;

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
