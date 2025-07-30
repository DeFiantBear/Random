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
        url: 'https://base-app-roulette.vercel.app/placeholder.jpg',
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
    images: ['https://base-app-roulette.vercel.app/placeholder.jpg'],
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
        <meta property="fc:miniapp" content='{"version":"1","imageUrl":"https://base-app-roulette.vercel.app/placeholder.jpg","button":{"title":"🎰 Spin the Roulette","action":{"type":"post","url":"https://base-app-roulette.vercel.app"}}}' />
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
