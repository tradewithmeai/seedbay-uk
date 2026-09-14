'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getSessionUser, signOut as apiSignOut } from '@/lib/database'
import type { SessionUser } from '@/types/database'

interface AuthContextType {
  user: SessionUser | null
  loading: boolean
  signOut: () => Promise<void>
  /** Re-read the session, e.g. after landing back from a magic link. */
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refresh: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      setUser(await getSessionUser())
    } catch {
      // An unreachable API is indistinguishable from being signed out, as far
      // as what the UI should offer.
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const signOut = useCallback(async () => {
    try {
      await apiSignOut()
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
