import type { Booking, FarmerNotification, FarmerRequest, Machine, OperatorTask, ScheduleProposal, User } from './types'

export const demoUser: User = { id: 'usr-manager', name: 'Anita Rao', email: 'manager@farmfleet.in', phone: '+91 98765 40010', role: 'CHC_MANAGER' }
export const demoUsers: User[] = [
  demoUser,
  { id: 'usr-admin', name: 'Vikram Mehta', email: 'admin@farmfleet.in', phone: '+91 98765 40011', role: 'ADMIN' },
  { id: 'usr-operator', name: 'Ravi Kumar', email: 'ravi@farmfleet.in', phone: '+91 98111 22003', role: 'OPERATOR' },
  { id: 'usr-farmer', name: 'Rajesh Singh', email: 'rajesh@farmfleet.in', phone: '+91 98991 88773', role: 'FARMER' },
]
export const demoMachines: Machine[] = [
  { id: 'm-tractor', type: 'tractor', name: 'Mahindra 575 DI', status: 'ACTIVE', operator: 'Ravi Kumar' },
  { id: 'm-rotavator', type: 'rotavator', name: 'FieldKing 7ft', status: 'ACTIVE', operator: 'Suresh Patel' },
  { id: 'm-seeder', type: 'seeder', name: 'Shaktiman SeedPro', status: 'MAINTENANCE' },
  { id: 'm-sprayer', type: 'sprayer', name: 'Kisan 600L', status: 'ACTIVE', operator: 'Mohan Singh' },
]
export const demoBookings: Booking[] = [
  { id: 'BK-1048', farmerId: 'farmer-1', farmerName: 'Meena Devi', phone: '+91 98100 77124', machineId: 'm-tractor', machineType: 'tractor', operatorName: 'Ravi Kumar', areaInAcres: 5.5, cropType: 'Wheat', location: { village: 'Bairiya', field: 'Plot 12B', landmark: 'Near water tank' }, scheduledStart: '2025-01-16T07:30:00', scheduledEnd: '2025-01-16T09:30:00', predictedDurationMinutes: 118, status: 'ASSIGNED', specialInstructions: 'Enter from the eastern bund.' },
  { id: 'BK-1049', farmerId: 'farmer-2', farmerName: 'Harish Yadav', phone: '+91 98220 44190', machineId: 'm-rotavator', machineType: 'rotavator', operatorName: 'Suresh Patel', areaInAcres: 3, cropType: 'Mustard', location: { village: 'Ramnagar', field: 'North field', landmark: 'School road' }, scheduledStart: '2025-01-16T08:00:00', scheduledEnd: '2025-01-16T09:15:00', predictedDurationMinutes: 74, status: 'APPROVED' },
  { id: 'BK-1050', farmerId: 'farmer-3', farmerName: 'Sanjay Verma', phone: '+91 98450 21187', machineId: 'm-sprayer', machineType: 'sprayer', operatorName: 'Mohan Singh', areaInAcres: 8, cropType: 'Paddy', location: { village: 'Lakshmipur', field: 'Canal side', landmark: 'Gurudwara lane' }, scheduledStart: '2025-01-16T10:00:00', scheduledEnd: '2025-01-16T12:00:00', predictedDurationMinutes: 112, status: 'IN_PROGRESS' },
  { id: 'BK-1051', farmerId: 'farmer-4', farmerName: 'Kavita Sharma', phone: '+91 98700 63142', machineId: 'm-tractor', machineType: 'tractor', operatorName: 'Ravi Kumar', areaInAcres: 4, cropType: 'Potato', location: { village: 'Bairiya', field: 'Plot 8A', landmark: 'Temple bend' }, scheduledStart: '2025-01-16T13:00:00', scheduledEnd: '2025-01-16T15:00:00', predictedDurationMinutes: 106, status: 'PENDING' },
]
export const demoRequests: FarmerRequest[] = [
  { id: 'REQ-208', machineType: 'tractor', areaInAcres: 5, preferredDate: '2025-01-18', location: { village: 'Bairiya', field: 'Plot 19', landmark: 'Old banyan tree' }, status: 'APPROVED', createdAt: '2025-01-13' },
  { id: 'REQ-207', machineType: 'seeder', areaInAcres: 2.5, preferredDate: '2025-01-20', location: { village: 'Bairiya', field: 'Plot 4C' }, status: 'PENDING', createdAt: '2025-01-12' },
]
export const demoNotifications: FarmerNotification[] = [
  { id: 'n-1', type: 'JOB_ASSIGNED', title: 'Operator assigned', message: 'Ravi Kumar is assigned to your tractor job on 18 Jan.', relatedRequestId: 'REQ-208', read: false, createdAt: '2025-01-15T10:30:00' },
  { id: 'n-2', type: 'REQUEST_APPROVED', title: 'Request approved', message: 'Your tractor request for Plot 19 has been approved.', relatedRequestId: 'REQ-208', read: false, createdAt: '2025-01-14T16:20:00' },
  { id: 'n-3', type: 'JOB_COMPLETED', title: 'Job completed', message: 'Your last field job was completed successfully.', relatedBookingId: 'BK-1048', read: true, createdAt: '2025-01-13T14:00:00' },
]
export const demoTasks: OperatorTask[] = [demoBookings[0], demoBookings[2]]
export const demoProposal: ScheduleProposal = { id: 'PROP-17', reason: 'the rotavator needs a belt inspection before the afternoon run', changes: [{ bookingId: 'BK-1051', farmerName: 'Kavita Sharma', oldStart: '13:00', oldEnd: '15:00', newStart: '15:30', newEnd: '17:30' }] }
