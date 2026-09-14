// Shapes returned by the SeedBay API (public/api/*.php).
// Kept in step with seed_row() in public/api/_lib.php.

export interface Seed {
  id: string
  user_id: number | null
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
  image: string | null
  created_at: string
  expires_at: string | null
  active: boolean
}

/** What the post form sends to POST /api/seeds.php. */
export interface SeedInsert {
  title: string
  variety?: string | null
  category: string
  quantity?: string | null
  description: string
  is_free: boolean
  price?: string | null
  contact_method: string
  contact_value: string
  location?: string | null
  /** 30, 60 or 90. Omit for a listing that never expires. */
  expiry_days?: number | null
}

export interface SessionUser {
  id: number
  email: string
}
