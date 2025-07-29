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
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              fontSize: '80px',
              marginRight: '20px',
            }}
          >
            🎰
          </div>
          <div
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #3b82f6, #60a5fa, #93c5fd)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            App Roulette
          </div>
        </div>
        
        <div
          style={{
            fontSize: '24px',
            color: '#cbd5e1',
            textAlign: 'center',
            maxWidth: '600px',
            lineHeight: '1.4',
            marginBottom: '30px',
          }}
        >
          Discover amazing Farcaster mini apps with our interactive roulette!
        </div>
        
        <div
          style={{
            fontSize: '18px',
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          by Second City Studio
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
} 