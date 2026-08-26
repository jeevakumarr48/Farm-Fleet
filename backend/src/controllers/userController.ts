import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { sendError } from '../utils/errors.js'
import { userUpdateSchema } from '../utils/validation.js'

export async function getUsers(request: Request, response: Response) { const users = await prisma.user.findMany({ where: request.user?.chclId ? { chclId: request.user.chclId } : undefined, select: { id: true, name: true, email: true, phone: true, role: true, chclId: true, isActive: true, createdAt: true }, orderBy: { name: 'asc' } }); response.json(users) }
export async function patchUser(request: Request, response: Response) { const id = String(request.params.id); const input = userUpdateSchema.parse(request.body); const existing = await prisma.user.findUnique({ where: { id } }); if (!existing || (request.user?.chclId && existing.chclId !== request.user.chclId)) return sendError(response, 404, 'USER_NOT_FOUND', 'User not found.'); const user = await prisma.user.update({ where: { id }, data: input, select: { id: true, name: true, email: true, phone: true, role: true, chclId: true, isActive: true } }); response.json(user) }
