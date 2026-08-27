import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { sendError } from '../utils/errors.js'
import { approveFarmerRequest, requestDto } from '../services/farmerService.js'

const approvalSchema = z.object({ machineId: z.string().min(1), operatorId: z.string().optional(), scheduledStart: z.coerce.date(), scheduledEnd: z.coerce.date() })
export async function getFarmerRequests(_request: Request, response: Response) { const requests = await prisma.farmerRequest.findMany({ include: { booking: { include: { machine: true, operator: { select: { name: true } } } }, farmer: { select: { name: true, phone: true } } }, orderBy: { createdAt: 'asc' } }); response.json(requests.map(requestDto)) }
export async function approveRequest(request: Request, response: Response) { const input = approvalSchema.parse(request.body); const result = await approveFarmerRequest(String(request.params.id), input); if (!result) return sendError(response, 404, 'REQUEST_NOT_FOUND', 'Farmer request not found.'); response.status(201).json(result) }
