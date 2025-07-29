"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shuffle, RefreshCw, Users, ArrowUpRight, Plus, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AddAppForm from "@/components/add-app-form"
import type { FarcasterApp } from "@/types/app"

export default function RandomApp() {
  const [currentApp, setCurrentApp] = useState<FarcasterApp | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recentlyShown, setRecentlyShown] = useState<Set<string>>(new Set())
  const [totalApps, setTotalApps] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
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

      setCurrentApp(randomApp)
      setTotalApps(data.total)
      setRecentlyShown((prev) => new Set([...prev, randomApp.app_id]))

      toast({
        title: "Found something based!",
        description: `Discovered ${randomApp.name}`,
      })

      if (data.reset) {
        setRecentlyShown(new Set([randomApp.app_id]))
        toast({
          title: "All apps shown!",
          description: "Starting over with a fresh selection",
        })
      }
    } catch (error) {
      setError("Network error")
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
      description: "Your app has been added to the directory",
    })
  }

  const openMiniApp = () => {
    if (currentApp) {
      window.open(currentApp.mini_app_url, "_blank")
    }
  }

  const viewCreator = () => {
    if (currentApp) {
      window.open(`https://warpcast.com/${currentApp.creator || 'unknown'}`, "_blank")
    }
  }

  useEffect(() => {
    getRandomApp()
    getStats()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold text-gray-900">RandomApp</span>

            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600">{totalApps} apps</span>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Add App Form */}
        {showAddForm && (
          <div className="mb-12">
            <AddAppForm onAppAdded={handleAppAdded} />
          </div>
        )}

        {/* Discovery Card */}
        <Card className="border-0 shadow-xl bg-white">
          <CardContent className="p-8">
            {currentApp && !isLoading ? (
              <div className="space-y-6">
                {/* App Info */}
                <div className="text-left">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentApp.name}</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">{currentApp.description}</p>
                    </div>
                  </div>

                  {/* URL Display */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                    <code className="text-sm text-gray-800 break-all font-mono">{currentApp.mini_app_url}</code>
                  </div>

                  {/* Creator and Category */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <button
                      onClick={viewCreator}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      <span>@{currentApp.creator || 'unknown'}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <div className="text-xs text-gray-400">
                      Added {new Date(currentApp.added_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">{currentApp.category || 'Other'}</Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={openMiniApp}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Mini App
                  </Button>
                  <Button
                    onClick={getRandomApp}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 sm:flex-none h-12 px-6 bg-transparent"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    show me something based
                  </Button>
                </div>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Need More Apps!</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We only have {totalApps} mini apps. Add your app to help grow the directory!
                </p>
                {totalApps > 0 && (
                  <Button
                    onClick={getRandomApp}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-base font-medium"
                  >
                    show me something based
                  </Button>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  {isLoading ? "Finding something based..." : "Ready to discover?"}
                </h3>
                {!isLoading && (
                  <Button
                    onClick={getRandomApp}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-base font-medium"
                  >
                    show me something based
                  </Button>
                )}
                {isLoading && <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
