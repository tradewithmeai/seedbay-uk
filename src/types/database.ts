export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      seeds: {
        Row: {
          id: string
          title: string
          description: string
          seed_type: string | null
          price: string | null
          location: string | null
          contact: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          seed_type?: string | null
          price?: string | null
          location?: string | null
          contact?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          seed_type?: string | null
          price?: string | null
          location?: string | null
          contact?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Seed = Database['public']['Tables']['seeds']['Row'];
export type SeedInsert = Database['public']['Tables']['seeds']['Insert'];
export type SeedUpdate = Database['public']['Tables']['seeds']['Update'];
