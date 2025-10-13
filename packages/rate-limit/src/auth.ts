import { Ratelimit } from '@upstash/ratelimit';
import { createRateLimiter } from './limiter';

export const verifyEmailRateLimiter = createRateLimiter({
  prefix: 'verify-email',
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 requests per hour
});
