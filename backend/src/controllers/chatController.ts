import type { Request, Response } from 'express'
import { z } from 'zod'
import { respondToChat } from '../services/chatService.js'

const schema = z.object({ message: z.string().min(1).max(500), context: z.record(z.unknown()).optional() })
export function message(request: Request, response: Response) { const input = schema.parse(request.body); response.json(respondToChat(input.message, input.context || {}, request.user!.role)) }
