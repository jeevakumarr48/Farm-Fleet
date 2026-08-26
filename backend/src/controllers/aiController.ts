import type { Request, Response } from 'express'
import { z } from 'zod'
import { jobDurationPredictor } from '../services/ai/jobDurationPredictor.js'
const schema = z.object({ machineType: z.string().min(1), areaInAcres: z.number().positive(), cropType: z.string().optional(), location: z.unknown().optional() })
export async function predict(request: Request, response: Response) { const input = schema.parse(request.body); response.json(await jobDurationPredictor.predict(input)) }
