import { prisma } from '../lib/prisma.js'
import type { FarmerNotificationType } from '@prisma/client'

export async function notifyFarmer(input: { farmerId: string; type: FarmerNotificationType; title: string; message: string; relatedRequestId?: string; relatedBookingId?: string }) { return prisma.farmerNotification.create({ data: input }) }
export async function notifyBookingEvent(booking: { id: string; farmerId: string }, event: 'JOB_ASSIGNED' | 'JOB_SCHEDULED' | 'JOB_RESCHEDULED' | 'JOB_COMPLETED' | 'JOB_CANCELLED', title: string, message: string) { return notifyFarmer({ farmerId: booking.farmerId, type: event, title, message, relatedBookingId: booking.id }) }
