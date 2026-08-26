import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { accept, currentProposal, propose, recommendations, reject } from '../controllers/scheduleController.js'
const router = Router(); router.use(requireAuth, requireRole('ADMIN', 'CHC_MANAGER')); router.get('/recommend-slots', asyncHandler(recommendations)); router.get('/proposals/current', asyncHandler(currentProposal)); router.post('/propose-reschedule', asyncHandler(propose)); router.post('/accept-reschedule', asyncHandler(accept)); router.post('/reject-reschedule', asyncHandler(reject)); export default router
