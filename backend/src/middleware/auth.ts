import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import type { Role } from '@prisma/client'
import { sendError } from '../utils/errors.js'
interface Claims { sub: string; role: Role; chclId?: string | null }
export function requireAuth(request: Request, response: Response, next: NextFunction) { const token = request.header('authorization')?.replace(/^Bearer\s+/i, ''); if (!token) return sendError(response, 401, 'UNAUTHORIZED', 'A valid bearer token is required.'); if (!config.databaseConfigured && token.startsWith('demo-token')) { const role = token.includes('farmer') ? 'FARMER' : token.includes('operator') ? 'OPERATOR' : token.includes('admin') ? 'ADMIN' : 'CHC_MANAGER'; request.user = { id: `demo-${role.toLowerCase()}`, role, chclId: 'seva-chc' }; return next() } try { const claims = jwt.verify(token, config.JWT_SECRET) as Claims; request.user = { id: claims.sub, role: claims.role, chclId: claims.chclId }; next() } catch { return sendError(response, 401, 'UNAUTHORIZED', 'Your session has expired. Sign in again.') } }
export function requireRole(...roles: Role[]) { return (request: Request, response: Response, next: NextFunction) => { if (!request.user || !roles.includes(request.user.role)) return sendError(response, 403, 'FORBIDDEN', 'You do not have access to this resource.'); next() } }
