export type Role = 'ADMIN' | 'CHC_MANAGER' | 'OPERATOR' | 'FARMER'
export type BookingStatus = 'PENDING' | 'APPROVED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED'

export interface User { id: string; name: string; email: string; phone: string; role: Role }
export interface Location { village: string; field: string; landmark?: string }
export interface Machine { id: string; type: string; name: string; status: 'ACTIVE' | 'MAINTENANCE' | 'BROKEN'; operator?: string }
export interface Booking {
  id: string; farmerId: string; farmerName: string; phone: string; machineId: string; machineType: string; operatorName?: string
  areaInAcres: number; cropType?: string; location: Location; scheduledStart: string; scheduledEnd: string
  predictedDurationMinutes?: number; status: BookingStatus; specialInstructions?: string
}
export interface Recommendation { startTime: string; endTime: string; reason: string; score?: number }
export interface ScheduleChange { bookingId: string; farmerName: string; oldStart: string; oldEnd: string; newStart: string; newEnd: string }
export interface ScheduleProposal { id: string; reason: string; changes: ScheduleChange[] }
export interface FarmerRequest { id: string; machineType: string; areaInAcres: number; preferredDate: string; preferredTimeWindow?: string; cropType?: string; location: Location; status: BookingStatus; specialInstructions?: string; createdAt: string; updatedAt?: string; booking?: { id: string; machineType: string; machineName: string; operatorName?: string; scheduledStart: string; scheduledEnd: string; status: BookingStatus } | null }
export interface FarmerProfile extends User { village?: string; address?: string; createdAt: string }
export interface FarmerBooking { id: string; machineType: string; machineName: string; scheduledStart: string; scheduledEnd: string; status: BookingStatus; areaInAcres: number; location: Location; operatorName?: string; operator?: { name: string; phone: string } | null; actualStart?: string; actualEnd?: string; specialInstructions?: string }
export interface FarmerNotification { id: string; type: string; title: string; message: string; relatedRequestId?: string; relatedBookingId?: string; read: boolean; createdAt: string }
export interface OperatorTask extends Booking { distanceKm?: number }
