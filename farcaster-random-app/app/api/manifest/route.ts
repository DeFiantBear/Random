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
    version: "1.0.0",
    accountAssociation: {
      header: "eyJmaWQiOjEwNzcyMzQsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgzOTdmQjY1YkE5NEJkMkI3NjUwMjg2MDE3MWQyMWQxNzRFMjc2OGEzIn0",
      payload: "eyJkb21haW4iOiJiYXNlLWFwcC1yb3VsZXR0ZS52ZXJjZWwuYXBwIn0",
      signature: "cg6afI1xNi8fZY/PubehZ4OcOpd3r45edLRT0Y0KgzIEopDwATJ0CbzBDMDcDlSjuhgKcOctb+y7YVBwB+p8BBs="
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