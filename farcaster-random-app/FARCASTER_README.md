# 🎰 App Roulette - Farcaster App

A Farcaster frame that lets users discover amazing Farcaster mini apps through an interactive roulette experience!

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
- `NEXT_PUBLIC_BASE_URL` - Your deployed Vercel URL (e.g., `https://your-app.vercel.app`)

### 3. Update Frame URLs
Replace `your-domain.vercel.app` in these files with your actual Vercel domain:
- `public/frame.html`
- `farcaster.json`
- `app/api/frame/route.ts`

### 4. Test Your Frame
Visit: `https://your-domain.vercel.app/frame.html`

## 📱 Farcaster Frame Features

### Frame Structure
- **Home Frame**: Main entry point with two buttons
- **Spin Frame**: Shows random app with visit and spin again options
- **Add App Frame**: Information about adding apps

### Frame Flow
1. **Home** → Spin the Roulette / Add Your App
2. **Spin** → Visit App / Spin Again / Home
3. **Add App** → Back to Home

## 🔧 Configuration

### Frame Metadata
The frame uses these meta tags in `public/frame.html`:
```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="..." />
<meta property="fc:frame:button:1" content="🎰 Spin the Roulette" />
<meta property="fc:frame:button:2" content="➕ Add Your App" />
<meta property="fc:frame:post_url" content="..." />
```

### API Endpoints
- `GET /api/og` - Generates Open Graph images
- `POST /api/frame` - Handles frame interactions
- `GET /api/frame` - Returns default frame

## 🎨 Customization

### Colors & Branding
- Primary: Base Chain blue (`#3b82f6`)
- Background: Dark gradient with blue accents
- Brand: Second City Studio

### Images
- `og-image.png` - Main frame image (1200x630)
- `app-image.png` - App discovery image
- `add-app-image.png` - Add app information image

## 📊 Database Integration

The frame connects to your Supabase database to:
- Fetch random apps from the `mini_apps` table
- Display app information in frames
- Support the roulette functionality

## 🚀 Deployment Checklist

- [ ] Deploy to Vercel
- [ ] Set environment variables
- [ ] Update domain URLs
- [ ] Test frame functionality
- [ ] Verify database connection
- [ ] Test on Farcaster

## 🔗 Useful Links

- [Farcaster Frame Documentation](https://docs.farcaster.xyz/developers/frames)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 🎯 Next Steps

1. **Generate Dynamic Images**: Create dynamic OG images for each app
2. **Add Analytics**: Track frame interactions
3. **Improve UX**: Add more interactive elements
4. **Community Features**: Add social sharing and ratings

## 🐛 Troubleshooting

### Common Issues
1. **Frame not loading**: Check domain URLs in configuration
2. **Database errors**: Verify Supabase credentials
3. **Image not showing**: Ensure OG image endpoint is working

### Debug Mode
Add `?debug=true` to your frame URL to see detailed logs.

---

**Built with ❤️ by Second City Studio** 