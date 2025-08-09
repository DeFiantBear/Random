// Farcaster Mini App Configuration
export const FARCASTER_CONFIG = {
  // Custom embed image
  EMBED_IMAGE_URL: "https://base-app-roulette.vercel.app/Screenshot.png",
  
  // App URLs
  BASE_URL: "https://base-app-roulette.vercel.app",
  
  // Embed configuration
  EMBED_CONFIG: {
    version: "1",
    aspectRatio: "3:2",
    button: {
      title: "🎰 Spin the Roulette",
      action: {
        type: "link", // Changed from "launch_miniapp" for proper Mini App recognition
        url: "https://base-app-roulette.vercel.app",
        name: "App Roulette",
        splashImageUrl: "https://base-app-roulette.vercel.app/Screenshot.png",
        splashBackgroundColor: "#1e293b"
      }
    }
  }
} as const;

// Database configuration
export const DB_CONFIG = {
  TABLE_NAME: 'mini_apps'
} as const; 