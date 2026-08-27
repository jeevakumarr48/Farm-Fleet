import type { Request, Response } from 'express'
import { voiceProcessor } from '../services/ai/voiceProcessor.js'
import { sendError } from '../utils/errors.js'
export async function process(request: Request, response: Response) { if (!request.file) return sendError(response, 400, 'AUDIO_REQUIRED', 'Upload an audio file to process.'); const result = await voiceProcessor.transcribeAndExtract(request.file, typeof request.body.transcript === 'string' ? request.body.transcript : undefined, typeof request.body.sourceLanguage === 'string' ? request.body.sourceLanguage : undefined); response.status(201).json(result) }
export async function confirm(request: Request, response: Response) { const result = await voiceProcessor.confirm(String(request.body.voiceRecordingId), request.body.extractedData || {}, request.user?.chclId); response.status(201).json(result) }
export async function reject(request: Request, response: Response) { response.json(await voiceProcessor.reject(String(request.body.voiceRecordingId))) }
