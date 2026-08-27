import type { Express } from 'express'
import { processAudio, confirmRecording, rejectRecording, extractBookingData } from '../voiceService.js'
export const voiceProcessor = { transcribeAndExtract: (file: Express.Multer.File, transcript?: string, sourceLanguage?: string) => processAudio(file, transcript, sourceLanguage), confirm: confirmRecording, reject: rejectRecording, extract: extractBookingData }
