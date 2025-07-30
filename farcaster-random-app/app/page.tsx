"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shuffle, RefreshCw, Plus, ExternalLink, Sparkles, Circle, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <nav className="border-b border-blue-500/20 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4 lg:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Circle className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-spin" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
                  App Roulette
                </span>
                <a 
                  href="https://linktr.ee/2ndCityStudio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-300/70 hover:text-blue-200 transition-colors duration-300 cursor-pointer"
                >
                  by Second City Studio
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className="flex items-center space-x-1 sm:space-x-2 bg-blue-500/10 border border-blue-500/20 px-2 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-blue-300">{totalApps} apps</span>
              </div>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-400/20 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-auto"
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

        <Card className="border border-blue-500/20 shadow-2xl bg-black/20 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {showRouletteAnimation ? (
              <div className="py-16 text-center">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 rounded-full animate-spin shadow-2xl shadow-blue-500/25"></div>
                  <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spin">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-4 h-4 bg-blue-400 rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-60px)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 animate-pulse">
                  🎰 Spinning the Roulette...
                </h3>
                <p className="text-blue-300 text-lg">
                  Finding your next favorite app...
                </p>
              </div>
            ) : currentApp && !isLoading ? (
              <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
                <div className="text-center">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
                      {currentApp.name}
                    </h3>
                    <p className="text-blue-200 text-lg leading-relaxed max-w-md mx-auto">
                      {currentApp.description}
                    </p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6 transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
                    <code className="text-sm text-blue-300 break-all font-mono">
                      {currentApp.mini_app_url}
                    </code>
                  </div>

                  <div className="text-xs text-blue-400/70 mb-6">
                    Added {new Date(currentApp.added_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={openMiniApp}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl border border-blue-400/20"
                  >
                    <ExternalLink className="w-5 h-5 mr-3" />
                    Visit App
                  </Button>
                  <Button
                    onClick={shareOnFarcaster}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl border border-green-400/20"
                  >
                    <Share2 className="w-5 h-5 mr-3" />
                    Share on Farcaster
                  </Button>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={getRandomApp}
                    disabled={isLoading}
                    variant="outline"
                    className="bg-black/20 border-2 border-blue-500/20 hover:border-blue-400 hover:bg-blue-500/10 text-blue-300 font-semibold transition-all duration-300 transform hover:scale-105 rounded-2xl backdrop-blur-sm px-8"
                  >
                    <Shuffle className={`w-5 h-5 mr-3 ${isSpinning ? 'animate-spin' : ''}`} />
                    Spin Again
                  </Button>
                </div>
              </div>
            ) : error ? (
              <div className="py-16 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                  <Sparkles className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Need More Apps!</h3>
                <p className="text-blue-300 mb-8 max-w-md mx-auto">
                  We only have {totalApps} mini apps. Add your app to help grow the roulette!
                </p>
                {totalApps > 0 && (
                  <Button
                    onClick={getRandomApp}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl"
                  >
                    <Shuffle className="w-5 h-5 mr-3" />
                    Spin the Roulette
                  </Button>
                )}
              </div>
            ) : (
              <div className="py-16 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/25">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {isLoading ? "🎰 Spinning the roulette..." : "Ready to spin?"}
                </h3>
                <p className="text-blue-300 mb-8 text-lg">
                  {isLoading ? "Finding your next favorite app..." : "Discover amazing Farcaster mini apps"}
                </p>
                {!isLoading && (
                  <Button
                    onClick={getRandomApp}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white h-16 px-10 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 rounded-2xl border border-blue-400/20"
                  >
                    <Shuffle className="w-6 h-6 mr-3" />
                    Spin the Roulette
                  </Button>
                )}
                {isLoading && (
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                    <span className="text-blue-400 font-medium">Spinning...</span>
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
