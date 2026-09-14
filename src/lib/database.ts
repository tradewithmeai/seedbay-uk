import { api } from './api'
import type { Seed, SeedInsert, SessionUser } from '@/types/database'

// --- listings ---------------------------------------------------------------

export async function getAllSeeds(): Promise<Seed[]> {
  const data = await api<{ seeds: Seed[] }>('/api/seeds.php')
  return data?.seeds ?? []
}

export async function getSeedById(id: string): Promise<Seed | null> {
  // 404 is an ordinary outcome here (expired or removed listing), not a failure.
  const data = await api<{ seed: Seed }>(`/api/seed.php?id=${encodeURIComponent(id)}`, {
    allowStatus: [400, 404],
  })
  return data?.seed ?? null
}

export interface SeedFilters {
  title?: string
  category?: string
  location?: string
  is_free?: boolean
}

export async function searchSeeds(filters: SeedFilters): Promise<Seed[]> {
  const params = new URLSearchParams()
  if (filters.title) params.set('title', filters.title)
  if (filters.category) params.set('category', filters.category)
  if (filters.location) params.set('location', filters.location)
  if (filters.is_free) params.set('free', '1')

  const query = params.toString()
  const data = await api<{ seeds: Seed[] }>(`/api/seeds.php${query ? `?${query}` : ''}`)
  return data?.seeds ?? []
}

export async function createSeed(seed: SeedInsert): Promise<{ id: string }> {
  const data = await api<{ id: string }>('/api/seeds.php', { method: 'POST', body: seed })
  return data!
}

// --- auth -------------------------------------------------------------------

export async function requestSignInLink(email: string): Promise<void> {
  await api('/api/auth/request.php', { method: 'POST', body: { email } })
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const data = await api<{ user: SessionUser | null }>('/api/auth/me.php')
  return data?.user ?? null
}

export async function signOut(): Promise<void> {
  await api('/api/auth/logout.php', { method: 'POST' })
}

// --- feedback ---------------------------------------------------------------

export async function submitSuggestion(input: {
  name?: string | null
  feedback_type: string
  message: string
}): Promise<void> {
  await api('/api/suggestions.php', { method: 'POST', body: input })
}
