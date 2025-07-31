import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { farcaster_id, wallet_address, login_method } = await request.json()

    if (!farcaster_id) {
      return NextResponse.json(
        { error: 'Farcaster ID is required' },
        { status: 400 }
      )
    }

    console.log(`Logging login for FID: ${farcaster_id}, wallet: ${wallet_address}, method: ${login_method}`)

    // Insert login record
    const { data, error } = await supabase
      .from('user_logins')
      .insert({
        farcaster_id: farcaster_id,
        wallet_address: wallet_address || null,
        login_method: login_method || 'unknown',
        login_timestamp: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Error logging login:', error)
      return NextResponse.json(
        { error: 'Failed to log login' },
        { status: 500 }
      )
    }

    console.log('Login logged successfully:', data)

    return NextResponse.json({
      success: true,
      login_id: data[0]?.id
    })

  } catch (error) {
    console.error('Error in log-login endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 