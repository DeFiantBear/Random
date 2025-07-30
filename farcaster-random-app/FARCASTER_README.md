# 🎰 App Roulette - Farcaster Mini App

A simple Farcaster Mini App that lets users discover amazing Farcaster mini apps through an interactive roulette experience!

## 🚀 What It Does

This is a **Farcaster Mini App** (not a Frame) that:
- **Spins a roulette wheel** to randomly select a Farcaster mini app from the database
- **Lets users add new apps** to the database with a simple form
- **Provides easy sharing** on Farcaster
- **Works as a social card** when shared on Farcaster

## 🏗️ Architecture

### Simple & Clean
- **Frontend**: Next.js with Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Farcaster Integration**: Mini App SDK

### Core Files
- `app/page.tsx` - Main roulette interface
- `components/add-app-form.tsx` - Form to add new apps
- `app/api/apps/route.ts` - Database CRUD operations
- `app/api/random-app/route.ts` - Random app selection
- `app/api/manifest/route.ts` - Farcaster manifest
- `app/api/embed-image/route.ts` - Embed image serving
- `public/farcaster.json` - Static manifest

## 🚀 Quick Start

### 1. Deploy to Vercel
```bash
# Deploy your app to Vercel
vercel --prod
```

### 2. Update Environment Variables
In your Vercel dashboard, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `NEXT_PUBLIC_BASE_URL` - Your deployed Vercel URL (e.g., `https://base-app-roulette.vercel.app`)

### 3. Database Setup
Create a `mini_apps` table in Supabase with these columns:
- `id` (int, primary key)
- `name` (text)
- `description` (text)
- `mini_app_url` (text)
- `created_at` (timestamp)

## 📱 Farcaster Mini App Features

### Main Interface
- **Roulette Wheel**: Animated spinning wheel to select random apps
- **App Display**: Shows selected app with name, description, and visit button
- **Add App Form**: Simple form to add new mini apps to the database
- **Share on Farcaster**: Integrates with Farcaster for easy sharing

### User Flow
1. **Land on page** → See roulette wheel
2. **Click "Spin"** → Get random app from database
3. **Choose action** → Visit app, spin again, or add new app
4. **Share** → Share on Farcaster

## 🔧 Configuration

### Farcaster Mini App Setup
The app uses these meta tags in `app/layout.tsx`:
```html
<meta property="fc:miniapp" content='{"version":"1","imageUrl":"https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=800&fit=crop&crop=center","aspectRatio":"3:2","button":{"title":"🎰 Spin the Roulette","action":{"type":"link","url":"https://base-app-roulette.vercel.app"}}}' />
```

### Manifest
- `/.well-known/farcaster.json` - Redirects to `/api/manifest`
- `public/farcaster.json` - Static manifest file
- `app/api/manifest/route.ts` - Dynamic manifest API
- `app/api/embed-image/route.ts` - Embed image serving

## 🎨 Design

### Theme
- **Primary Color**: Base Chain blue (`#3b82f6`)
- **Background**: Dark gradient with blue accents
- **Brand**: Second City Studio
- **Animations**: Smooth roulette spinning effects

### Images
- Uses Unsplash for reliable embed images with proper sizing
- 3:2 aspect ratio (1200x800) for Farcaster compatibility
- Consistent across all meta tags and manifests
- Proper query parameters for consistent dimensions

## 📊 Database

### Simple Schema
```sql
CREATE TABLE mini_apps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  mini_app_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Operations
- **GET** `/api/apps` - Fetch all apps
- **POST** `/api/apps` - Add new app
- **GET** `/api/random-app` - Get random app

## 🚀 Deployment Checklist

- [x] Deploy to Vercel
- [x] Set environment variables
- [x] Configure database
- [x] Test Mini App functionality
- [x] Verify Farcaster embed
- [x] Test sharing on Farcaster
- [x] Fix embed image configuration
- [x] Add embed image API route

## 🔗 Useful Links

- [Farcaster Mini Apps Documentation](https://miniapps.farcaster.xyz/llms-full.txt)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 🎯 What Makes This Special

1. **Simple & Clean**: No unnecessary complexity
2. **Community-Driven**: Anyone can add apps to the database
3. **Farcaster Native**: Built specifically for Farcaster ecosystem
4. **Easy Sharing**: One-click sharing on Farcaster
5. **Responsive**: Works on mobile and desktop
6. **Proper Embed**: Correctly configured for Farcaster embeds

## 🐛 Troubleshooting

### Common Issues
1. **Embed not showing**: Check Farcaster manifest and meta tags
2. **Database errors**: Verify Supabase credentials
3. **Image not loading**: Ensure image URL is accessible with proper sizing

### Debug
- Check browser console for errors
- Verify all environment variables are set
- Test database connection
- Use Farcaster embed tool to validate configuration

---

**Built with ❤️ by Second City Studio** 