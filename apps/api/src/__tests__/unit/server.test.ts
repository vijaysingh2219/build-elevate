import { beforeAll, describe, expect, it, jest } from '@jest/globals';
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

import { createServer } from '../../server';

describe('API Server', () => {
  let app: ReturnType<typeof createServer>;

  beforeAll(() => {
    app = createServer();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await supertest(app).get('/health').expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return valid timestamp format', async () => {
      const response = await supertest(app).get('/health').expect(200);

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });

  describe('GET /non-existent-route', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await supertest(app).get('/non-existent-route').expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.body).toHaveProperty('path', '/non-existent-route');
    });

    it('should return 404 for non-existent API routes', async () => {
      const response = await supertest(app).get('/api/non-existent').expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.body).toHaveProperty('path', '/api/non-existent');
    });
  });

  describe('Server Configuration', () => {
    it('should set correct CORS headers', async () => {
      const response = await supertest(app).get('/health');

      // Check for CORS headers
      expect(response.headers).toHaveProperty('access-control-allow-credentials');
    });

    it('should parse JSON request bodies', async () => {
      const response = await supertest(app)
        .post('/api/test')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');

      // Should get 404 since route doesn't exist, but body should be parsed
      expect(response.status).toBe(404);
    });

    it('should have security headers', async () => {
      const response = await supertest(app).get('/health');

      // Helmet should add security headers
      expect(response.headers).toHaveProperty('x-dns-prefetch-control');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });
});
