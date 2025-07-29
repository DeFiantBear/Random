import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface MiniApp {
  id: number
  app_id: string
  name: string
  description: string | null
  mini_app_url: string
  creator: string | null
  category: string | null
  added_at: string
  updated_at: string
}

export interface MiniAppInsert {
  app_id: string
  name: string
  description?: string
  mini_app_url: string
  creator?: string
  category?: string
} 