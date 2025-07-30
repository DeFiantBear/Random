import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle webhook events from Farcaster
    console.log('Farcaster webhook received:', body)
    
    return NextResponse.json({ 
      success: true,
      message: 'Webhook received successfully'
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Webhook processing failed'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
} 