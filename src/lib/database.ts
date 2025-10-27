import { supabase } from './supabase';
import { SeedInsert } from '@/types/database';

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

export async function getSeedById(id: string) {
  const { data, error } = await supabase
    .from('seeds')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching seed:', error);
    return null;
  }

  return data;
}

export async function createSeed(seed: SeedInsert) {
  const { data, error } = await supabase
    .from('seeds')
    .insert(seed)
    .select()
    .single();

  if (error) {
    console.error('Error creating seed:', error);
    throw error;
  }

  return data;
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
