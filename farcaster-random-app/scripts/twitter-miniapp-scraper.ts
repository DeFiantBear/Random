// Twitter Mini App Link Scraper
// Searches Twitter for farcaster.xyz/miniapps/ links and databases them

interface TwitterMiniAppLink {
  url: string
  tweetId: string
  tweetText: string
  author: string
  timestamp: string
  extractedAppId?: string
  extractedAppName?: string
}

interface FarcasterApp {
  id: string
  name: string
  description: string
  miniAppUrl: string
  creator: string
  category: string
  source: string
  discoveredAt: string
}

// Search terms for Twitter API
const SEARCH_QUERIES = [
  "farcaster.xyz/miniapps/",
  '"farcaster.xyz/miniapps"',
  "miniapps farcaster",
  "farcaster mini app",
  "warpcast miniapp",
  "farcaster frame app",
]

// Extract app info from farcaster.xyz/miniapps/ URL
function extractAppInfo(url: string): { appId: string; appName: string } | null {
  const match = url.match(/farcaster\.xyz\/miniapps\/([^/]+)\/([^/?\s]+)/i)
  if (match) {
    return {
      appId: match[1],
      appName: match[2],
    }
  }
  return null
}

// Clean and format app name
function formatAppName(rawName: string): string {
  return rawName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Extract description from tweet text
function extractDescription(tweetText: string, appName: string): string {
  // Remove URLs and mentions
  let cleaned = tweetText
    .replace(/https?:\/\/[^\s]+/g, "")
    .replace(/@\w+/g, "")
    .replace(/\n+/g, " ")
    .trim()

  // If tweet is too short, create a generic description
  if (cleaned.length < 20) {
    return `A Farcaster mini app called ${appName}`
  }

  // Truncate if too long
  if (cleaned.length > 200) {
    cleaned = cleaned.substring(0, 197) + "..."
  }

  return cleaned
}

// Categorize app based on name and description
function categorizeApp(name: string, description: string): string {
  const nameAndDesc = (name + " " + description).toLowerCase()

  if (nameAndDesc.includes("game") || nameAndDesc.includes("play") || nameAndDesc.includes("puzzle")) {
    return "Gaming"
  }
  if (
    nameAndDesc.includes("defi") ||
    nameAndDesc.includes("swap") ||
    nameAndDesc.includes("token") ||
    nameAndDesc.includes("crypto") ||
    nameAndDesc.includes("wallet")
  ) {
    return "Finance"
  }
  if (
    nameAndDesc.includes("art") ||
    nameAndDesc.includes("nft") ||
    nameAndDesc.includes("create") ||
    nameAndDesc.includes("design")
  ) {
    return "Art & Creativity"
  }
  if (
    nameAndDesc.includes("social") ||
    nameAndDesc.includes("chat") ||
    nameAndDesc.includes("friend") ||
    nameAndDesc.includes("community")
  ) {
    return "Social"
  }
  if (nameAndDesc.includes("tool") || nameAndDesc.includes("utility") || nameAndDesc.includes("helper")) {
    return "Utilities"
  }
  if (nameAndDesc.includes("news") || nameAndDesc.includes("feed") || nameAndDesc.includes("content")) {
    return "News & Content"
  }

  return "Other"
}

// Mock Twitter API search (in real implementation, you'd use Twitter API v2)
async function searchTwitterForMiniApps(): Promise<TwitterMiniAppLink[]> {
  console.log("🔍 Searching Twitter for Farcaster mini app links...")

  // This would be replaced with actual Twitter API calls
  // For now, returning mock data based on common patterns
  const mockResults: TwitterMiniAppLink[] = [
    {
      url: "https://farcaster.xyz/miniapps/abc123/feeds",
      tweetId: "1234567890",
      tweetText: "Check out this amazing feed aggregator for Farcaster! 🚀 https://farcaster.xyz/miniapps/abc123/feeds",
      author: "procoin",
      timestamp: new Date().toISOString(),
    },
    {
      url: "https://farcaster.xyz/miniapps/def456/stylize-me",
      tweetId: "1234567891",
      tweetText:
        "Transform your photos with AI-powered style transfer! Upload any image and apply artistic styles 🎨 https://farcaster.xyz/miniapps/def456/stylize-me",
      author: "stephancill",
      timestamp: new Date().toISOString(),
    },
    {
      url: "https://farcaster.xyz/miniapps/ghi789/crypto-quiz",
      tweetId: "1234567892",
      tweetText:
        "Test your crypto knowledge with this fun quiz game! 🧠💰 https://farcaster.xyz/miniapps/ghi789/crypto-quiz",
      author: "cryptoquizmaster",
      timestamp: new Date().toISOString(),
    },
    {
      url: "https://farcaster.xyz/miniapps/jkl012/nft-gallery",
      tweetId: "1234567893",
      tweetText:
        "Showcase your NFT collection in a beautiful gallery format 🖼️ https://farcaster.xyz/miniapps/jkl012/nft-gallery",
      author: "nftcollector",
      timestamp: new Date().toISOString(),
    },
    {
      url: "https://farcaster.xyz/miniapps/mno345/weather-cast",
      tweetId: "1234567894",
      tweetText:
        "Get weather updates directly in your Farcaster feed! ⛅ https://farcaster.xyz/miniapps/mno345/weather-cast",
      author: "weatherdev",
      timestamp: new Date().toISOString(),
    },
  ]

  // Extract app info for each link
  return mockResults.map((result) => {
    const appInfo = extractAppInfo(result.url)
    return {
      ...result,
      extractedAppId: appInfo?.appId,
      extractedAppName: appInfo?.appName,
    }
  })
}

// Process Twitter results into Farcaster app format
function processTwitterResults(twitterLinks: TwitterMiniAppLink[]): FarcasterApp[] {
  const apps: FarcasterApp[] = []
  const seenUrls = new Set<string>()

  for (const link of twitterLinks) {
    // Skip duplicates
    if (seenUrls.has(link.url)) continue
    seenUrls.add(link.url)

    // Skip if we couldn't extract app info
    if (!link.extractedAppId || !link.extractedAppName) continue

    const appName = formatAppName(link.extractedAppName)
    const description = extractDescription(link.tweetText, appName)
    const category = categorizeApp(appName, description)

    apps.push({
      id: link.extractedAppName,
      name: appName,
      description,
      miniAppUrl: link.url,
      creator: link.author,
      category,
      source: `Twitter (${link.tweetId})`,
      discoveredAt: link.timestamp,
    })
  }

  return apps
}

// Main scraper function
export async function scrapeTwitterForMiniApps(): Promise<FarcasterApp[]> {
  try {
    console.log("🚀 Starting Twitter mini app discovery...")

    // Search Twitter for mini app links
    const twitterLinks = await searchTwitterForMiniApps()
    console.log(`📱 Found ${twitterLinks.length} potential mini app links`)

    // Process results
    const discoveredApps = processTwitterResults(twitterLinks)
    console.log(`✅ Processed ${discoveredApps.length} valid mini apps`)

    // Log discovered apps
    discoveredApps.forEach((app) => {
      console.log(`📦 ${app.name} by @${app.creator} - ${app.category}`)
      console.log(`   ${app.miniAppUrl}`)
      console.log(`   "${app.description}"`)
      console.log("")
    })

    return discoveredApps
  } catch (error) {
    console.error("❌ Error scraping Twitter:", error)
    return []
  }
}

// Run the scraper
if (require.main === module) {
  scrapeTwitterForMiniApps().then((apps) => {
    console.log(`🎉 Discovery complete! Found ${apps.length} mini apps`)
  })
}
