import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import type { NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import supertest from 'supertest';

jest.mock('@workspace/auth', () => ({
  authClient: {},
  auth: {},
}));

jest.mock('@workspace/rate-limit', () => ({
  createRateLimiter: jest.fn(() => ({
    limit: jest.fn(() =>
      Promise.resolve({
        success: true,
        limit: 100,
        remaining: 99,
        reset: Date.now() + 60000,
      }),
    ),
  })),
  slidingWindow: jest.fn((requests: number, window: string) => ({
    requests,
    window,
  })),
}));

jest.mock('../../middleware/auth', () => ({
  requireAuth: jest.fn((req: Request, res: Response, next: NextFunction) => {
    Object.assign(req, {
      user: { id: 'test-user-123', email: 'test@example.com' },
      session: { id: 'session-123' },
    });
    next();
  }),
}));

process.env.ALLOWED_ORIGINS = 'https://example.com';
delete process.env.CORS_ALLOW_MISSING_ORIGIN;

import { createServer } from '../../server';

describe('API Server', () => {
  let app: ReturnType<typeof createServer>;
  let server: Server;

  beforeAll(() => {
    app = createServer();
    server = app.listen(0);
  });

  afterAll(() => {
    server.close();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await supertest(app).get('/health').expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return a valid ISO timestamp', async () => {
      const response = await supertest(app).get('/health').expect(200);

      expect(() => new Date(response.body.timestamp).toISOString()).not.toThrow();
    });
  });

  describe('404 handling', () => {
    it.each(['/non-existent-route', '/api/non-existent'])(
      'should return 404 for %s',
      async (path) => {
        const response = await supertest(app).get(path).expect(404);

        expect(response.body).toHaveProperty('error', 'Route not found');
        expect(response.body).toHaveProperty('path', path);
      },
    );
  });

  describe('CORS', () => {
    beforeAll(async () => jest.spyOn(console, 'error').mockImplementation(() => {}));
    afterAll(async () => jest.restoreAllMocks());

    it('should set CORS headers for allowed origin', async () => {
      const response = await supertest(app)
        .get('/health')
        .set('Origin', 'https://example.com')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('https://example.com');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should reject disallowed origin with CORS error', async () => {
      const response = await supertest(app).get('/health').set('Origin', 'https://evil.example');

      expect(response.headers['access-control-allow-origin']).toBeUndefined();
      expect(response.headers['access-control-allow-credentials']).toBeUndefined();
    });

    it('should block requests with missing origin by default', async () => {
      const response = await supertest(app).get('/health');

      expect(response.headers['access-control-allow-origin']).toBeUndefined();
      expect(response.headers['access-control-allow-credentials']).toBeUndefined();
    });
  });

  describe('Security headers', () => {
    it('should set helmet security headers', async () => {
      const response = await supertest(app).get('/health');

      expect(response.headers).toHaveProperty('x-dns-prefetch-control');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });
});
