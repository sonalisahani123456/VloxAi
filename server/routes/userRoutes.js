import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import {
  syncUser,
  getUserProfile,
  updateUserProfile,
  getUserStats,
} from '../controllers/userController.js';

const router = express.Router();

// Apply Clerk middleware gracefully (uses CLERK_SECRET_KEY / CLERK_PUBLISHABLE_KEY from process.env)
const clerkSecret = process.env.CLERK_SECRET_KEY;
if (clerkSecret && !clerkSecret.includes('example')) {
  router.use(clerkMiddleware());
}

/**
 * POST /api/users/sync
 * First-time user registration & login profile sync handler
 */
router.post('/sync', syncUser);

/**
 * GET /api/users/profile/:clerkId
 * Retrieve user profile from MongoDB
 */
router.get('/profile/:clerkId', getUserProfile);

/**
 * PUT /api/users/profile/:clerkId
 * Update user bio, name, avatar or metadata in MongoDB
 */
router.put('/profile/:clerkId', updateUserProfile);

/**
 * GET /api/users/stats/:clerkId
 * Retrieve user stats & creator dashboard analytics
 */
router.get('/stats/:clerkId', getUserStats);

export default router;
