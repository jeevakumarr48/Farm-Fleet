import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getUsers, patchUser } from '../controllers/userController.js'
const router = Router(); router.use(requireAuth, requireRole('ADMIN')); router.get('/', asyncHandler(getUsers)); router.patch('/:id', asyncHandler(patchUser)); export default router
