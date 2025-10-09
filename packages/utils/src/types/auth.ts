import { z } from 'zod';
import { emailSchema, passwordSchema, signInSchema, signUpSchema } from '../schemas';

export type EmailInput = z.infer<typeof emailSchema>;

export type PasswordInput = z.infer<typeof passwordSchema>;

export type SignInFormValues = z.infer<typeof signInSchema>;

export type SignUpFormValues = z.infer<typeof signUpSchema>;
