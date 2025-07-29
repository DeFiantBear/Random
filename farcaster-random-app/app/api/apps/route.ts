import { NextResponse } from "next/server"

// Local database of Farcaster apps - can be manually updated
const LOCAL_APPS = [
  {
    id: "bankr",
    name: "Bankr",
    description: "A Farcaster mini app for banking and finance",
    miniAppUrl: "https://farcaster.xyz/miniapps/e7UFI7j3sB9Q/bankr",
    creator: "deployer",
    category: "Finance",
    addedAt: new Date().toISOString(),
  },
  {
    id: "example-app",
    name: "Example App",
    description: "An example Farcaster mini app",
    miniAppUrl: "https://farcaster.xyz/miniapps/example/example-app",
    creator: "example-creator",
    category: "Other",
    addedAt: new Date().toISOString(),
  },
  // Add more apps manually here
]

export async function GET() {
  return NextResponse.json({
    apps: LOCAL_APPS,
    total: LOCAL_APPS.length,
  })
}

export async function POST(request: Request) {
  const { excludeIds = [] } = await request.json()

  // Return apps excluding recently shown ones
  const availableApps = LOCAL_APPS.filter((app) => !excludeIds.includes(app.id))

  if (availableApps.length === 0) {
    // Reset if all apps have been shown
    return NextResponse.json({
      apps: LOCAL_APPS,
      reset: true,
    })
  }

  return NextResponse.json({
    apps: availableApps,
    reset: false,
  })
}

// PUT - Add new app (for demonstration, in production this would save to a database)
export async function PUT(request: Request) {
  try {
    const { url } = await request.json()

    // Validate URL format
    if (!url || !url.startsWith("https://farcaster.xyz/miniapps/")) {
      return NextResponse.json(
        { success: false, error: "Invalid URL format. Must start with https://farcaster.xyz/miniapps/" },
        { status: 400 },
      )
    }

    // Check for duplicates
    const existingApp = LOCAL_APPS.find((app) => app.miniAppUrl === url)
    if (existingApp) {
      return NextResponse.json({ success: false, error: "This app is already in the directory" }, { status: 400 })
    }

    // Extract app info from URL
    const urlParts = url.split("/")
    const appSlug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]

    // Create app name from slug
    const appName = appSlug
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    // Create new app
    const newApp = {
      id: appSlug,
      name: appName,
      description: `A Farcaster mini app - ${appName}`,
      miniAppUrl: url,
      creator: "unknown",
      category: "Other",
      addedAt: new Date().toISOString(),
    }

    // Note: In a real app, you would save this to a database
    // For now, we'll just return success but not actually add it to LOCAL_APPS
    // since that's a const array

    return NextResponse.json({
      success: true,
      app: newApp,
      message: "App would be added to database in production",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add app" }, { status: 500 })
  }
}
