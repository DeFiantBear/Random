import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { untrustedData, trustedData } = body

    if (!untrustedData) {
      return NextResponse.json({ error: 'Invalid frame data' }, { status: 400 })
    }

    const { buttonIndex } = untrustedData

    if (buttonIndex === 1) {
      // Spin the Roulette
      const randomApp = await getRandomApp()
      if (randomApp) {
        const imageUrl = await generateAppImage(randomApp)
        return NextResponse.json({
          frames: [
            {
              image: imageUrl,
              buttons: [
                { label: '🎰 Spin Again', action: 'post' },
                { label: '🔗 Visit App', action: 'link', target: randomApp.mini_app_url },
                { label: '🏠 Home', action: 'post' }
              ],
              postUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://base-app-roulette.vercel.app'}/api/frame`
            }
          ]
        })
      }
    } else if (buttonIndex === 2) {
      // Add Your App
      return NextResponse.json({
        frames: [
          {
            image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://base-app-roulette.vercel.app'}/add-app-image.png`,
            buttons: [
              { label: '🏠 Back to Home', action: 'post' }
            ],
            postUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://base-app-roulette.vercel.app'}/api/frame`
          }
        ]
      })
    }

    // Default response (home)
    return NextResponse.json({
      frames: [
        {
          image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://base-app-roulette.vercel.app'}/og-image.png`,
          buttons: [
            { label: '🎰 Spin the Roulette', action: 'post' },
            { label: '➕ Add Your App', action: 'post' }
          ],
          postUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://base-app-roulette.vercel.app'}/api/frame`
        }
      ]
    })

  } catch (error) {
    console.error('Frame API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getRandomApp() {
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('mini_apps')
      .select('*')
      .order('RANDOM()')
      .limit(1)
      .single()

    if (error) {
      console.error('Database error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching random app:', error)
    return null
  }
}

async function generateAppImage(app: any) {
  // For now, return a static image URL
  // In production, you'd generate a dynamic image with the app details
  return `${process.env.NEXT_PUBLIC_BASE_URL || 'https://base-app-roulette.vercel.app'}/app-image.png`
}

export async function GET() {
  return NextResponse.json({
    frames: [
      {
        image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://base-app-roulette.vercel.app'}/og-image.png`,
        buttons: [
          { label: '🎰 Spin the Roulette', action: 'post' },
          { label: '➕ Add Your App', action: 'post' }
        ],
        postUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://base-app-roulette.vercel.app'}/api/frame`
      }
    ]
  })
} 