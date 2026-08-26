import { AlertTriangle, ChevronLeft, ChevronRight, GripVertical, MapPin, RefreshCw, Sparkles, Tractor, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getBookings, getProposal, acceptProposal } from '../services/api'
import { demoBookings } from '../data'
import { Button, Panel } from '../components/Ui'
import { StatusBadge } from '../components/StatusBadge'
import { useState } from 'react'

const hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

export function SchedulePage() {
  const { data = demoBookings } = useQuery({ queryKey: ['bookings'], queryFn: getBookings })
  const { data: proposal } = useQuery({ queryKey: ['proposal'], queryFn: getProposal })
  const [view, setView] = useState<'day' | 'week'>('day')
  const [showProposal, setShowProposal] = useState(true)
  const [accepted, setAccepted] = useState(false)
  const machines = [...new Set(data.map((booking) => booking.machineType))]

  async function accept() {
    if (proposal) await acceptProposal(proposal.id)
    setAccepted(true)
    setShowProposal(false)
  }

  return <div className="dashboard schedule-page">
    <div className="page-intro"><div><span className="eyebrow">OPERATIONS / RUN SHEET</span><h1>Schedule</h1><p>Thursday 16 January · Meerut CHC fleet</p></div><div className="intro-actions"><div className="segmented"><button className={view === 'day' ? 'selected' : ''} onClick={() => setView('day')}>Day</button><button className={view === 'week' ? 'selected' : ''} onClick={() => setView('week')}>Week</button></div><Button variant="secondary"><RefreshCw size={16} />Auto-balance</Button></div></div>
    {accepted && <div className="toast success"><span>✓</span><div><strong>Schedule updated</strong><small>Kavita Sharma's job moved to 15:30.</small></div><button onClick={() => setAccepted(false)}><X size={15} /></button></div>}
    {showProposal && proposal && <div className="proposal-banner"><div className="proposal-icon"><AlertTriangle size={20} /></div><div className="proposal-copy"><strong>A schedule change is suggested</strong><span>Because {proposal.reason}.</span></div><Button onClick={() => setShowProposal(false)} variant="secondary">Review manually</Button><button className="banner-close" onClick={() => setShowProposal(false)} aria-label="Dismiss"><X size={17} /></button></div>}
    <div className="schedule-legend"><span><i className="legend-dot live" />Live job</span><span><i className="legend-dot predicted" />AI-predicted duration</span><span><i className="legend-dot pending" />Needs assignment</span><span className="schedule-date"><ChevronLeft size={16} />Today <ChevronRight size={16} /></span></div>
    <div className="calendar-panel"><div className="calendar-head"><div className="machine-head">MACHINE / OPERATOR</div><div className="date-head"><strong>THU 16</strong><span>JANUARY 2025</span></div></div><div className="calendar-body"><div className="time-axis">{hours.map((hour) => <span key={hour}>{hour}</span>)}</div><div className="machine-rows">{machines.map((machine) => <div className="machine-row" key={machine}><div className="machine-name"><Tractor size={17} /><div><strong className="capitalize">{machine}</strong><small>{data.find((item) => item.machineType === machine)?.operatorName || 'No operator'}</small></div></div><div className="timeline">{hours.slice(0, -1).map((hour) => <span className="grid-line" key={hour} />)}{data.filter((item) => item.machineType === machine).map((booking, index) => <div className={`job-block ${booking.status === 'IN_PROGRESS' ? 'job-live' : ''} ${!booking.operatorName ? 'job-unassigned' : ''}`} key={booking.id} style={{ left: `${Math.max(0, (Number(booking.scheduledStart.slice(11, 13)) - 7) * 10 + Number(booking.scheduledStart.slice(14, 16)) / 6)}%`, width: `${Math.max(14, (booking.predictedDurationMinutes || 90) / 6)}%`, top: `${index * 7 + 6}%` }}><GripVertical size={14} /><div><strong>{booking.farmerName}</strong><small>{booking.scheduledStart.slice(11, 16)} · {booking.areaInAcres} ac</small></div><Sparkles className="job-spark" size={13} /></div>)}</div></div>)}</div></div></div>
    <div className="schedule-foot"><span><MapPin size={15} />Drag a job to reschedule · changes need confirmation</span><span>Working hours 07:00–18:00</span></div>
    {proposal && <Panel title="Schedule proposal" className="proposal-panel" action={<StatusBadge status={accepted ? 'APPROVED' : 'PENDING'} />}><div className="proposal-table"><div className="proposal-row proposal-header"><span>JOB</span><span>OLD TIME</span><span>PROPOSED TIME</span><span /></div>{proposal.changes.map((change) => <div className="proposal-row" key={change.bookingId}><div><strong>{change.farmerName}</strong><small>{change.bookingId}</small></div><span className="old-time">{change.oldStart}–{change.oldEnd}</span><span className="new-time">{change.newStart}–{change.newEnd}</span><Button onClick={accept}>{accepted ? 'Accepted' : 'Accept changes'}</Button></div>)}</div></Panel>}
  </div>
}
