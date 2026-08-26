import type { Response } from 'express'
export class AppError extends Error { constructor(public status: number, public code: string, message: string, public details?: unknown) { super(message); this.name = 'AppError' } }
export function sendError(response: Response, status: number, code: string, message: string, details?: unknown) { return response.status(status).json({ error: { code, message, ...(details ? { details } : {}) } }) }
