import express from 'express';
import { signup, login, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

export default router;