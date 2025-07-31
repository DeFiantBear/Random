import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { TOKENS_PER_CLAIM } from '@/lib/contracts'
import { transferCityTokens, getAirdropWalletBalance } from '@/lib/token-transfer'

export async function POST(request: NextRequest) {
  try {
    const { farcaster_id, wallet_address } = await request.json()

    if (!farcaster_id || !wallet_address) {
      return NextResponse.json(
        { error: 'Farcaster ID and wallet address are required' },
        { status: 400 }
      )
    }

    // SECURITY: Validate wallet address format
    if (!wallet_address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    // SECURITY: Rate limiting - check recent claims from this FID
    const recentClaims = await supabase
      .from('token_claims')
      .select('claimed_at')
      .eq('farcaster_id', farcaster_id)
      .gte('claimed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .limit(1)

    if (recentClaims.data && recentClaims.data.length > 0) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before claiming again.' },
        { status: 429 }
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

    // Check airdrop wallet balance before proceeding
    try {
      const balance = await getAirdropWalletBalance()
      const requiredAmount = BigInt(TOKENS_PER_CLAIM) * BigInt(10 ** 18) // Convert to wei
      
      if (balance < requiredAmount) {
        return NextResponse.json(
          { error: 'Insufficient airdrop wallet balance' },
          { status: 503 }
        )
      }
    } catch (error) {
      console.error('Error checking airdrop wallet balance:', error)
      return NextResponse.json(
        { error: 'Unable to verify airdrop wallet balance' },
        { status: 500 }
      )
    }

    // Execute the actual token transfer
    const transferResult = await transferCityTokens(wallet_address)

    if (!transferResult.success) {
      return NextResponse.json(
        { error: 'Token transfer failed', details: transferResult.error },
        { status: 500 }
      )
    }

    // Record the claim in the database with real transaction hash
    const { data: claim, error: insertError } = await supabase
      .from('token_claims')
      .insert({
        farcaster_id,
        wallet_address,
        tokens_claimed: TOKENS_PER_CLAIM,
        transaction_hash: transferResult.transactionHash
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
      transaction_hash: transferResult.transactionHash,
      gas_used: transferResult.gasUsed?.toString(),
      message: 'Tokens successfully transferred and claim recorded.'
    })

  } catch (error) {
    console.error('Error processing token claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 