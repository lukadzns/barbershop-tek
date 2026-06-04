import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Booking = {
  id?: string
  name: string
  phone: string
  email?: string
  service: string
  date: string
  time_slot: string
  notes?: string
  status?: 'pending' | 'confirmed' | 'cancelled'
  created_at?: string
}
