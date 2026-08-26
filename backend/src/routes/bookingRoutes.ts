import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { deleteBooking, getBooking, getBookings, patchBooking, postBooking } from '../controllers/bookingController.js'
const router = Router(); router.use(requireAuth); router.get('/', asyncHandler(getBookings)); router.post('/', requireRole('ADMIN', 'CHC_MANAGER'), asyncHandler(postBooking)); router.get('/:id', asyncHandler(getBooking)); router.patch('/:id', requireRole('ADMIN', 'CHC_MANAGER'), asyncHandler(patchBooking)); router.delete('/:id', requireRole('ADMIN', 'CHC_MANAGER'), asyncHandler(deleteBooking)); export default router
