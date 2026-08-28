import 'dotenv/config'
import path from 'node:path'
import fs from 'node:fs'
import { z } from 'zod'

const env = z.object({ DATABASE_URL: z.string().optional(), JWT_SECRET: z.string().min(16).default('farmfleet-prototype-secret-change-me'), DEMO_MODE: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'), PORT: z.coerce.number().default(4000), CLIENT_ORIGIN: z.string().default('http://localhost:5173'), UPLOAD_DIR: z.string().default(process.env.VERCEL ? '/tmp/farmfleet-voice' : './tmp/voice'), SPEECH_TO_TEXT_API_KEY: z.string().optional(), TRANSLATION_API_URL: z.preprocess((value) => value || undefined, z.string().url().optional()), AI_CHAT_API_URL: z.preprocess((value) => value || undefined, z.string().url().optional()), AI_CHAT_API_KEY: z.string().optional(), MAPS_API_KEY: z.string().optional() }).parse(process.env)
export const config = { ...env, databaseConfigured: Boolean(env.DATABASE_URL) && !env.DEMO_MODE, uploadDir: path.resolve(process.cwd(), env.UPLOAD_DIR) }
fs.mkdirSync(config.uploadDir, { recursive: true })
