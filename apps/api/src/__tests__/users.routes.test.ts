import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import type { Express } from 'express';
import supertest from 'supertest';

type SessionUser = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

type SessionRecord = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

type GetSessionResult = { user: SessionUser; session: SessionRecord } | null;

type GetSessionArgs = {
  headers?: Record<string, unknown>;
  query?: { disableCookieCache?: unknown; disableRefresh?: unknown };
};

type MockGetSession = jest.MockedFunction<(args?: GetSessionArgs) => Promise<GetSessionResult>>;

const mockGetSession = jest.fn() as MockGetSession;

jest.mock('@workspace/auth', () => ({
  authClient: {},
  auth: {
    api: {
      getSession: mockGetSession,
    },
  },
  fromNodeHeaders: jest.fn((headers) => headers),
}));

import { createServer } from '../server';

describe('User Routes', () => {
  let app: Express;

  beforeAll(() => {
    app = createServer();
  });

  describe('GET /api/users/session', () => {
    it('should return user session when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: true,
        twoFactorEnabled: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSession = {
        session: {
          id: 'session-123',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user-123',
          expiresAt: new Date(Date.now() + 86400000),
          token: 'session-token-123',
          ipAddress: '127.0.0.1',
          userAgent: 'test-agent',
        },
        user: mockUser,
      };

      mockGetSession.mockResolvedValue(mockSession);

      const response = await supertest(app)
        .get('/api/users/session')
        .set('Cookie', 'session=mock-session-token')
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('session');
    });

    it('should return 401 when user is not authenticated', async () => {
      mockGetSession.mockResolvedValue(null);

      const response = await supertest(app).get('/api/users/session').expect(401);

      expect(response.body).toHaveProperty('error', 'Unauthorized');
      expect(response.body).toHaveProperty('message', 'Authentication required');
    });

    it('should handle authentication errors gracefully', async () => {
      mockGetSession.mockRejectedValue(new Error('Authentication service unavailable'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const response = await supertest(app).get('/api/users/session').expect(401);

      expect(response.body).toHaveProperty('error', 'Unauthorized');
      expect(response.body).toHaveProperty('message', 'Authentication required');

      consoleErrorSpy.mockRestore();
    });
  });
});
