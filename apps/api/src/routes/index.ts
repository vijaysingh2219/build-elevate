import { Router } from 'express';
import userRoutes from './user.routes';

/**
 * Main API Router
 * All routes defined here are prefixed with /api
 */
const router: Router = Router();

/**
 * User Routes
 * Mounted at: /api/users
 * Handles all user-related endpoints
 */
router.use('/users', userRoutes);

export default router;
