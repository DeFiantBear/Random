import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@farcaster/quick-auth'

const client = createClient()

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
    const authorization = request.headers.get('Authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 401 }
      )
    }

    try {
      const payload = await client.verifyJwt({
        token: authorization.split(' ')[1] as string,
        domain: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
      })

      const user = await resolveUser(payload.sub)
      console.log('Authenticated user:', user)
      
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
    console.error('Error in /api/me endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 