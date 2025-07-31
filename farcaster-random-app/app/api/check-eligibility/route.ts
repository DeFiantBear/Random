import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { farcaster_id } = await request.json()

    if (!farcaster_id) {
      return NextResponse.json(
        { error: 'Farcaster ID is required' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    // Check if user exists in eligibility table
    const { data: eligibility, error: eligibilityError } = await supabase
      .from('user_eligibility')
      .select('*')
      .eq('farcaster_id', farcaster_id)
      .single()

    if (eligibilityError && eligibilityError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Database error', details: eligibilityError.message },
        { status: 500 }
      )
    }

    // Check if user has already claimed tokens
    const { data: claim, error: claimError } = await supabase
      .from('token_claims')
      .select('*')
      .eq('farcaster_id', farcaster_id)
      .single()

    if (claimError && claimError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Database error', details: claimError.message },
        { status: 500 }
      )
    }

    const response = {
      farcaster_id,
      has_spun: eligibility?.has_spun || false,
      has_shared: eligibility?.has_shared || false,
      is_eligible: eligibility?.is_eligible || false,
      has_claimed: !!claim,
      can_claim: (eligibility?.is_eligible || false) && !claim,
      tokens_claimed: claim?.tokens_claimed || 0
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error checking eligibility:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 