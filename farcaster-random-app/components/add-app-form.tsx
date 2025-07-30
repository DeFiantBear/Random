"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Circle, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { sdk } from '@farcaster/miniapp-sdk'

interface AddAppFormProps {
  onAppAdded: () => void
}

export default function AddAppForm({ onAppAdded }: AddAppFormProps) {
  const [miniAppUrl, setMiniAppUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate URL starts with required prefix
    if (!miniAppUrl.startsWith("https://farcaster.xyz/miniapps/")) {
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
          url: miniAppUrl,
        }),
      })

      if (response.ok) {
        toast({
          title: "Added to Roulette!",
          description: "Your app has been successfully added to the collection.",
        })
        
        setMiniAppUrl("")
        onAppAdded()
      } else {
        throw new Error("Failed to add app")
      }
    } catch (error) {
      console.error("Error adding app:", error)
      toast({
        title: "Error",
        description: "Failed to add your app. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const shareOnFarcaster = async () => {
    try {
      const shareText = `🎰 Just added my app to App Roulette!\n\nHelp grow the Farcaster mini app ecosystem by adding your app too!\n\n#Farcaster #MiniApps #AppRoulette #BuildOnFarcaster`
      
      await sdk.actions.openUrl({
        url: `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`
      })
      
      toast({
        title: "Shared on Farcaster!",
        description: "Help spread the word about App Roulette!",
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

  return (
    <Card className="border border-blue-500/20 shadow-2xl bg-black/20 backdrop-blur-xl rounded-3xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 mr-3">
            <Circle className="w-6 h-6 text-white animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
            Add Your Mini App
          </CardTitle>
        </div>
        <p className="text-blue-200 text-lg">
          Help grow the Farcaster mini app ecosystem!
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-blue-200 font-medium">
              Farcaster Mini App URL *
            </Label>
            <Input
              id="url"
              type="url"
              value={miniAppUrl}
              onChange={(e) => setMiniAppUrl(e.target.value)}
              placeholder="https://farcaster.xyz/miniapps/your-app"
              required
              className="bg-black/20 border-blue-500/20 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
            <h4 className="text-blue-200 font-semibold mb-2">URL Requirements:</h4>
            <div className="text-sm text-blue-300 space-y-1">
              <div>• Must start with: https://farcaster.xyz/miniapps/</div>
              <div>• Example: https://farcaster.xyz/miniapps/your-app-name</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl border border-blue-400/20"
            >
              {isSubmitting ? (
                <>
                  <Circle className="w-5 h-5 mr-3 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5 mr-3" />
                  Add to Roulette
                </>
              )}
            </Button>
            
            <Button
              type="button"
              onClick={shareOnFarcaster}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white h-14 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl border border-green-400/20"
            >
              <Share2 className="w-5 h-5 mr-3" />
              Share
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
