import { prisma } from '../../lib/prisma.js'
import { jobDurationPredictor } from './jobDurationPredictor.js'

function atTime(date: string, time: string) { return new Date(`${date}T${time}:00`) }
function displayTime(date: Date) { return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) }

export class SlotRecommender {
  async recommend(input: { machineId: string; preferredDate: string; areaInAcres: number; location?: { village?: string; field?: string } | string }) {
    const machine = await prisma.machine.findUnique({ where: { id: input.machineId } })
    const prediction = await jobDurationPredictor.predict({ machineType: machine?.type || 'tractor', areaInAcres: input.areaInAcres, location: input.location })
    const dayStart = atTime(input.preferredDate, '07:00'); const dayEnd = atTime(input.preferredDate, '18:00')
    const existing = await prisma.booking.findMany({ where: { machineId: input.machineId, scheduledStart: { gte: dayStart, lt: dayEnd }, status: { not: 'CANCELLED' } }, orderBy: { scheduledStart: 'asc' } })
    const requestedVillage = typeof input.location === 'string' ? input.location.split(',')[0].trim() : input.location?.village
    const result: { startTime: string; endTime: string; score: number; reason: string }[] = []
    for (let cursor = new Date(dayStart); cursor < dayEnd && result.length < 3; cursor.setMinutes(cursor.getMinutes() + 30)) {
      const end = new Date(cursor.getTime() + prediction.predictedDurationMinutes * 60_000)
      if (end > dayEnd || existing.some((booking) => cursor < booking.scheduledEnd && end > booking.scheduledStart)) continue
      const previous = [...existing].reverse().find((booking) => booking.scheduledEnd <= cursor)
      const sameVillage = previous && typeof previous.location === 'object' && previous.location !== null && Boolean(requestedVillage) && (previous.location as { village?: string }).village?.toLowerCase() === requestedVillage?.toLowerCase()
      const score = Math.round(100 - (cursor.getTime() - dayStart.getTime()) / 60000 / 3 + (sameVillage ? 18 : 0))
      result.push({ startTime: displayTime(cursor), endTime: displayTime(end), score: Math.max(1, score), reason: sameVillage ? 'Groups with nearby jobs in the same village' : previous ? 'Minimizes travel distance from the previous job' : 'Fits before the first scheduled job' })
    }
    return result
  }
}

export const slotRecommender = new SlotRecommender()
