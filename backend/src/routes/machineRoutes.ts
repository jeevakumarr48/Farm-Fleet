import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getMachines, patchMachine, postMachine } from '../controllers/machineController.js'
const router = Router(); router.use(requireAuth, requireRole('ADMIN', 'CHC_MANAGER')); router.get('/', asyncHandler(getMachines)); router.post('/', asyncHandler(postMachine)); router.patch('/:id', asyncHandler(patchMachine)); export default router
