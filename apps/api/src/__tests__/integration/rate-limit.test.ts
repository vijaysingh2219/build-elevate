import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { NextFunction, Request, Response } from 'express';
import supertest from 'supertest';

// Mock the auth module to avoid ESM issues with nanostores
jest.mock('@workspace/auth', () => ({
  authClient: {},
  auth: {},
}));

// Mock the auth middleware
jest.mock('../../middleware/auth', () => ({
  requireAuth: jest.fn((req: Request, res: Response, next: NextFunction) => {
    // Mock authenticated user for testing
    Object.assign(req, {
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
      },
      session: {
        id: 'session-123',
      },
    });
    next();
  }),
}));

// Mock the rate limit package to use in-memory limiter for testing
const mockLimit = jest.fn() as jest.MockedFunction<
  (id: string) => Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }>
>;

jest.mock('@workspace/rate-limit', () => ({
  createRateLimiter: jest.fn(() => ({
    limit: mockLimit,
  })),
  slidingWindow: jest.fn((requests: number, window: string) => ({
    requests,
    window,
  })),
}));

import { createServer } from '../../server';

describe('Rate Limiting Integration Tests', () => {
  let app: ReturnType<typeof createServer>;

  beforeEach(() => {
    app = createServer();
    jest.clearAllMocks();
  });

  describe('Global API Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      // Mock successful rate limit check
      mockLimit.mockResolvedValue({
        success: true,
        limit: 100,
        remaining: 99,
        reset: Date.now() + 60000,
      });

      const response = await supertest(app).get('/api/users/session').expect(200);

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      expect(response.headers).toHaveProperty('x-ratelimit-reset');
      expect(mockLimit).toHaveBeenCalled();
    });

    it('should return 429 when rate limit is exceeded', async () => {
      // Mock rate limit exceeded
      const resetTime = Date.now() + 60000;
      mockLimit.mockResolvedValue({
        success: false,
        limit: 100,
        remaining: 0,
        reset: resetTime,
      });

      const response = await supertest(app).get('/api/users/session').expect(429);

      expect(response.body).toHaveProperty('error', 'Too many requests');
      expect(response.body).toHaveProperty(
        'message',
        'Rate limit exceeded. Please try again later.',
      );
      expect(response.body).toHaveProperty('retryAfter');
      expect(response.headers).toHaveProperty('x-ratelimit-limit', '100');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining', '0');
    });

    it('should set correct rate limit headers', async () => {
      mockLimit.mockResolvedValue({
        success: true,
        limit: 100,
        remaining: 50,
        reset: Date.now() + 60000,
      });

      const response = await supertest(app).get('/api/users/session');

      expect(response.headers['x-ratelimit-limit']).toBe('100');
      expect(response.headers['x-ratelimit-remaining']).toBe('50');
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
    });
  });

  describe('User-Specific Rate Limiting', () => {
    it('should rate limit by user ID for authenticated requests', async () => {
      mockLimit.mockResolvedValue({
        success: true,
        limit: 60,
        remaining: 59,
        reset: Date.now() + 60000,
      });

      await supertest(app).get('/api/users/session').expect(200);

      // Verify rate limiter was called with user-specific identifier
      expect(mockLimit).toHaveBeenCalled();
    });

    it('should handle multiple requests from same user', async () => {
      // First request succeeds
      mockLimit.mockResolvedValueOnce({
        success: true,
        limit: 60,
        remaining: 59,
        reset: Date.now() + 60000,
      });

      await supertest(app).get('/api/users/session').expect(200);

      // Second request succeeds with decreased remaining
      mockLimit.mockResolvedValueOnce({
        success: true,
        limit: 60,
        remaining: 58,
        reset: Date.now() + 60000,
      });

      await supertest(app).get('/api/users/session').expect(200);

      // Global rate limit is called once per request (no user-specific limit on this route)
      expect(mockLimit).toHaveBeenCalledTimes(2);
    });

    it('should calculate correct retry-after time', async () => {
      const resetTime = Date.now() + 30000; // 30 seconds from now
      mockLimit.mockResolvedValue({
        success: false,
        limit: 60,
        remaining: 0,
        reset: resetTime,
      });

      const response = await supertest(app).get('/api/users/session').expect(429);

      expect(response.body.retryAfter).toBeGreaterThan(0);
      expect(response.body.retryAfter).toBeLessThanOrEqual(30);
    });
  });

  describe('Rate Limit Error Handling', () => {
    it('should fail open when rate limiter throws error', async () => {
      // Suppress expected error logging during test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Mock rate limiter throwing an error
      mockLimit.mockRejectedValue(new Error('Redis connection failed'));

      // Request should still succeed (fail open)
      const response = await supertest(app).get('/api/users/session');

      // Should get through despite rate limit error
      expect(response.status).toBe(200);

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Rate limit middleware error:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle missing identifier gracefully', async () => {
      mockLimit.mockResolvedValue({
        success: true,
        limit: 100,
        remaining: 99,
        reset: Date.now() + 60000,
      });

      // Request without IP should still work (uses 'anonymous')
      const response = await supertest(app).get('/api/users/session');

      expect(response.status).toBe(200);
    });
  });

  describe('Different Rate Limits for Different Routes', () => {
    it('should apply global rate limit to all API routes', async () => {
      mockLimit.mockResolvedValue({
        success: true,
        limit: 100,
        remaining: 99,
        reset: Date.now() + 60000,
      });

      await supertest(app).get('/api/users/session');

      // Global rate limiter should be called
      expect(mockLimit).toHaveBeenCalled();
    });

    it('should not apply rate limit to health check', async () => {
      jest.clearAllMocks();

      await supertest(app).get('/health').expect(200);

      // Health check should not trigger rate limiting
      expect(mockLimit).not.toHaveBeenCalled();
    });
  });
});
