"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shuffle, RefreshCw, Plus, ExternalLink, Sparkles, Circle, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AddAppForm from "@/components/add-app-form"
import type { FarcasterApp } from "@/types/app"
import { sdk } from '@farcaster/miniapp-sdk'
import Head from 'next/head'

export default function AppRoulette() {
  const [currentApp, setCurrentApp] = useState<FarcasterApp | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recentlyShown, setRecentlyShown] = useState<Set<string>>(new Set())
  const [totalApps, setTotalApps] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showRouletteAnimation, setShowRouletteAnimation] = useState(false)
  const { toast } = useToast()



  const getStats = async () => {
    try {
      const response = await fetch("/api/apps", { method: "GET" })
      const data = await response.json()
      setTotalApps(data.total || 0)
    } catch (error) {
      console.error("Failed to get stats:", error)
      setTotalApps(0)
    }
  }

  const getRandomApp = async () => {
    setIsLoading(true)
    setIsSpinning(true)
    setShowRouletteAnimation(true)
    setError(null)

    try {
      const response = await fetch("/api/apps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          excludeIds: Array.from(recentlyShown),
        }),
      })

      const data = await response.json()

      if (data.apps.length === 0) {
        setError("No apps available")
        setShowRouletteAnimation(false)
        toast({
          title: "Need More Apps!",
          description: "Add your mini app to get started.",
          variant: "destructive",
        })
        return
      }

      const randomIndex = Math.floor(Math.random() * data.apps.length)
      const randomApp = data.apps[randomIndex]

      setTimeout(() => {
        setCurrentApp(randomApp)
        setTotalApps(data.total || totalApps)
        setRecentlyShown((prev) => new Set([...prev, randomApp.app_id]))
        setIsSpinning(false)
        setShowRouletteAnimation(false)

        toast({
          title: "🎰 Jackpot!",
          description: `Discovered ${randomApp.name}`,
        })

        if (data.reset) {
          setRecentlyShown(new Set([randomApp.app_id]))
          toast({
            title: "All apps shown!",
            description: "Starting over with a fresh selection",
          })
        }
      }, 2000)

    } catch (error) {
      setError("Network error")
      setIsSpinning(false)
      setShowRouletteAnimation(false)
      toast({
        title: "Connection Error",
        description: "Couldn't connect to the service.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppAdded = async () => {
    await getStats()
    setShowAddForm(false)
    toast({
      title: "Success!",
      description: "Your app has been added to the roulette",
    })
  }

  const openMiniApp = () => {
    if (currentApp) {
      window.open(currentApp.mini_app_url, "_blank")
    }
  }

  const shareOnFarcaster = async () => {
    if (!currentApp) return

    try {
      const shareText = `🎰 Just discovered "${currentApp.name}" on App Roulette!\n\n${currentApp.description}\n\nCheck it out: ${currentApp.mini_app_url}\n\n#Farcaster #MiniApps #AppRoulette`
      
      await sdk.actions.openUrl({
        url: `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`
      })
      
      toast({
        title: "Shared on Farcaster!",
        description: "Your discovery has been shared with the community",
      })
    } catch (error) {
      console.error("Error sharing on Farcaster:", error)
      toast({
        title: "Share Failed",
        description: "Couldn't share on Farcaster. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await getStats()
        await getRandomApp()
        
        // Tell Farcaster the app is ready to display
        await sdk.actions.ready()
      } catch (error) {
        console.error("Error initializing app:", error)
        // Still call ready() even if there's an error
        await sdk.actions.ready()
      }
    }

    initializeApp()
  }, [])

  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle Base-style background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230052FF' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl lg:text-2xl font-medium text-foreground">
                  App Roulette
                </span>
                <div className="flex items-center gap-2">
                  <a 
                    href="https://linktr.ee/2ndCityStudio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    by Second City Studio
                  </a>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs font-medium text-primary">Built on Base</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2 bg-accent border border-border px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-accent-foreground">{totalApps} apps</span>
              </div>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-8 sm:h-auto rounded-xl"
                size="sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add App</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        {showAddForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <AddAppForm onAppAdded={handleAppAdded} />
          </div>
        )}

        <Card className="border border-border shadow-sm bg-card rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {showRouletteAnimation ? (
              <div className="py-16 text-center">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 border-4 border-border border-t-primary rounded-full animate-spin"></div>
                  <div className="absolute inset-3 bg-background rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-medium text-foreground mb-4">
                  🎰 Spinning the Roulette...
                </h3>
                <p className="text-muted-foreground text-lg">
                  Finding your next favorite app...
                </p>
              </div>
            ) : currentApp && !isLoading ? (
              <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
                <div className="text-center">
                  <div className="mb-6">
                    <h3 className="text-3xl font-medium text-foreground mb-3">
                      {currentApp.name}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                      {currentApp.description}
                    </p>
                  </div>

                  <div className="bg-accent border border-border rounded-xl p-4 mb-6 hover:bg-accent/80 transition-colors duration-200">
                    <code className="text-sm text-accent-foreground break-all font-mono">
                      {currentApp.mini_app_url}
                    </code>
                  </div>

                  <div className="text-xs text-muted-foreground mb-6">
                    Added {new Date(currentApp.added_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={openMiniApp}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Visit App
                  </Button>
                  <Button
                    onClick={shareOnFarcaster}
                    variant="outline"
                    className="flex-1 border-border hover:bg-accent text-foreground h-12 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share on Farcaster
                  </Button>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={getRandomApp}
                    disabled={isLoading}
                    variant="outline"
                    className="border-border hover:bg-accent text-foreground font-medium transition-all duration-200 rounded-xl px-6"
                  >
                    <Shuffle className={`w-5 h-5 mr-2 ${isSpinning ? 'animate-spin' : ''}`} />
                    Spin Again
                  </Button>
                </div>
              </div>
            ) : error ? (
              <div className="py-16 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-destructive/20">
                  <Sparkles className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-2xl font-medium text-foreground mb-3">Need More Apps!</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  We only have {totalApps} mini apps. Add your app to help grow the roulette!
                </p>
                {totalApps > 0 && (
                  <Button
                    onClick={getRandomApp}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
                  >
                    <Shuffle className="w-5 h-5 mr-2" />
                    Spin the Roulette
                  </Button>
                )}
              </div>
            ) : (
              <div className="py-16 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-medium text-foreground mb-4">
                  {isLoading ? "🎰 Spinning the roulette..." : "Ready to spin?"}
                </h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  {isLoading ? "Finding your next favorite app..." : "Discover amazing Farcaster mini apps built on Base"}
                </p>
                {!isLoading && (
                  <Button
                    onClick={getRandomApp}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
                  >
                    <Shuffle className="w-6 h-6 mr-2" />
                    Spin the Roulette
                  </Button>
                )}
                {isLoading && (
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                    <span className="text-muted-foreground font-medium">Spinning...</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
