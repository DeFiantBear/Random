// Farcaster Mini App Configuration
export const FARCASTER_CONFIG = {
  // Consistent image URL with proper sizing for embeds
  EMBED_IMAGE_URL: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=800&fit=crop&crop=center",
  
  // App URLs
  BASE_URL: "https://base-app-roulette.vercel.app",
  
  // Embed configuration
  EMBED_CONFIG: {
    version: "1",
    aspectRatio: "3:2",
    button: {
      title: "🎰 Spin the Roulette",
      action: {
        type: "launch_miniapp",
        url: "https://base-app-roulette.vercel.app",
        name: "App Roulette"
      }
    }
  }
} as const;

// Database configuration
export const DB_CONFIG = {
  TABLE_NAME: 'mini_apps'
} as const; 