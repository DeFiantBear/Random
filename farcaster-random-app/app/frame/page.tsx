import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'App Roulette Frame',
  description: 'Spin & discover amazing Farcaster mini apps!',
  openGraph: {
    title: 'App Roulette 🎰',
    description: 'Spin & discover amazing Farcaster mini apps!',
    images: ['https://picsum.photos/1200/800'],
  },
}

export default function FramePage() {
  return (
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://picsum.photos/1200/800" />
        <meta property="fc:frame:button:1" content="🎰 Spin the Roulette" />
        <meta property="fc:frame:post_url" content="https://base-app-roulette.vercel.app/frame" />
      </head>
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎰</div>
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>App Roulette</h1>
          <p style={{ fontSize: '18px', marginBottom: '32px' }}>
            Spin & discover amazing Farcaster mini apps!
          </p>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '16px 32px', 
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <p style={{ margin: 0 }}>Click the button above to spin the roulette!</p>
          </div>
        </div>
      </body>
    </html>
  )
} 