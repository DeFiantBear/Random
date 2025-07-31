import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface FarcasterApp {
  id: number
  app_id: string
  name: string
  description: string
  mini_app_url: string
  creator: string
  category: string
  added_at: string
  updated_at: string
} 