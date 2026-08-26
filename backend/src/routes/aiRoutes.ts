import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { predict } from '../controllers/aiController.js'
const router = Router(); router.use(requireAuth, requireRole('ADMIN', 'CHC_MANAGER')); router.post('/predict-duration', asyncHandler(predict)); export default router
