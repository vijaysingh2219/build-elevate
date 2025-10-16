import { Ratelimit } from '@upstash/ratelimit';
import { createRateLimiter } from './limiter';

export const verifyEmailRateLimiter = createRateLimiter({
  prefix: 'verify-email',
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 requests per hour
});

export const changeEmailRateLimiter = createRateLimiter({
  prefix: 'change-email',
  limiter: Ratelimit.slidingWindow(2, '24 h'), // 2 requests per 24 hours
});

export const resetPasswordRateLimiter = createRateLimiter({
  prefix: 'reset-password',
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 requests per hour
});
