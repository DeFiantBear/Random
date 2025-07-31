import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// $CITY token contract address
const CITY_TOKEN_ADDRESS = '0xaad86a4fe9557297ddd0b073d3d32ef8a407188b'
const TOKENS_PER_CLAIM = 100

export async function POST(request: NextRequest) {
  try {
    const { farcaster_id, wallet_address } = await request.json()

    if (!farcaster_id || !wallet_address) {
      return NextResponse.json(
        { error: 'Farcaster ID and wallet address are required' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    // Check if user is eligible
    const { data: eligibility, error: eligibilityError } = await supabase
      .from('user_eligibility')
      .select('*')
      .eq('farcaster_id', farcaster_id)
      .single()

    if (eligibilityError) {
      return NextResponse.json(
        { error: 'User not found or not eligible', details: eligibilityError.message },
        { status: 404 }
      )
    }

    if (!eligibility.is_eligible) {
      return NextResponse.json(
        { error: 'User is not eligible for token claim' },
        { status: 403 }
      )
    }

    // Check if user has already claimed
    const { data: existingClaim, error: claimCheckError } = await supabase
      .from('token_claims')
      .select('*')
      .eq('farcaster_id', farcaster_id)
      .single()

    if (claimCheckError && claimCheckError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Database error', details: claimCheckError.message },
        { status: 500 }
      )
    }

    if (existingClaim) {
      return NextResponse.json(
        { error: 'User has already claimed tokens' },
        { status: 409 }
      )
    }

    // TODO: Smart contract integration will go here
    // For now, we'll just record the claim in the database
    // In the next phase, we'll add the actual token transfer

    const { data: claim, error: insertError } = await supabase
      .from('token_claims')
      .insert({
        farcaster_id,
        wallet_address,
        tokens_claimed: TOKENS_PER_CLAIM,
        transaction_hash: null // Will be updated when we add smart contract integration
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to record claim', details: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      farcaster_id,
      wallet_address,
      tokens_claimed: TOKENS_PER_CLAIM,
      claim_id: claim.id,
      message: 'Claim recorded successfully. Token transfer will be implemented in the next phase.'
    })

  } catch (error) {
    console.error('Error processing token claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 