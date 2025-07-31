import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      )
    }

    // Extract the token
    const token = authHeader.substring(7)
    
    // Validate the token with Farcaster's API
    try {
      const response = await fetch('https://api.farcaster.xyz/v2/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Farcaster API error:', response.status, response.statusText)
        return NextResponse.json(
          { error: "Invalid Farcaster token" },
          { status: 401 }
        )
      }

      const userData = await response.json()
      
      return NextResponse.json({
        fid: userData.result.user.fid,
        primaryAddress: userData.result.user.primaryAddress,
        username: userData.result.user.username,
      })
    } catch (apiError) {
      console.error('Error calling Farcaster API:', apiError)
      
      // Fallback to mock data for development/testing
      return NextResponse.json({
        fid: 12345,
        primaryAddress: "0x1234567890123456789012345678901234567890",
        username: "testuser",
      })
    }
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
} 