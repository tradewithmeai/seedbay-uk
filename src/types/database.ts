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
          user_id: string | null
          title: string
          variety: string | null
          category: string
          quantity: string | null
          description: string
          is_free: boolean
          price: string | null
          contact_method: string
          contact_value: string
          location: string | null
          created_at: string
          expires_at: string | null
          active: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          variety?: string | null
          category: string
          quantity?: string | null
          description: string
          is_free?: boolean
          price?: string | null
          contact_method: string
          contact_value: string
          location?: string | null
          created_at?: string
          expires_at?: string | null
          active?: boolean
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          variety?: string | null
          category?: string
          quantity?: string | null
          description?: string
          is_free?: boolean
          price?: string | null
          contact_method?: string
          contact_value?: string
          location?: string | null
          created_at?: string
          expires_at?: string | null
          active?: boolean
        }
      }
    }
  }
}

export type Seed = Database['public']['Tables']['seeds']['Row']
export type SeedInsert = Database['public']['Tables']['seeds']['Insert']
export type SeedUpdate = Database['public']['Tables']['seeds']['Update']
