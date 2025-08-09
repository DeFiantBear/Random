import { NextResponse } from 'next/server';
import { FARCASTER_CONFIG } from '@/lib/constants';

export async function GET() {
  const manifest = {
    name: "App Roulette",
    description: "Discover amazing Farcaster mini apps with our interactive roulette!",
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
    tags: ["farcaster", "mini-apps", "discovery", "roulette"],
    author: {
      name: "Second City Studio",
      url: "https://linktr.ee/2ndCityStudio"
    },
    version: "1.0.0"
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