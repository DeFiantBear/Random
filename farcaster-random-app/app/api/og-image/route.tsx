import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '800px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px',
            zIndex: 1,
          }}
        >
          {/* App icon */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #3b82f6',
              boxShadow: '0 20px 40px rgba(30, 58, 138, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: '60px',
                color: '#1e3a8a',
              }}
            >
              🎰
            </div>
          </div>
          
          {/* Title */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            App Roulette
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: '#e2e8f0',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            Spin & discover amazing Farcaster mini apps!
          </div>
          
          {/* CTA */}
          <div
            style={{
              fontSize: '24px',
              color: '#3b82f6',
              fontWeight: '600',
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            🎯 Find your next favorite app
          </div>
        </div>
        
        {/* Bottom attribution */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            fontSize: '20px',
            color: '#94a3b8',
            fontWeight: '500',
          }}
        >
          by Second City Studio
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
    }
  )
} 