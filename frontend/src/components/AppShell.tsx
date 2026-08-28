import { Bell, CalendarDays, ChevronDown, ClipboardList, Factory, HelpCircle, LayoutDashboard, LogOut, Menu, Navigation, Settings, Tractor, Users, X } from 'lucide-react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import type { Role } from '../types'
import type { NavKey } from '../i18n'
import { ChatAssistant } from './ChatAssistant'

const links: { to: string; key: NavKey; icon: typeof LayoutDashboard; roles: Role[] }[] = [
  { to: '/chc/dashboard', key: 'overview', icon: LayoutDashboard, roles: ['ADMIN', 'CHC_MANAGER'] },
  { to: '/chc/bookings', key: 'bookings', icon: ClipboardList, roles: ['ADMIN', 'CHC_MANAGER'] },
  { to: '/chc/schedule', key: 'schedule', icon: CalendarDays, roles: ['ADMIN', 'CHC_MANAGER'] },
  { to: '/chc/tracking', key: 'tracking', icon: Navigation, roles: ['ADMIN', 'CHC_MANAGER'] },
  { to: '/machines', key: 'machines', icon: Tractor, roles: ['ADMIN', 'CHC_MANAGER'] },
  { to: '/farmer/dashboard', key: 'overview', icon: LayoutDashboard, roles: ['FARMER'] },
  { to: '/farmer/requests', key: 'requests', icon: ClipboardList, roles: ['FARMER'] },
  { to: '/farmer/bookings', key: 'bookings', icon: CalendarDays, roles: ['FARMER'] },
  { to: '/farmer/profile', key: 'profile', icon: Settings, roles: ['FARMER'] },
  { to: '/farmer/help', key: 'help', icon: HelpCircle, roles: ['FARMER'] },
  { to: '/operator/dashboard', key: 'tasks', icon: Tractor, roles: ['OPERATOR'] },
  { to: '/users', key: 'people', icon: Users, roles: ['ADMIN', 'CHC_MANAGER'] },
  { to: '/settings', key: 'profile', icon: Settings, roles: ['ADMIN', 'CHC_MANAGER', 'OPERATOR'] },
]
export function AppShell() {
  const { user, signOut, switchRole } = useAuth(); const { language, setLanguage, t, tr } = useLanguage(); const location = useLocation(); const [open, setOpen] = useState(false)
  if (!user) return <Navigate to="/login" replace />
  const current = t.nav[links.find((link) => link.to === location.pathname || (link.to !== '/' && location.pathname.startsWith(link.to)))?.key || 'overview']
  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Factory size={20} /></span><span>Farm<span>Fleet</span></span><button className="mobile-close" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
       <div className="chc-switcher"><span className="eyebrow">{tr('WORKSPACE')}</span><button><span><strong>{tr('Seva CHC')}</strong><small>{tr('Meerut · Uttar Pradesh')}</small></span><ChevronDown size={16} /></button></div>
      <nav>{links.filter((link) => link.roles.includes(user.role)).map(({ to, key, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><Icon size={18} /><span>{t.nav[key]}</span>{key === 'bookings' && <span className="nav-count">4</span>}</NavLink>)}</nav>
       <div className="sidebar-foot"><div className="season-note"><span className="season-dot" /><div><strong>{tr('Rabi season')}</strong><small>{tr('16 Jan 2025 · Week 03')}</small></div></div><button className="nav-link logout" onClick={signOut}><LogOut size={18} />{tr('Sign out')}</button></div>
    </aside>
     <main className="main"><header className="topbar"><button className="menu-button" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={21} /></button><div><span className="breadcrumb">SEVA CHC /</span><span className="current-page"> {current}</span></div><div className="top-actions"><button className="icon-button" aria-label="Notifications"><Bell size={19} /><span className="notification-dot" /></button><select className="language-select" aria-label="Select language" value={language} onChange={(event) => setLanguage(event.target.value as typeof language)}><option value="en">English</option><option value="hi">हिन्दी</option><option value="ta">தமிழ்</option></select><div className="profile"><span className="avatar">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span className="profile-copy"><strong>{user.name}</strong><small>{t.roles[user.role]}</small></span><select aria-label="Switch demo role" value={user.role} onChange={(event) => switchRole(event.target.value as Role)}><option value="CHC_MANAGER">Manager</option><option value="ADMIN">Admin</option><option value="OPERATOR">Operator</option><option value="FARMER">Farmer</option></select></div></div></header><div className="page"><Outlet /></div><ChatAssistant /></main>
  </div>
}
