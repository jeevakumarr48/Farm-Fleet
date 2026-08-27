import { PrismaClient } from '@prisma/client'
import { config } from '../config.js'

// Keep the server bootable for the UI prototype; real data uses DATABASE_URL.
export const prisma = new PrismaClient({ datasources: { db: { url: config.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/farmfleet?schema=public' } } })
