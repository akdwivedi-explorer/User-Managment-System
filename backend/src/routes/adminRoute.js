import express from 'express';

const router = express.Router();
import { protect, admin } from '../middleware/authMiddleware.js';
import { getUsers, updateUserStatus } from '../controllers/adminController.js';

router.get('/users', protect, admin, getUsers);
router.patch('/users/:id/status', protect, admin, updateUserStatus)

export default router;
