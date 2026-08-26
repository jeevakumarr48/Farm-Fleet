import { prisma } from '../lib/prisma.js'
import { Prisma } from '@prisma/client'
import type { Booking } from '@prisma/client'

export async function recordTrainingSample(booking: Pick<Booking, 'id' | 'areaInAcres' | 'cropType' | 'location' | 'actualStart' | 'actualEnd'> & { machine: { type: string }; operatorId: string | null }) {
  if (!booking.actualStart || !booking.actualEnd || booking.actualEnd <= booking.actualStart) return null
  const actualDurationMinutes = Math.ceil((booking.actualEnd.getTime() - booking.actualStart.getTime()) / 60_000)
  const existing = await prisma.jobDurationTrainingSample.findFirst({ where: { bookingId: booking.id } })
  if (existing) return prisma.jobDurationTrainingSample.update({ where: { id: existing.id }, data: { actualDurationMinutes, machineType: booking.machine.type, areaInAcres: booking.areaInAcres, cropType: booking.cropType, location: booking.location ?? Prisma.JsonNull, operatorId: booking.operatorId || undefined } })
  return prisma.jobDurationTrainingSample.create({ data: { machineType: booking.machine.type, areaInAcres: booking.areaInAcres, cropType: booking.cropType, location: booking.location ?? Prisma.JsonNull, actualDurationMinutes, bookingId: booking.id, operatorId: booking.operatorId || undefined } })
}
