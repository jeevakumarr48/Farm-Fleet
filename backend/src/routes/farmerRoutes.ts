import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getRequests, postRequest } from '../controllers/farmerController.js'
const router = Router(); router.use(requireAuth, requireRole('FARMER')); router.get('/requests', asyncHandler(getRequests)); router.post('/requests', asyncHandler(postRequest)); export default router
