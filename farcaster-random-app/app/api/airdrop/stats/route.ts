import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Get total winners
    const { count: totalWinners } = await supabase
      .from('airdrop_winners')
      .select('*', { count: 'exact', head: true })

    // Get pending winners
    const { count: pendingWinners } = await supabase
      .from('airdrop_winners')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Get sent winners
    const { count: sentWinners } = await supabase
      .from('airdrop_winners')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent')

    // Get today's winners
    const today = new Date().toISOString().split('T')[0]
    const { count: todayWinners } = await supabase
      .from('airdrop_winners')
      .select('*', { count: 'exact', head: true })
      .gte('won_at', today)

    // Get recent winners (last 10)
    const { data: recentWinners } = await supabase
      .from('airdrop_winners')
      .select('id, fid, wallet_address, won_at, app_discovered, status')
      .order('won_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      stats: {
        totalWinners: totalWinners || 0,
        pendingWinners: pendingWinners || 0,
        sentWinners: sentWinners || 0,
        todayWinners: todayWinners || 0,
        tokensDistributed: (sentWinners || 0) * 100, // 100 tokens per winner
        tokensPending: (pendingWinners || 0) * 100
      },
      recentWinners: recentWinners || []
    })

  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 