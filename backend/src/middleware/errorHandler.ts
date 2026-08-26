import type { ErrorRequestHandler, RequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError, sendError } from '../utils/errors.js'
import { Prisma } from '@prisma/client'
export const notFound: RequestHandler = (_request, response) => sendError(response, 404, 'NOT_FOUND', 'Route not found.')
export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => { if (error instanceof AppError) return sendError(response, error.status, error.code, error.message, error.details); if (error instanceof ZodError) return sendError(response, 400, 'VALIDATION_ERROR', 'Please check the submitted fields.', error.flatten()); if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return sendError(response, 404, 'NOT_FOUND', 'The requested record was not found.'); if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return sendError(response, 409, 'CONFLICT', 'A record with those unique details already exists.'); console.error(error); return sendError(response, 500, 'INTERNAL_ERROR', 'Something went wrong. Please try again.') }
