import z from 'zod';
import { EmailTypes } from './constants';
import { resendEmailSchema } from './schemas';

export type EmailType = (typeof EmailTypes)[number];

export type EmailContent = z.infer<typeof resendEmailSchema>;
