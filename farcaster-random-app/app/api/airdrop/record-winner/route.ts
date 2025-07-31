import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { fid, wallet_address, app_discovered } = await request.json()

    // Validate input
    if (!fid || !wallet_address || !app_discovered) {
      return NextResponse.json(
        { error: "Missing required fields: fid, wallet_address, app_discovered" },
        { status: 400 }
      )
    }

    // Validate FID is a number
    if (typeof fid !== 'number' || fid < 1) {
      return NextResponse.json(
        { error: "Invalid FID" },
        { status: 400 }
      )
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet_address)) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      )
    }

    // Check if this FID has already won (prevent duplicates)
    const { data: existingWinner } = await supabase
      .from('airdrop_winners')
      .select('id')
      .eq('fid', fid)
      .single()

    if (existingWinner) {
      return NextResponse.json(
        { error: "This FID has already won an airdrop" },
        { status: 409 }
      )
    }

    // Record the winner
    const { data, error } = await supabase
      .from('airdrop_winners')
      .insert({
        fid,
        wallet_address,
        app_discovered,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Failed to record winner" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      winner: data,
      message: "Winner recorded successfully"
    })

  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 