import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    name: "App Roulette",
    description: "Discover amazing Farcaster mini apps with our interactive roulette! Spin to find your next favorite app or add your own to the collection.",
    image: "https://base-app-roulette.vercel.app/api/hero-image",
    external_url: "https://base-app-roulette.vercel.app",
    frame_url: "https://base-app-roulette.vercel.app/frame.html",
    app_url: "https://base-app-roulette.vercel.app",
    category: "entertainment",
    tags: ["farcaster", "mini-apps", "discovery", "roulette", "apps"],
    author: {
      name: "Second City Studio",
      url: "https://linktr.ee/2ndCityStudio"
    },
    version: "1.0.0",
    features: [
      "Random app discovery",
      "App submission", 
      "Interactive roulette",
      "Farcaster frame integration"
    ],
    permissions: [
      "read"
    ]
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 