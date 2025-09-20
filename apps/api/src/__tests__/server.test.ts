import { describe, expect, it } from '@jest/globals';
import supertest from 'supertest';
import { createServer } from '../server';

describe('API', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      await supertest(createServer())
        .get('/health')
        .expect(200)
        .then((res) => {
          expect(res.body.ok).toBe(true);
          expect(res.body).toHaveProperty('uptime');
          expect(res.body).toHaveProperty('timestamp');
        });
    });
  });

  describe('GET /non-existent-route', () => {
    it('should return 404 for non-existent routes', async () => {
      await supertest(createServer())
        .get('/non-existent-route')
        .expect(404)
        .then((res) => {
          expect(res.body).toHaveProperty('error', 'Route not found');
          expect(res.body).toHaveProperty('path', '/non-existent-route');
        });
    });
  });
});
