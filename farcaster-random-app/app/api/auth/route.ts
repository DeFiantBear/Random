import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@farcaster/quick-auth'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const client = createClient()

// Initialize Supabase client
const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Resolve information about the authenticated Farcaster user
async function resolveUser(fid: number) {
  const primaryAddress = await (async () => {
    try {
      const res = await fetch(
        `https://api.farcaster.xyz/fc/primary-address?fid=${fid}&protocol=ethereum`,
      )
      if (res.ok) {
        const { result } = await res.json<{
          result: {
            address: {
              fid: number
              protocol: 'ethereum' | 'solana'
              address: string
            }
          }
        }>()

        return result.address.address
      }
    } catch (error) {
      console.error('Error fetching primary address:', error)
    }
    return undefined
  })()

  return {
    fid,
    primaryAddress,
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("Auth endpoint called")
    const authorization = request.headers.get('Authorization')
    console.log("Authorization header:", authorization ? "Present" : "Missing")
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.log("No valid authorization header found")
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 401 }
      )
    }

    try {
      // Get the correct domain for token validation
      const host = request.headers.get('host') || 'localhost:3000'
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
      const domain = `${protocol}://${host}`
      
      console.log('Validating token for domain:', domain)
      
      const payload = await client.verifyJwt({
        token: authorization.split(' ')[1] as string,
        domain: domain,
      })

      console.log('Token payload:', payload)
      
      const user = await resolveUser(payload.sub)
      console.log('Authenticated user:', user)

      // Store or update user login in database
      if (user.primaryAddress) {
        try {
          const { error } = await supabase
            .from('user_logins')
            .upsert(
              {
                farcaster_id: user.fid.toString(),
                wallet_address: user.primaryAddress,
                login_timestamp: new Date().toISOString(),
              },
              {
                onConflict: 'farcaster_id',
                ignoreDuplicates: false
              }
            )

          if (error) {
            console.error('Database error:', error)
          } else {
            console.log('User login recorded successfully')
          }
        } catch (dbError) {
          console.error('Error storing user login:', dbError)
        }
      }

      return NextResponse.json(user)
    } catch (e: any) {
      if (e.name === 'InvalidTokenError') {
        console.info('Invalid token:', e.message)
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        )
      }

      throw e
    }
  } catch (error) {
    console.error('Error in /api/auth endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 