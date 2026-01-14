import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
}

// Client auth (for React components - only import in client-side code)
export * from './client';

// Server auth (for API routes and server components)
export * from './server';

// Next handlers (for Next.js API routes)
export * from './next-handlers';

// Node.js helpers (for Express)
export * from './node-handlers';
