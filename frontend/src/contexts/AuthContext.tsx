import { createContext, useContext, useState, type ReactNode } from 'react'
import { demoUser } from '../data'
import { login, updateProfile } from '../services/api'
import type { Role, User } from '../types'

interface AuthValue { user: User | null; isLoading: boolean; signIn: (email: string, password: string) => Promise<void>; updateUser: (payload: { name?: string; email?: string; phone?: string; currentPassword?: string; newPassword?: string }) => Promise<void>; signOut: () => void; switchRole: (role: Role) => void }
const AuthContext = createContext<AuthValue | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => { const saved = localStorage.getItem('farmfleet_user'); return saved ? JSON.parse(saved) : null })
  const [isLoading, setLoading] = useState(false)
  async function signIn(email: string, password: string) { setLoading(true); try { const savedAccount = localStorage.getItem('farmfleet_demo_account'); if (savedAccount) { const account = JSON.parse(savedAccount) as { email: string; password: string; user: User }; if (account.email === email && account.password === password) { localStorage.setItem('farmfleet_token', 'demo-token'); localStorage.setItem('farmfleet_user', JSON.stringify(account.user)); setUser(account.user); return } } const result = await login(email, password); localStorage.setItem('farmfleet_token', result.token); localStorage.setItem('farmfleet_user', JSON.stringify(result.user)); if (result.token === 'demo-token') localStorage.setItem('farmfleet_demo_account', JSON.stringify({ email: result.user.email, password, user: result.user })); setUser(result.user) } finally { setLoading(false) } }
  async function updateUser(payload: { name?: string; email?: string; phone?: string; currentPassword?: string; newPassword?: string }) { try { const next = await updateProfile(payload); localStorage.setItem('farmfleet_user', JSON.stringify(next)); setUser(next) } catch (error) { if (!user || !(error instanceof Error) || error.message !== 'Failed to fetch') throw error; const savedAccount = localStorage.getItem('farmfleet_demo_account'); const account = savedAccount ? JSON.parse(savedAccount) as { email: string; password: string; user: User } : { email: user.email, password: 'password123', user }; const next = { ...user, name: payload.name || user.name, email: payload.email || user.email, phone: payload.phone || user.phone }; localStorage.setItem('farmfleet_user', JSON.stringify(next)); localStorage.setItem('farmfleet_demo_account', JSON.stringify({ email: next.email, password: payload.newPassword || account.password, user: next })); setUser(next) } }
  function signOut() { localStorage.removeItem('farmfleet_token'); localStorage.removeItem('farmfleet_user'); setUser(null) }
  function switchRole(role: Role) { const next = { ...demoUser, role, name: role === 'FARMER' ? 'Rajesh Singh' : role === 'OPERATOR' ? 'Ravi Kumar' : 'Anita Rao' }; localStorage.setItem('farmfleet_user', JSON.stringify(next)); setUser(next) }
  return <AuthContext.Provider value={{ user, isLoading, signIn, updateUser, signOut, switchRole }}>{children}</AuthContext.Provider>
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be inside AuthProvider'); return value }
