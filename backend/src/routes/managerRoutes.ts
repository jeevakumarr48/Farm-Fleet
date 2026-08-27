import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { approveRequest, getFarmerRequests } from '../controllers/managerController.js'
const router = Router(); router.use(requireAuth, requireRole('ADMIN', 'CHC_MANAGER')); router.get('/farmer-requests', asyncHandler(getFarmerRequests)); router.post('/farmer-requests/:id/approve', asyncHandler(approveRequest)); export default router
