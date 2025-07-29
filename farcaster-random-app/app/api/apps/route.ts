import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({
        apps: [],
        total: 0,
        message: "Database not configured. Please set up Supabase environment variables."
      })
    }

    const { data: apps, error } = await supabase
      .from('mini_apps')
      .select('*')
      .order('added_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch apps' }, { status: 500 })
    }

    return NextResponse.json({
      apps: apps || [],
      total: apps?.length || 0,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({
        apps: [],
        reset: false,
        message: "Database not configured. Please set up Supabase environment variables."
      })
    }

    const { excludeIds = [] } = await request.json()

    // Get all apps excluding recently shown ones
    let query = supabase
      .from('mini_apps')
      .select('*')
      .order('added_at', { ascending: false })

    if (excludeIds.length > 0) {
      query = query.not('app_id', 'in', `(${excludeIds.map((id: string) => `'${id}'`).join(',')})`)
    }

    const { data: availableApps, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch apps' }, { status: 500 })
    }

    if (!availableApps || availableApps.length === 0) {
      // Reset if all apps have been shown - get all apps
      const { data: allApps, error: resetError } = await supabase
        .from('mini_apps')
        .select('*')
        .order('added_at', { ascending: false })

      if (resetError) {
        console.error('Database error:', resetError)
        return NextResponse.json({ error: 'Failed to fetch apps' }, { status: 500 })
      }

      return NextResponse.json({
        apps: allApps || [],
        reset: true,
      })
    }

    return NextResponse.json({
      apps: availableApps,
      reset: false,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Add new app to database
export async function PUT(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: "Database not configured. Please set up Supabase environment variables." 
      }, { status: 500 })
    }

    const { url, name, description, creator, category } = await request.json()

    // Validate URL format
    if (!url || !url.startsWith("https://farcaster.xyz/miniapps/")) {
      return NextResponse.json(
        { success: false, error: "Invalid URL format. Must start with https://farcaster.xyz/miniapps/" },
        { status: 400 },
      )
    }

    // Extract app info from URL if name not provided
    const urlParts = url.split("/")
    const appSlug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]
    const appName = name || appSlug
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    // Check for duplicates
    const { data: existingApp, error: checkError } = await supabase
      .from('mini_apps')
      .select('*')
      .eq('mini_app_url', url)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Database error:', checkError)
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
    }

    if (existingApp) {
      return NextResponse.json({ success: false, error: "This app is already in the directory" }, { status: 400 })
    }

    // Create new app
    const newApp = {
      app_id: appSlug,
      name: appName,
      description: description || `A Farcaster mini app - ${appName}`,
      mini_app_url: url,
      creator: creator || "unknown",
      category: category || "Other",
    }

    // Insert into database
    const { data: insertedApp, error: insertError } = await supabase
      .from('mini_apps')
      .insert([newApp])
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ success: false, error: "Failed to add app to database" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      app: insertedApp,
      message: "App successfully added to database",
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: "Failed to add app" }, { status: 500 })
  }
}
