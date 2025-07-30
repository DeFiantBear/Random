import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'App Roulette - Spin & Discover',
  description: 'Spin the roulette to discover amazing Farcaster mini apps!',
  openGraph: {
    title: 'App Roulette 🎰',
    description: 'Spin & discover amazing Farcaster mini apps!',
    images: ['https://base-app-roulette.vercel.app/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://base-app-roulette.vercel.app/og-image.png',
    'fc:frame:button:1': '🎰 Spin the Roulette',
    'fc:frame:post_url': 'https://base-app-roulette.vercel.app/frame',
  },
}

export default function FramePage() {
  return (
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
  )
} 