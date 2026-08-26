import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { dynamicRescheduler } from '../services/ai/dynamicRescheduler.js'
import { slotRecommender } from '../services/ai/slotRecommender.js'
import { z } from 'zod'
const recommendationSchema = z.object({ machineId: z.string().min(1), preferredDate: z.string().min(1), areaInAcres: z.coerce.number().positive(), location: z.string().optional() })
const proposalSchema = z.object({ reason: z.enum(['BREAKDOWN', 'DELAY', 'CANCELLATION', 'URGENT_JOB']), machineId: z.string().min(1).optional(), date: z.string().min(1).optional(), bookingId: z.string().optional() }).refine((input) => input.machineId || input.date || input.bookingId, 'Provide machineId/date or bookingId as the reschedule scope.')
export async function recommendations(request: Request, response: Response) { const input = recommendationSchema.parse(request.query); response.json(await slotRecommender.recommend({ ...input, location: input.location })) }
export async function propose(request: Request, response: Response) { const input = proposalSchema.parse(request.body); response.status(201).json(await dynamicRescheduler.propose(input.reason, input)) }
export async function accept(request: Request, response: Response) { response.json(await dynamicRescheduler.accept(z.object({ proposalId: z.string() }).parse(request.body).proposalId)) }
export async function reject(request: Request, response: Response) { const { proposalId } = z.object({ proposalId: z.string() }).parse(request.body); response.json(await prisma.scheduleChangeProposal.update({ where: { id: proposalId }, data: { status: 'REJECTED' } })) }
export async function currentProposal(_request: Request, response: Response) { const proposal = await prisma.scheduleChangeProposal.findFirst({ where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' } }); response.json(proposal ? { id: proposal.id, reason: proposal.reason, changes: proposal.proposedChanges } : null) }
