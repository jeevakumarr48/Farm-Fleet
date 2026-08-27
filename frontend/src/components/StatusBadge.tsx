import type { BookingStatus } from '../types'
import { useLanguage } from '../contexts/LanguageContext'
const labels: Record<string, string> = { PENDING: 'Pending', APPROVED: 'Approved', ASSIGNED: 'Assigned', IN_PROGRESS: 'In progress', COMPLETED: 'Completed', CANCELLED: 'Cancelled', REJECTED: 'Rejected', ACTIVE: 'Active', MAINTENANCE: 'Maintenance', BROKEN: 'Broken' }
export function StatusBadge({ status }: { status: string }) { const { tr } = useLanguage(); return <span className={`status status-${status.toLowerCase()}`}><span className="status-dot" />{tr(labels[status] || status)}</span> }
export function statusLabel(status: BookingStatus) { return labels[status] || status }
