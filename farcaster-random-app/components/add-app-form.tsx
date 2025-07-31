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
      const shareText = `🎰 Just added my app to App Roulette!\n\nHelp grow the Farcaster mini app ecosystem by adding your app too!\n\n🎰 Discover apps: https://base-app-roulette.vercel.app\n\n#Farcaster #MiniApps #AppRoulette #Base #BuildOnFarcaster`
      
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
    <Card className="border border-border/30 shadow-2xl bg-card/80 backdrop-blur-xl rounded-3xl hover:shadow-3xl transition-all duration-500 animate-float">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 premium-gradient rounded-xl flex items-center justify-center shadow-xl animate-glow mr-4">
            <Circle className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
            Add Your Mini App
          </CardTitle>
        </div>
        <p className="text-muted-foreground text-xl font-medium">
          Help grow the Farcaster mini app ecosystem!
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="url" className="text-foreground font-semibold text-lg">
              Farcaster Mini App URL *
            </Label>
            <Input
              id="url"
              type="url"
              value={miniAppUrl}
              onChange={(e) => setMiniAppUrl(e.target.value)}
              placeholder="https://farcaster.xyz/miniapps/your-app"
              required
              className="h-12 text-lg font-mono border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50"
            />
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 hover:bg-primary/10 transition-all duration-300 shadow-lg backdrop-blur-sm">
            <h4 className="text-primary font-semibold mb-3 text-lg">URL Requirements:</h4>
            <div className="text-sm text-muted-foreground space-y-2 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Must start with: https://farcaster.xyz/miniapps/
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Example: https://farcaster.xyz/miniapps/your-app-name
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 premium-gradient hover:shadow-2xl text-white h-16 text-xl font-bold shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl border border-white/20 group"
            >
              {isSubmitting ? (
                <>
                  <Circle className="w-6 h-6 mr-3 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Circle className="w-6 h-6 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                  Add to Roulette
                </>
              )}
            </Button>
            
            <Button
              type="button"
              onClick={shareOnFarcaster}
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 text-foreground h-16 px-8 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl backdrop-blur-sm bg-background/50 group"
            >
              <Share2 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              Share
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
