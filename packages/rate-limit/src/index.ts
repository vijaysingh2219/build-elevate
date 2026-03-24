import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
}

export * from './client';
export * from './create';
export * from './limiters';

// Re-export types from Upstash for convenience
export type { Ratelimit } from '@upstash/ratelimit';
