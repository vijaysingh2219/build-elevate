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
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('uptime');
          expect(res.body).toHaveProperty('timestamp');
        });
    });
  });
});
