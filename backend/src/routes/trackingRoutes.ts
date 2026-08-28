import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getChcTracking } from '../controllers/trackingController.js'
const router = Router(); router.use(requireAuth, requireRole('ADMIN', 'CHC_MANAGER')); router.get('/:bookingId', asyncHandler(getChcTracking)); export default router
