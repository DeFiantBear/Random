import { type NextRequest, NextResponse } from "next/server"
import type { FarcasterApp } from "@/types/app"

// In-memory database (replace with real database later)
const miniApps: FarcasterApp[] = [
  {
    id: 1,
    app_id: "bankr",
    name: "Bankr",
    description: "A Farcaster mini app - Bankr",
    mini_app_url: "https://farcaster.xyz/miniapps/e7UFI7j3sB9Q/bankr",
    creator: "deployer",
    category: "Finance",
    added_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// GET - Get database stats
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      totalApps: miniApps.length,
      apps: miniApps,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to get apps" }, { status: 500 })
  }
}

// POST - Get random app
export async function POST(request: NextRequest) {
  try {
    const { excludeIds = [] } = await request.json()

    if (miniApps.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No apps available",
        totalApps: 0,
      })
    }

    // Filter out recently shown apps
    const availableApps = miniApps.filter((app) => !excludeIds.includes(app.id))

    // If all apps have been shown, reset and show all apps again
    if (availableApps.length === 0) {
      const randomApp = miniApps[Math.floor(Math.random() * miniApps.length)]
      return NextResponse.json({
        success: true,
        app: randomApp,
        totalApps: miniApps.length,
        reset: true,
      })
    }

    // Get random app from available apps
    const randomApp = availableApps[Math.floor(Math.random() * availableApps.length)]

    return NextResponse.json({
      success: true,
      app: randomApp,
      totalApps: miniApps.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to get random app" }, { status: 500 })
  }
}

// PUT - Add new app
export async function PUT(request: NextRequest) {
  try {
    const { url } = await request.json()

    // Validate URL format
    if (!url || !url.startsWith("https://farcaster.xyz/miniapps/")) {
      return NextResponse.json(
        { success: false, error: "Invalid URL format. Must start with https://farcaster.xyz/miniapps/" },
        { status: 400 },
      )
    }

    // Extract app info from URL
    const urlParts = url.split("/")
    const appSlug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]

    // Check for duplicates
    const existingApp = miniApps.find((app) => app.mini_app_url === url)
    if (existingApp) {
      return NextResponse.json({ success: false, error: "This app is already in the directory" }, { status: 400 })
    }

    // Create app name from slug
    const appName = appSlug
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    // Create new app
    const newApp: FarcasterApp = {
      id: miniApps.length + 1,
      app_id: appSlug,
      name: appName,
      description: `A Farcaster mini app - ${appName}`,
      mini_app_url: url,
      creator: "unknown",
      category: "Other",
      added_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Add to database
    miniApps.push(newApp)

    return NextResponse.json({
      success: true,
      app: newApp,
      totalApps: miniApps.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add app" }, { status: 500 })
  }
}
