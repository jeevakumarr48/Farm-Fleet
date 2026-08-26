import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { message } from '../controllers/chatController.js'
const router = Router(); router.use(requireAuth); router.post('/message', asyncHandler(message)); export default router
