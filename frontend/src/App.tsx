import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { useAuth } from './contexts/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { BookingsPage } from './pages/BookingsPage'
import { BookingEditorPage } from './pages/BookingEditorPage'
import { SchedulePage } from './pages/SchedulePage'
import { MachinesPage } from './pages/MachinesPage'
import { RequestsPage, RequestEditorPage } from './pages/RequestsPage'
import { TasksPage } from './pages/TasksPage'
import { UsersPage } from './pages/UsersPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SettingsPage } from './pages/SettingsPage'
import type { ReactNode } from 'react'
import type { Role } from './types'

function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) { const { user } = useAuth(); if (!user) return <Navigate to="/login" replace />; return roles.includes(user.role) ? <>{children}</> : <Navigate to="/" replace /> }
export function App() { return <Routes><Route path="/login" element={<LoginPage />} /><Route element={<AppShell />}><Route path="/" element={<DashboardPage />} /><Route path="/settings" element={<SettingsPage />} /><Route path="/bookings" element={<RequireRole roles={['ADMIN', 'CHC_MANAGER']}><BookingsPage /></RequireRole>} /><Route path="/bookings/new" element={<RequireRole roles={['ADMIN', 'CHC_MANAGER']}><BookingEditorPage /></RequireRole>} /><Route path="/bookings/:id/edit" element={<RequireRole roles={['ADMIN', 'CHC_MANAGER']}><BookingEditorPage /></RequireRole>} /><Route path="/schedule" element={<RequireRole roles={['ADMIN', 'CHC_MANAGER']}><SchedulePage /></RequireRole>} /><Route path="/machines" element={<RequireRole roles={['ADMIN', 'CHC_MANAGER']}><MachinesPage /></RequireRole>} /><Route path="/users" element={<RequireRole roles={['ADMIN', 'CHC_MANAGER']}><UsersPage /></RequireRole>} /><Route path="/requests" element={<RequireRole roles={['FARMER']}><RequestsPage /></RequireRole>} /><Route path="/requests/new" element={<RequireRole roles={['FARMER']}><RequestEditorPage /></RequireRole>} /><Route path="/tasks" element={<RequireRole roles={['OPERATOR']}><TasksPage /></RequireRole>} /><Route path="*" element={<NotFoundPage />} /></Route></Routes> }
