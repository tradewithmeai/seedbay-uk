import { supabase } from './supabase'
import { SeedInsert } from '@/types/database'

function activeFilter() {
  return new Date().toISOString()
}

export async function getAllSeeds() {
  const { data, error } = await supabase
    .from('seeds')
    .select('*')
    .eq('active', true)
    .or(`expires_at.is.null,expires_at.gt.${activeFilter()}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching seeds:', error)
    return []
  }
  return data || []
}

export async function getSeedById(id: string) {
  const { data, error } = await supabase
    .from('seeds')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching seed:', error)
    return null
  }
  return data
}

export async function createSeed(seed: SeedInsert): Promise<{ id: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('seeds').insert(seed as any).select('id').single() as any) as {
    data: { id: string } | null
    error: Error | null
  }

  if (error) {
    console.error('Error creating seed:', error)
    throw error
  }
  return data!
}

export async function searchSeeds(filters: {
  title?: string
  category?: string
  location?: string
  is_free?: boolean
}) {
  let query = supabase
    .from('seeds')
    .select('*')
    .eq('active', true)
    .or(`expires_at.is.null,expires_at.gt.${activeFilter()}`)
    .order('created_at', { ascending: false })

  if (filters.title) {
    query = query.or(`title.ilike.%${filters.title}%,variety.ilike.%${filters.title}%`)
  }
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters.is_free === true) {
    query = query.eq('is_free', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error searching seeds:', error)
    return []
  }
  return data || []
}
