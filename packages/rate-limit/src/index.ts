import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
}

export * from './auth';
export * from './limiter';

// Re-export types from Upstash for convenience
export type { Ratelimit } from '@upstash/ratelimit';
