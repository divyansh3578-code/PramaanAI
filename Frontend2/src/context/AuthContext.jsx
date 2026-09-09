import { createContext, useCallback, useContext, useState } from 'react'
import { api } from '../api/client.js'

const AuthContext = createContext(null)

export const ROLE = {
  OFFICER: 'OFFICER',
  BIDDER: 'BIDDER',
}

// Backend roles collapse onto the two frontend-facing roles this console
// designs around: any staff account (ADMIN / PROCUREMENT_OFFICER / AUDITOR)
// behaves as an "Officer" here; BIDDER stays BIDDER.
const STAFF_ORG_LABEL = {
  ADMIN: 'CPCL Vigilance & Procurement (Administrator)',
  PROCUREMENT_OFFICER: 'CPCL Vigilance & Procurement',
  AUDITOR: 'CPCL Statutory Audit Cell',
}

const USER_KEY = 'tenderverify_user'

function buildProfile(backendUser) {
  const isBidder = backendUser.role === 'BIDDER'
  return {
    role: isBidder ? ROLE.BIDDER : ROLE.OFFICER,
    backendRole: backendUser.role,
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    bidderId: backendUser.bidderId || null,
    orgLabel: isBidder ? 'Registered Bidder (GeM Seller)' : STAFF_ORG_LABEL[backendUser.role] || 'CPCL Vigilance & Procurement',
    idLabel: isBidder ? 'Account Email' : 'Employee Email',
    idValue: backendUser.email,
    secondaryLabel: isBidder ? 'Bidder Profile' : 'Role',
    secondaryValue: isBidder ? (backendUser.bidderId ? 'Linked' : 'Not linked') : backendUser.role.replace(/_/g, ' '),
  }
}

function readCachedUser() {
  if (!api.getToken()) return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  // Lazy-initialized from localStorage so a page refresh doesn't flash a
  // logged-out state before the session is restored.
  const [user, setUser] = useState(readCachedUser)

  const persist = useCallback((token, backendUser) => {
    api.setToken(token)
    const profile = buildProfile(backendUser)
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
    setUser(profile)
    return profile
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user: backendUser } = await api.login(email, password)
    return persist(token, backendUser)
  }, [persist])

  const register = useCallback(async (payload) => {
    const { token, user: backendUser } = await api.register(payload)
    return persist(token, backendUser)
  }, [persist])

  const logout = useCallback(() => {
    api.setToken(null)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
