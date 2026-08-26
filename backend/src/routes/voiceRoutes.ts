import { Router } from 'express'
import multer from 'multer'
import { config } from '../config.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { confirm, process, reject } from '../controllers/voiceController.js'
const upload = multer({ dest: config.uploadDir, limits: { fileSize: 15 * 1024 * 1024 } }); const router = Router(); router.use(requireAuth, requireRole('ADMIN', 'CHC_MANAGER')); router.post('/process', upload.single('audio'), asyncHandler(process)); router.post('/confirm', asyncHandler(confirm)); router.post('/reject', asyncHandler(reject)); export default router
