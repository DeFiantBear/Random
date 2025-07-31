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
  added_at: string
}

export interface UserEligibility {
  id: number
  farcaster_id: string
  has_spun: boolean
  has_shared: boolean
  is_eligible: boolean
  has_claimed: boolean
  can_claim: boolean
  tokens_claimed: number
  created_at: string
  updated_at: string
}

export interface UserEligibilityInsert {
  farcaster_id: string
  has_spun?: boolean
  has_shared?: boolean
  is_eligible?: boolean
  has_claimed?: boolean
  can_claim?: boolean
  tokens_claimed?: number
}

export interface TokenClaim {
  id: number
  farcaster_id: string
  wallet_address: string
  tokens_claimed: number
  transaction_hash: string
  gas_used: string
  claim_timestamp: string
  created_at: string
}

export interface TokenClaimInsert {
  farcaster_id: string
  wallet_address: string
  tokens_claimed: number
  transaction_hash: string
  gas_used: string
  claim_timestamp: string
}

export interface UserLogin {
  id: number
  farcaster_id: string
  wallet_address: string | null
  login_method: string
  login_timestamp: string
  created_at: string
}

export interface UserLoginInsert {
  farcaster_id: string
  wallet_address?: string | null
  login_method?: string
  login_timestamp: string
} 