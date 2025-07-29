import { NextResponse } from "next/server"

// Real Farcaster app data sources
const FARCASTER_APP_SOURCES = [
  "https://warpcast.com/~/developers/frames", // Warpcast frame directory
  "https://farcaster.network/apps", // Farcaster app registry
  "https://frames.js.org/gallery", // Frames gallery
  // Add more real sources
]

async function fetchRealFarcasterApps() {
  try {
    // Check if API key is available
    if (!process.env.FARCASTER_API_KEY) {
      console.log("No FARCASTER_API_KEY found, returning empty array")
      return []
    }

    // In production, you'd scrape or use APIs from:
    // - Warpcast frame directory
    // - Farcaster app registries
    // - GitHub repos with Farcaster tags
    // - Community-maintained lists

    const response = await fetch("https://api.farcaster.xyz/v1/apps", {
      headers: {
        Authorization: `Bearer ${process.env.FARCASTER_API_KEY}`,
      },
    })

    if (!response.ok) {
      console.error("Farcaster API response not ok:", response.status)
      return []
    }

    const data = await response.json()

    // Filter for lesser-known apps (low engagement/new)
    return data.apps?.filter(
      (app) =>
        app.weeklyActiveUsers < 1000 || // Hidden gems criteria
        app.createdAt > Date.now() - 30 * 24 * 60 * 60 * 1000, // New apps
    ) || []
  } catch (error) {
    console.error("Failed to fetch real apps:", error)
    return []
  }
}

export async function GET() {
  const realApps = await fetchRealFarcasterApps()

  return NextResponse.json({
    apps: realApps,
    total: realApps.length, // This would be 1000s in production
  })
}

export async function POST(request: Request) {
  const { excludeIds = [] } = await request.json()

  // Fetch real apps
  const realApps = await fetchRealFarcasterApps()

  // Return apps excluding recently shown ones
  const availableApps = realApps.filter((app) => !excludeIds.includes(app.id))

  if (availableApps.length === 0) {
    // Reset if all apps have been shown
    return NextResponse.json({
      apps: realApps,
      reset: true,
    })
  }

  return NextResponse.json({
    apps: availableApps,
    reset: false,
  })
}
