"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, RefreshCw, ExternalLink, Check, X, Sparkles } from "lucide-react"
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
    <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Add to the Roulette
          </h3>
          <p className="text-gray-600 text-lg">Just paste your URL - that's it!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type="url"
              placeholder="https://farcaster.xyz/miniapps/[ID]/[app-name]"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`h-14 text-base pr-12 rounded-xl border-2 transition-all duration-300 ${
                url
                  ? isValidUrl(url)
                    ? "border-green-500 focus:border-green-500 bg-green-50"
                    : "border-red-500 focus:border-red-500 bg-red-50"
                  : "border-blue-200 focus:border-blue-500 focus:bg-blue-50"
              }`}
            />
            {url && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {isValidUrl(url) ? (
                  <Check className="w-6 h-6 text-green-500 animate-in zoom-in-50 duration-200" />
                ) : (
                  <X className="w-6 h-6 text-red-500 animate-in zoom-in-50 duration-200" />
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || !isValidUrl(url)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl disabled:transform-none disabled:opacity-50"
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
                className="h-14 px-6 bg-white border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 font-semibold transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                <ExternalLink className="w-5 h-5" />
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800 text-center font-medium">
            Example: <code className="bg-white px-2 py-1 rounded text-blue-600">https://farcaster.xyz/miniapps/abc123/my-awesome-app</code>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
