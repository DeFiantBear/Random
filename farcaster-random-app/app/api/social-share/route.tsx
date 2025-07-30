import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1e3a8a',
          padding: '40px',
        }}
      >
        {/* Simple background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 1,
            color: 'white',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: '60px',
              marginBottom: '16px',
            }}
          >
            🎰
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '12px',
            }}
          >
            App Roulette
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '18px',
              color: '#e2e8f0',
              marginBottom: '24px',
              maxWidth: '400px',
              lineHeight: 1.3,
            }}
          >
            Spin & discover amazing Farcaster mini apps!
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '24px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                color: 'white',
                fontWeight: '500',
              }}
            >
              🎲 Random Discovery
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                color: 'white',
                fontWeight: '500',
              }}
            >
              ➕ Add Your App
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                color: 'white',
                fontWeight: '500',
              }}
            >
              🔗 Share on Farcaster
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Try App Roulette Now!
          </div>

          {/* Author */}
          <div
            style={{
              fontSize: '14px',
              color: '#cbd5e1',
              marginTop: '20px',
            }}
          >
            by Second City Studio
          </div>
        </div>
      </div>
    ),
    { 
      width: 1200, 
      height: 630,
      format: 'png',
    }
  )
} 