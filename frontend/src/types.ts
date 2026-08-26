export type Role = 'ADMIN' | 'CHC_MANAGER' | 'OPERATOR' | 'FARMER'
export type BookingStatus = 'PENDING' | 'APPROVED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

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
export interface FarmerRequest { id: string; machineType: string; areaInAcres: number; preferredDate: string; location: Location; status: BookingStatus; createdAt: string }
export interface OperatorTask extends Booking { distanceKm?: number }
