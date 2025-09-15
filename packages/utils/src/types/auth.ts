import { z } from 'zod';
import { emailSchema, loginSchema, passwordSchema } from '../schemas';

export type EmailInput = z.infer<typeof emailSchema>;

export type PasswordInput = z.infer<typeof passwordSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;
