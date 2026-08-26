import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { login, updateProfile } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
const router = Router(); router.post('/login', asyncHandler(login)); router.patch('/profile', requireAuth, asyncHandler(updateProfile)); export default router
