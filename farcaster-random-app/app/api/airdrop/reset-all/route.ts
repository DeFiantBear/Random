import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('Resetting all airdrop data...')
    
    // Delete ALL records from airdrop_winners table
    const { data, error } = await supabase
      .from('airdrop_winners')
      .delete()
      .neq('id', 0) // Delete all records
    
    if (error) {
      console.error('Error resetting airdrop data:', error)
      return NextResponse.json(
        { error: "Failed to reset airdrop data" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "All airdrop data reset successfully",
      deletedCount: data?.length || 0
    })
    
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 