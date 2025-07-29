"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shuffle, RefreshCw, Plus, ExternalLink, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AddAppForm from "@/components/add-app-form"
import type { FarcasterApp } from "@/types/app"

export default function AppRoulette() {
  const [currentApp, setCurrentApp] = useState<FarcasterApp | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recentlyShown, setRecentlyShown] = useState<Set<string>>(new Set())
  const [totalApps, setTotalApps] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const { toast } = useToast()

  // Fetch database stats
  const getStats = async () => {
    try {
      const response = await fetch("/api/apps", { method: "GET" })
      const data = await response.json()
      setTotalApps(data.total)
    } catch (error) {
      console.error("Failed to get stats:", error)
    }
  }

  // Fetch a random mini app
  const getRandomApp = async () => {
    setIsLoading(true)
    setIsSpinning(true)
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
        toast({
          title: "Need More Apps!",
          description: "Add your mini app to get started.",
          variant: "destructive",
        })
        return
      }

      // Get a random app from the available apps
      const randomIndex = Math.floor(Math.random() * data.apps.length)
      const randomApp = data.apps[randomIndex]

      // Add a small delay for the spinning animation
      setTimeout(() => {
        setCurrentApp(randomApp)
        setTotalApps(data.total)
        setRecentlyShown((prev) => new Set([...prev, randomApp.app_id]))
        setIsSpinning(false)

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
      }, 800)

    } catch (error) {
      setError("Network error")
      setIsSpinning(false)
      toast({
        title: "Connection Error",
        description: "Couldn't connect to the service.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppAdded = () => {
    getStats()
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

  useEffect(() => {
    getRandomApp()
    getStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-blue-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                App Roulette
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700">{totalApps} apps</span>
              </div>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add App
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Add App Form */}
        {showAddForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <AddAppForm onAppAdded={handleAppAdded} />
          </div>
        )}

        {/* Roulette Card */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            {currentApp && !isLoading ? (
              <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
                {/* App Info */}
                <div className="text-center">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {currentApp.name}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                      {currentApp.description}
                    </p>
                  </div>

                  {/* URL Display */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6 transform hover:scale-105 transition-transform duration-300">
                    <code className="text-sm text-blue-800 break-all font-mono">
                      {currentApp.mini_app_url}
                    </code>
                  </div>

                  {/* Date Added */}
                  <div className="text-xs text-gray-400 mb-6">
                    Added {new Date(currentApp.added_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={openMiniApp}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                  >
                    <ExternalLink className="w-5 h-5 mr-3" />
                    Spin & Open
                  </Button>
                  <Button
                    onClick={getRandomApp}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 sm:flex-none h-14 px-8 bg-white border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 font-semibold transition-all duration-300 transform hover:scale-105 rounded-xl"
                  >
                    <Shuffle className={`w-5 h-5 mr-3 ${isSpinning ? 'animate-spin' : ''}`} />
                    Spin Again
                  </Button>
                </div>
              </div>
            ) : error ? (
              <div className="py-16 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Need More Apps!</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We only have {totalApps} mini apps. Add your app to help grow the roulette!
                </p>
                {totalApps > 0 && (
                  <Button
                    onClick={getRandomApp}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                  >
                    <Shuffle className="w-5 h-5 mr-3" />
                    Spin the Roulette
                  </Button>
                )}
              </div>
            ) : (
              <div className="py-16 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {isLoading ? "🎰 Spinning the roulette..." : "Ready to spin?"}
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  {isLoading ? "Finding your next favorite app..." : "Discover amazing Farcaster mini apps"}
                </p>
                {!isLoading && (
                  <Button
                    onClick={getRandomApp}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-16 px-10 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 rounded-2xl"
                  >
                    <Shuffle className="w-6 h-6 mr-3" />
                    Spin the Roulette
                  </Button>
                )}
                {isLoading && (
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-blue-600 font-medium">Spinning...</span>
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
