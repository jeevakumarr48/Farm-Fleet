import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getTasks, patchTask } from '../controllers/operatorController.js'
const router = Router(); router.use(requireAuth, requireRole('OPERATOR')); router.get('/tasks', asyncHandler(getTasks)); router.patch('/tasks/:id', asyncHandler(patchTask)); export default router
