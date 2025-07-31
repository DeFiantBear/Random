import { NextRequest, NextResponse } from "next/server"
import { sdk } from '@farcaster/miniapp-sdk'

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user data from Farcaster
    const userData = await sdk.quickAuth.getUserData()
    
    if (!userData) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      fid: userData.fid,
      primaryAddress: userData.primaryAddress,
      username: userData.username,
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
} 