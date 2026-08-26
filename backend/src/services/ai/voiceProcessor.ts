import type { Express } from 'express'
import { processAudio, confirmRecording, rejectRecording, extractBookingData } from '../voiceService.js'
export const voiceProcessor = { transcribeAndExtract: (file: Express.Multer.File) => processAudio(file), confirm: confirmRecording, reject: rejectRecording, extract: extractBookingData }
