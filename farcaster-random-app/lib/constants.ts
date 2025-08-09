// Farcaster Mini App Configuration
export const FARCASTER_CONFIG = {
  // Custom embed image
  EMBED_IMAGE_URL: "https://base-app-roulette.vercel.app/Screenshot.png",
  
  // App URLs
  BASE_URL: "https://base-app-roulette.vercel.app",
  
  // Embed configuration for fc:miniapp meta tag
  EMBED_CONFIG: {
    version: "1",
    imageUrl: "https://base-app-roulette.vercel.app/Screenshot.png",
    aspectRatio: "3:2",
    button: {
      title: "🎰 Spin the Roulette",
      action: {
        type: "link",
        url: "https://base-app-roulette.vercel.app"
      }
    }
  }
} as const;

// Database configuration
export const DB_CONFIG = {
  TABLE_NAME: 'mini_apps'
} as const; 