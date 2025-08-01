import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    console.log('Clearing wins for today:', today)
    
    const { data, error } = await supabase
      .from('airdrop_winners')
      .delete()
      .gte('won_at', today)
    
    if (error) {
      console.error('Error clearing wins:', error)
      return NextResponse.json(
        { error: "Failed to clear wins" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Wins cleared successfully",
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