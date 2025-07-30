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
          backgroundImage: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          padding: '40px',
        }}
      >
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: '80px',
              marginBottom: '20px',
            }}
          >
            🎰
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '16px',
            }}
          >
            App Roulette
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '24px',
              color: '#e2e8f0',
              marginBottom: '32px',
              maxWidth: '500px',
              lineHeight: 1.3,
            }}
          >
            Discover amazing Farcaster mini apps
          </div>

          {/* CTA Button */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            Spin & Discover
          </div>

          {/* Author */}
          <div
            style={{
              fontSize: '16px',
              color: '#cbd5e1',
              marginTop: '24px',
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