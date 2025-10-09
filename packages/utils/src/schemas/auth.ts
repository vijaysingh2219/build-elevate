import { z } from 'zod';

export const emailSchema = z.string().email({
  message: 'Please enter a valid email address.',
});

export const passwordSchema = z
  .string()
  .min(8, {
    message: 'Password must be at least 8 characters.',
  })
  .max(100, {
    message: 'Password must be less than 100 characters.',
  });

export const nameSchema = z
  .string()
  .min(3, {
    message: 'Name must be at least 3 characters.',
  })
  .max(100, {
    message: 'Name must be less than 100 characters.',
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});
