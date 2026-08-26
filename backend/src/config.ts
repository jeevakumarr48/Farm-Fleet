import 'dotenv/config'
import path from 'node:path'
import fs from 'node:fs'
import { z } from 'zod'

const env = z.object({ DATABASE_URL: z.string().min(1), JWT_SECRET: z.string().min(16), PORT: z.coerce.number().default(4000), CLIENT_ORIGIN: z.string().default('http://localhost:5173'), UPLOAD_DIR: z.string().default(process.env.VERCEL ? '/tmp/farmfleet-voice' : './tmp/voice'), SPEECH_TO_TEXT_API_KEY: z.string().optional(), MAPS_API_KEY: z.string().optional() }).parse(process.env)
export const config = { ...env, uploadDir: path.resolve(process.cwd(), env.UPLOAD_DIR) }
fs.mkdirSync(config.uploadDir, { recursive: true })
