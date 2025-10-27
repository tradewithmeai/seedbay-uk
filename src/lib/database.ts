import { supabase } from './supabase';
import { Database, SeedInsert } from '@/types/database';

export async function getAllSeeds() {
  const { data, error } = await supabase
    .from('seeds')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching seeds:', error);
    return [];
  }

  return data || [];
}

export async function getSeedById(id: string): Promise<Database['public']['Tables']['seeds']['Row'] | null> {
  const { data, error } = await (supabase
    .from('seeds')
    .select('*')
    .eq('id', id)
    .single() as any as Promise<{ data: Database['public']['Tables']['seeds']['Row'] | null; error: any }>);

  if (error) {
    console.error('Error fetching seed:', error);
    return null;
  }

  return data;
}

export async function createSeed(seed: SeedInsert): Promise<Database['public']['Tables']['seeds']['Row']> {
  const { data, error } = await (supabase
    .from('seeds')
    .insert(seed as any)
    .select()
    .single() as any as Promise<{ data: Database['public']['Tables']['seeds']['Row'] | null; error: any }>);

  if (error) {
    console.error('Error creating seed:', error);
    throw error;
  }

  return data!;
}

export async function searchSeeds(filters: {
  title?: string;
  seed_type?: string;
  location?: string;
}) {
  let query = supabase
    .from('seeds')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.title) {
    query = query.ilike('title', `%${filters.title}%`);
  }

  if (filters.seed_type) {
    query = query.ilike('seed_type', `%${filters.seed_type}%`);
  }

  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error searching seeds:', error);
    return [];
  }

  return data || [];
}
