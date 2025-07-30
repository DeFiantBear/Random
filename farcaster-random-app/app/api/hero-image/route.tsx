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
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Background elements */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
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
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: '120px',
              marginBottom: '20px',
              filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
            }}
          >
            🎰
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #3b82f6, #60a5fa, #93c5fd)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '20px',
              textShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
            }}
          >
            App Roulette
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '28px',
              color: '#cbd5e1',
              marginBottom: '40px',
              maxWidth: '600px',
              lineHeight: 1.4,
            }}
          >
            Discover amazing Farcaster mini apps
          </div>

          {/* Stats box */}
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '20px',
              padding: '20px 40px',
              marginBottom: '30px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#60a5fa',
                fontWeight: 'bold',
              }}
            >
              Spin & Discover
            </div>
          </div>

          {/* Author */}
          <div
            style={{
              fontSize: '18px',
              color: '#64748b',
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
    }
  )
} 