"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, RefreshCw, ExternalLink, Check, X, Sparkles, Circle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddAppFormProps {
  onAppAdded: () => void
}

export default function AddAppForm({ onAppAdded }: AddAppFormProps) {
  const [url, setUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const isValidUrl = (url: string) => {
    return url.startsWith("https://farcaster.xyz/miniapps/") && url.length > 35
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter your mini app URL",
        variant: "destructive",
      })
      return
    }

    if (!isValidUrl(url.trim())) {
      toast({
        title: "Invalid URL",
        description: "URL must start with https://farcaster.xyz/miniapps/",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/apps", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "🎰 Added to Roulette!",
          description: "Your app has been added to the roulette",
        })
        setUrl("")
        onAppAdded()
      } else {
        toast({
          title: "Failed to add app",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add app. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const testUrl = () => {
    if (url.trim()) {
      window.open(url.trim(), "_blank")
    }
  }

  return (
    <Card className="border border-blue-500/20 shadow-2xl bg-black/20 backdrop-blur-xl rounded-3xl overflow-hidden">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/25">
            <Circle className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
            Add to the Roulette
          </h3>
          <p className="text-blue-200 text-lg">Just paste your URL - that's it!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type="url"
              placeholder="https://farcaster.xyz/miniapps/[ID]/[app-name]"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`h-14 text-base pr-12 rounded-2xl border-2 transition-all duration-300 bg-black/20 backdrop-blur-sm text-white placeholder:text-blue-300/50 ${
                url
                  ? isValidUrl(url)
                    ? "border-green-500 focus:border-green-500 bg-green-500/10"
                    : "border-red-500 focus:border-red-500 bg-red-500/10"
                  : "border-blue-500/20 focus:border-blue-400 focus:bg-blue-500/10"
              }`}
            />
            {url && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {isValidUrl(url) ? (
                  <Check className="w-6 h-6 text-green-400 animate-in zoom-in-50 duration-200" />
                ) : (
                  <X className="w-6 h-6 text-red-400 animate-in zoom-in-50 duration-200" />
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || !isValidUrl(url)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl border border-blue-400/20 disabled:transform-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <Plus className="w-5 h-5 mr-3" />
              )}
              {isSubmitting ? "Adding to Roulette..." : "Add to Roulette"}
            </Button>

            {url && isValidUrl(url) && (
              <Button 
                type="button" 
                onClick={testUrl} 
                variant="outline" 
                className="h-14 px-6 bg-black/20 border-2 border-blue-500/20 hover:border-blue-400 hover:bg-blue-500/10 text-blue-300 font-semibold transition-all duration-300 transform hover:scale-105 rounded-2xl backdrop-blur-sm"
              >
                <ExternalLink className="w-5 h-5" />
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
          <p className="text-sm text-blue-200 text-center font-medium">
            Example: <code className="bg-black/20 px-2 py-1 rounded text-blue-300">https://farcaster.xyz/miniapps/abc123/my-awesome-app</code>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
