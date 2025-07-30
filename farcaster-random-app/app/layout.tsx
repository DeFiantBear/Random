import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "App Roulette - Spin & Discover Farcaster Mini Apps",
  description: "🎰 Discover amazing Farcaster mini apps with our interactive roulette! Spin to find your next favorite app or add your own to the collection.",
  metadataBase: new URL('https://base-app-roulette.vercel.app'),
  openGraph: {
    title: "App Roulette 🎰",
    description: "Spin & discover amazing Farcaster mini apps!",
    url: 'https://base-app-roulette.vercel.app',
    siteName: 'App Roulette',
    images: [
      {
        url: 'https://picsum.photos/1200/800?random=1',
        width: 1200,
        height: 800,
        alt: 'App Roulette - Farcaster Mini App Discovery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'App Roulette 🎰',
    description: 'Spin & discover amazing Farcaster mini apps!',
    images: ['https://picsum.photos/1200/800?random=1'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
        <meta property="fc:miniapp" content='{"version":"1","imageUrl":"https://picsum.photos/1200/800?random=1","button":{"title":"🎰 Spin the Roulette","action":{"type":"post","url":"https://base-app-roulette.vercel.app"}}}' />
        <meta property="og:title" content="App Roulette 🎰" />
        <meta property="og:description" content="Spin & discover amazing Farcaster mini apps!" />
        <meta property="og:image" content="https://picsum.photos/1200/800?random=1" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="800" />
        <meta property="og:url" content="https://base-app-roulette.vercel.app" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="App Roulette 🎰" />
        <meta name="twitter:description" content="Spin & discover amazing Farcaster mini apps!" />
        <meta name="twitter:image" content="https://picsum.photos/1200/800?random=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
