import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { fid } = await request.json()
    
    if (!fid) {
      return NextResponse.json(
        { error: 'FID is required' },
        { status: 400 }
      )
    }

    // Get user's primary wallet address from Farcaster API
    const primaryAddressResponse = await fetch(
      `https://api.farcaster.xyz/fc/primary-address?fid=${fid}&protocol=ethereum`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    let walletAddress = null
    if (primaryAddressResponse.ok) {
      const addressData = await primaryAddressResponse.json()
      walletAddress = addressData.result?.address?.address
    }

    // For now, return the user info with the wallet address if available
    const userInfo = {
      fid: fid,
      walletAddress: walletAddress || "0x0000000000000000000000000000000000000000"
    }

    return NextResponse.json(userInfo)
  } catch (error) {
    console.error('Error fetching user info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user information' },
      { status: 500 }
    )
  }
} 