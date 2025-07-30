import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'App Roulette 🎰',
  description: 'Spin & discover amazing Farcaster mini apps!',
  openGraph: {
    title: 'App Roulette 🎰',
    description: 'Spin & discover amazing Farcaster mini apps!',
    images: ['https://base-app-roulette.vercel.app/api/hero-image'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://base-app-roulette.vercel.app/api/hero-image',
    'fc:frame:button:1': '🎰 Spin the Roulette',
    'fc:frame:button:2': '➕ Add Your App',
    'fc:frame:post_url': 'https://base-app-roulette.vercel.app/api/frame',
  },
}

export default function FramePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">🎰 App Roulette</h1>
        <p className="text-xl mb-8">Spin & discover amazing Farcaster mini apps!</p>
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-6">
          <p className="text-lg">Ready to spin?</p>
          <p className="text-sm text-blue-300 mt-2">Click the buttons below to get started!</p>
        </div>
      </div>
    </div>
  )
} 