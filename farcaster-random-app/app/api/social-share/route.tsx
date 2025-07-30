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
          padding: '40px',
          position: 'relative',
        }}
      >
        {/* Background elements */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
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
              fontSize: '80px',
              marginBottom: '15px',
              filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.4))',
            }}
          >
            🎰
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #3b82f6, #60a5fa, #93c5fd)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '15px',
              textShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            }}
          >
            App Roulette
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '20px',
              color: '#cbd5e1',
              marginBottom: '25px',
              maxWidth: '500px',
              lineHeight: 1.4,
            }}
          >
            Spin & discover amazing Farcaster mini apps!
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '25px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#60a5fa',
                fontWeight: '500',
              }}
            >
              🎲 Random Discovery
            </div>
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#60a5fa',
                fontWeight: '500',
              }}
            >
              ➕ Add Your App
            </div>
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#60a5fa',
                fontWeight: '500',
              }}
            >
              🔗 Share on Farcaster
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              background: 'linear-gradient(45deg, #3b82f6, #60a5fa)',
              borderRadius: '16px',
              padding: '12px 24px',
              fontSize: '18px',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
            }}
          >
            Try App Roulette Now!
          </div>

          {/* Author */}
          <div
            style={{
              fontSize: '14px',
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