import { NextResponse } from 'next/server';
import { FARCASTER_CONFIG } from '@/lib/constants';

export async function GET() {
  const manifest = {
    name: "App Roulette",
    description: "Discover amazing Farcaster mini apps with our interactive roulette! Spin to find your next favorite app or add your own to the collection.",
    image: FARCASTER_CONFIG.EMBED_IMAGE_URL,
    external_url: FARCASTER_CONFIG.BASE_URL,
    app_url: FARCASTER_CONFIG.BASE_URL,
    app: {
      name: "App Roulette",
      url: FARCASTER_CONFIG.BASE_URL,
      icon: FARCASTER_CONFIG.EMBED_IMAGE_URL,
      description: "Discover amazing Farcaster mini apps with our interactive roulette!"
    },
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
      "Farcaster mini app integration"
    ],
    permissions: [
      "read"
    ],
    accountAssociation: {
      header: "eyJmaWQiOjEwNzcyMzQsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg3NTZBZWI4MzExMjVmNzgyQzJhM0FCNjQ2NWU4NWVFMDMyMkI5N2UzIn0",
      payload: "eyJkb21haW4iOiJiYXNlLWFwcC1yb3VsZXR0ZS52ZXJjZWwuYXBwIn0",
      signature: "MHgwZTBjYmIxYWE0YjIyY2JlNTY1ZTlmYWYyMTRjNzM4MzExOTRkNzc1NjQ4MDVlODk4NjMzYTRkZDM2YTQ4ZjcyNWZhZDliZWRjYjI4NDViZjQ4NmRmYjg0M2Y0YjlhYjU3NWMwMDRhZWRkOTY5ZTIxOTVhNWNlODg0Y2U1NmJhMjFi"
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 