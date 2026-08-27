import { PrismaClient, Role, MachineStatus, BookingStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)
  await prisma.user.upsert({ where: { email: 'admin@farmfleet.in' }, update: {}, create: { name: 'Vikram Mehta', email: 'admin@farmfleet.in', phone: '+91 98765 40011', role: Role.ADMIN, passwordHash, chclId: 'seva-chc' } })
  const manager = await prisma.user.upsert({ where: { email: 'manager@farmfleet.in' }, update: {}, create: { name: 'Anita Rao', email: 'manager@farmfleet.in', phone: '+91 98765 40010', role: Role.CHC_MANAGER, passwordHash, chclId: 'seva-chc' } })
  const operator = await prisma.user.upsert({ where: { email: 'ravi@farmfleet.in' }, update: {}, create: { name: 'Ravi Kumar', email: 'ravi@farmfleet.in', phone: '+91 98111 22003', role: Role.OPERATOR, passwordHash, chclId: 'seva-chc' } })
  const farmer = await prisma.user.upsert({ where: { email: 'rajesh@farmfleet.in' }, update: { village: 'Bairiya', address: 'Plot 19, Meerut' }, create: { name: 'Rajesh Singh', email: 'rajesh@farmfleet.in', phone: '+91 98991 88773', role: Role.FARMER, passwordHash, chclId: 'seva-chc', village: 'Bairiya', address: 'Plot 19, Meerut' } })
  const tractor = await prisma.machine.upsert({ where: { id: 'seed-tractor' }, update: {}, create: { id: 'seed-tractor', type: 'tractor', name: 'Mahindra 575 DI', status: MachineStatus.ACTIVE, chclId: 'seva-chc', operatorId: operator.id } })
  await prisma.machine.upsert({ where: { id: 'seed-rotavator' }, update: {}, create: { id: 'seed-rotavator', type: 'rotavator', name: 'FieldKing 7ft', status: MachineStatus.ACTIVE, chclId: 'seva-chc' } })
  const existing = await prisma.booking.findFirst({ where: { id: 'seed-booking' } })
  const booking = existing || await prisma.booking.create({ data: { id: 'seed-booking', farmerId: farmer.id, machineId: tractor.id, operatorId: operator.id, areaInAcres: 5.5, cropType: 'Wheat', location: { village: 'Bairiya', field: 'Plot 12B', landmark: 'Near water tank' }, scheduledStart: new Date('2025-01-16T07:30:00+05:30'), scheduledEnd: new Date('2025-01-16T09:30:00+05:30'), predictedDurationMinutes: 118, status: BookingStatus.ASSIGNED, specialInstructions: 'Enter from the eastern bund.' } })
  const request = await prisma.farmerRequest.findFirst({ where: { farmerId: farmer.id } }) || await prisma.farmerRequest.create({ data: { farmerId: farmer.id, requestedMachineType: 'seeder', areaInAcres: 2.5, preferredDate: new Date('2025-01-20T00:00:00+05:30'), preferredTimeWindow: 'Morning', location: { village: 'Bairiya', field: 'Plot 4C' }, status: 'PENDING' } })
  if (!await prisma.jobDurationTrainingSample.findFirst({ where: { bookingId: booking.id } })) await prisma.jobDurationTrainingSample.createMany({ data: [{ machineType: 'tractor', areaInAcres: 5, cropType: 'Wheat', location: { village: 'Bairiya' }, season: 'Rabi', actualDurationMinutes: 110, bookingId: booking.id, operatorId: operator.id }, { machineType: 'tractor', areaInAcres: 4, cropType: 'Potato', location: { village: 'Bairiya' }, season: 'Rabi', actualDurationMinutes: 96 }, { machineType: 'tractor', areaInAcres: 6, cropType: 'Wheat', location: { village: 'Ramnagar' }, season: 'Rabi', actualDurationMinutes: 132 }] })
  if (!await prisma.farmerNotification.findFirst({ where: { farmerId: farmer.id } })) await prisma.farmerNotification.createMany({ data: [{ farmerId: farmer.id, type: 'REQUEST_APPROVED', title: 'Request approved', message: 'Your tractor request is approved.', relatedRequestId: request.id }, { farmerId: farmer.id, type: 'JOB_ASSIGNED', title: 'Operator assigned', message: 'Ravi Kumar is assigned to your tractor job.', relatedBookingId: booking.id }] })
  console.log(`Seeded FarmFleet with ${manager.email}, ${operator.email}, and ${farmer.email}`)
}
main().finally(() => prisma.$disconnect())
