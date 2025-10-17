import { Router } from 'express';
import { globalRateLimit } from '../middleware/rate-limit';
import userRoutes from './user.routes';

/**
 * Main API Router
 * All routes defined here are prefixed with /api
 */
const router: Router = Router();

/**
 * Apply global rate limiting to all API routes
 * This prevents abuse and ensures fair usage across all endpoints
 */
router.use(globalRateLimit);

/**
 * User Routes
 * Mounted at: /api/users
 * Handles all user-related endpoints
 */
router.use('/users', userRoutes);

export default router;
