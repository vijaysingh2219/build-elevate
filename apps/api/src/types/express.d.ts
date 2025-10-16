import { type Session } from '@workspace/auth';

declare global {
  namespace Express {
    interface Request {
      session?: Session | null;
      user?: Session['user'] | null;
    }
  }
}

export {};
