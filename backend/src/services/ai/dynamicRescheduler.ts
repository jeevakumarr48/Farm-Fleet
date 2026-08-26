import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../utils/errors.js'

export type DisruptionReason = 'BREAKDOWN' | 'DELAY' | 'CANCELLATION' | 'URGENT_JOB'
export interface RescheduleScope { machineId?: string; date?: string; bookingId?: string }
export class DynamicRescheduler {
  async propose(reason: DisruptionReason, scope: RescheduleScope) {
    const anchor = scope.bookingId ? await prisma.booking.findUnique({ where: { id: scope.bookingId } }) : null
    const date = scope.date || anchor?.scheduledStart.toISOString().slice(0, 10)
    if (!date) throw new AppError(400, 'RESCHEDULE_SCOPE_REQUIRED', 'A date or bookingId is required to propose a reschedule.')
    const dayStart = new Date(`${date}T07:00:00`); const dayEnd = new Date(`${date}T18:00:00`)
    const bookings = await prisma.booking.findMany({ where: { ...(scope.machineId ? { machineId: scope.machineId } : anchor ? { machineId: anchor.machineId } : {}), scheduledStart: { gte: dayStart, lt: dayEnd }, status: { not: 'CANCELLED' } }, include: { farmer: true, machine: true, operator: true }, orderBy: { scheduledStart: 'asc' }, take: 6 })
    const machines = await prisma.machine.findMany({ where: { status: 'ACTIVE' }, include: { operator: true } })
    const changes = bookings.map((booking, index) => { const shift = (index + 1) * 30 * 60_000; const newStart = new Date(booking.scheduledStart.getTime() + shift); const alternate = reason === 'BREAKDOWN' ? machines.find((machine) => machine.id !== booking.machineId) : undefined; return { bookingId: booking.id, farmerName: booking.farmer.name, oldStart: booking.scheduledStart.toISOString(), oldEnd: booking.scheduledEnd.toISOString(), newStart: newStart.toISOString(), newEnd: new Date(booking.scheduledEnd.getTime() + shift).toISOString(), assignedMachineId: alternate?.id || booking.machineId, assignedOperatorId: alternate?.operatorId || booking.operatorId || machines.find((machine) => machine.id === booking.machineId)?.operatorId || null } })
    const proposal = await prisma.scheduleChangeProposal.create({ data: { reason, proposedChanges: changes } })
    return { proposalId: proposal.id, proposedChanges: changes }
  }
  async accept(proposalId: string) { const proposal = await prisma.scheduleChangeProposal.findUnique({ where: { id: proposalId } }); if (!proposal || proposal.status !== 'PENDING') throw new AppError(409, 'PROPOSAL_NOT_PENDING', 'Schedule proposal is not pending.'); const changes = proposal.proposedChanges as Array<{ bookingId: string; newStart: string; newEnd: string; assignedMachineId?: string; assignedOperatorId?: string | null }>; await prisma.$transaction([...changes.map((change) => prisma.booking.update({ where: { id: change.bookingId }, data: { scheduledStart: new Date(change.newStart), scheduledEnd: new Date(change.newEnd), machineId: change.assignedMachineId, operatorId: change.assignedOperatorId } })), prisma.scheduleChangeProposal.update({ where: { id: proposalId }, data: { status: 'ACCEPTED' } })]); return { proposalId, status: 'ACCEPTED' } }
}
export const dynamicRescheduler = new DynamicRescheduler()
