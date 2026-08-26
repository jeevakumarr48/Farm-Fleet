import app from './app.js'
import { config } from './config.js'
import { prisma } from './lib/prisma.js'
const server = app.listen(config.PORT, () => console.log(`FarmFleet API listening on http://localhost:${config.PORT}`))
async function shutdown() { await prisma.$disconnect(); server.close(() => process.exit(0)) }
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown)
