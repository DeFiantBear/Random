import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@farcaster/quick-auth'

const client = createClient()

// Resolve information about the authenticated Farcaster user
async function resolveUser(fid: number) {
  const primaryAddress = await (async () => {
    const res = await fetch(
      `https://api.farcaster.xyz/fc/primary-address?fid=${fid}&protocol=ethereum`,
    )
    if (res.ok) {
      const { result } = await res.json()
      return result.address.address
    }
    return null
  })()

  return {
    fid,
    primaryAddress,
  }
}

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 401 }
      )
    }

    try {
      const payload = await client.verifyJwt({
        token: authorization.split(' ')[1] as string,
        domain: request.headers.get('host') || 'localhost',
      })
      
      const user = await resolveUser(payload.sub)
      return NextResponse.json(user)
    } catch (e) {
      console.error('Token validation error:', e)
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
} 