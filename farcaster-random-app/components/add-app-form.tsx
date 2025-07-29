"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, RefreshCw, ExternalLink, Check, X } from "lucide-react"
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
          title: "Success!",
          description: "Your app has been added to the directory",
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
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Add Your Mini App</h3>
          <p className="text-gray-600">Just paste your URL - that's it!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="url"
              placeholder="https://farcaster.xyz/miniapps/[ID]/[app-name]"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`h-12 text-base pr-10 ${
                url
                  ? isValidUrl(url)
                    ? "border-green-500 focus:border-green-500"
                    : "border-red-500 focus:border-red-500"
                  : ""
              }`}
            />
            {url && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValidUrl(url) ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !isValidUrl(url)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              {isSubmitting ? "Adding..." : "Add Mini App Instantly"}
            </Button>

            {url && isValidUrl(url) && (
              <Button type="button" onClick={testUrl} variant="outline" className="h-12 px-4 bg-transparent">
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Example: https://farcaster.xyz/miniapps/abc123/my-awesome-app
        </p>
      </CardContent>
    </Card>
  )
}
