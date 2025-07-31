"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shuffle, Plus, ExternalLink, Sparkles, Circle, Share2, Copy, Check, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AddAppForm from "@/components/add-app-form"
import type { FarcasterApp } from "@/types/app"
import { sdk } from '@farcaster/miniapp-sdk'

interface FarcasterUser {
  fid: number
  primaryAddress?: string
  username?: string
}

export default function AppRoulette() {
  const [currentApp, setCurrentApp] = useState<FarcasterApp | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recentlyShown, setRecentlyShown] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showRouletteAnimation, setShowRouletteAnimation] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  
  // Farcaster authentication state
  const [user, setUser] = useState<FarcasterUser | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  
  const { toast } = useToast()

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

      setTimeout(async () => {
        setCurrentApp(randomApp)
        setRecentlyShown((prev) => new Set([...prev, randomApp.app_id]))
        setIsSpinning(false)
        setShowRouletteAnimation(false)

        // Check for airdrop win (1 in 10 chance for testing)
        let isWinner = false
        const randomNumber = Math.floor(Math.random() * 10) + 1
        isWinner = randomNumber === 1
        
        console.log("Airdrop check:", {
          userFid: user?.fid || "Not signed in",
          randomNumber: randomNumber,
          isWinner: isWinner,
          userSignedIn: !!user
        })

        if (isWinner) {
          if (user && user.fid && user.primaryAddress) {
            try {
              // Record the winner in database
              const winnerResponse = await fetch("/api/airdrop/record-winner", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  fid: user.fid,
                  wallet_address: user.primaryAddress,
                  app_discovered: randomApp.name
                }),
              })

              if (winnerResponse.ok) {
                // Show winner celebration
                toast({
                  title: "🎉 JACKPOT! 🎉",
                  description: "You just won 100 CITY tokens! Check your wallet soon!",
                  duration: 10000,
                })
                
                console.log("Winner recorded:", user.fid)
              } else {
                console.error("Failed to record winner")
              }
            } catch (error) {
              console.error("Error recording winner:", error)
            }
          } else {
            // Show winner celebration even without auth (for testing)
            toast({
              title: "🎉 JACKPOT! 🎉",
              description: "You just won 100 CITY tokens! Sign in to claim them!",
              duration: 10000,
            })
            console.log("Winner (not signed in):", randomNumber)
          }
        }

        // Only show normal toast if not a winner
        if (!isWinner) {
          console.log("Showing normal toast for:", randomApp.name)
          toast({
            title: "🎰 Jackpot!",
            description: `Discovered ${randomApp.name}`,
          })
        } else {
          console.log("Skipping normal toast - winner!")
        }

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

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      toast({
        title: "Copied!",
        description: "App URL copied to clipboard",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast({
        title: "Copy Failed",
        description: "Couldn't copy URL. Please try again.",
        variant: "destructive",
      })
    }
  }

  const shareOnFarcaster = async () => {
    if (!currentApp) return

    try {
      const shareText = `🎰 Just discovered "${currentApp.name}" on App Roulette!\n\n${currentApp.description}\n\n🔥 Try this app: ${currentApp.mini_app_url}\n\n🎰 Discover more apps: https://base-app-roulette.vercel.app/`
      
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

  const signInWithFarcaster = async () => {
    try {
      setIsAuthenticating(true)
      
      // Use the authenticated fetch method from the docs
      const res = await sdk.quickAuth.fetch(`${window.location.origin}/api/auth`)
      
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
        toast({
          title: "Welcome!",
          description: `Signed in as FID: ${userData.fid}`,
        })
      } else {
        toast({
          title: "Sign In Failed",
          description: "Couldn't sign in with Farcaster. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error signing in:", error)
      toast({
        title: "Sign In Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAuthenticating(false)
    }
  }

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("Initializing app...")
        
        // Signal that the app is ready
        await sdk.actions.ready()
        console.log("App initialized")
        
        // Try to auto-authenticate if not already signed in
        if (!user) {
          console.log("Attempting auto-authentication...")
          try {
            const res = await sdk.quickAuth.fetch(`${window.location.origin}/api/auth`)
            if (res.ok) {
              const userData = await res.json()
              setUser(userData)
              console.log("Auto-authenticated as FID:", userData.fid)
            }
          } catch (autoAuthError) {
            console.log("Auto-auth failed:", autoAuthError)
          }
        }
      } catch (error) {
        console.error("Error initializing app:", error)
      }
    }

    initializeApp()
  }, [user])

  return (
    <div className="min-h-screen premium-gradient-subtle relative overflow-hidden">
      {/* Premium floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/3 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/2 rounded-full blur-3xl animate-float animation-delay-4000"></div>
      </div>
      
      {/* Subtle Base-style grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230052FF' fill-opacity='1'%3E%3Ccircle cx='40' cy='40' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <nav className="border-b border-border/20 premium-glass sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 animate-glow">
                <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-premium-spin" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  App Roulette
                </span>
                <a 
                  href="https://linktr.ee/2ndCityStudio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  by Second City Studio
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
                             {user ? (
                 <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-background/50 px-3 py-2 rounded-full border border-border/50">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   {user.primaryAddress ? (
                     <span className="font-mono text-xs">
                       {user.primaryAddress.slice(0, 6)}...{user.primaryAddress.slice(-4)}
                     </span>
                   ) : (
                     <span>Connected</span>
                   )}
                 </div>
               ) : (
                <Button
                  onClick={signInWithFarcaster}
                  disabled={isAuthenticating}
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10 text-foreground font-semibold transition-all duration-300 hover:scale-105 rounded-xl px-4 py-2 shadow-lg hover:shadow-xl backdrop-blur-sm bg-background/50"
                >
                  {isAuthenticating ? (
                    <>
                      <Circle className="w-4 h-4 mr-2 animate-spin" />
                      <span className="hidden sm:inline">Signing In...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Sign In</span>
                      <span className="sm:hidden">Sign In</span>
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="premium-gradient hover:shadow-xl text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 h-10 sm:h-12 rounded-xl border border-white/20"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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

        <Card className="border border-border/30 shadow-2xl bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] animate-float">
          <CardContent className="p-8 sm:p-10 relative">
            {showRouletteAnimation ? (
              <div className="py-20 text-center">
                <div className="relative w-32 h-32 mx-auto mb-10">
                  {/* Outer glowing ring */}
                  <div className="absolute inset-0 rounded-full animate-glow bg-primary/20 blur-md"></div>
                  {/* Spinning border */}
                  <div className="absolute inset-2 border-4 border-border/30 border-t-primary rounded-full animate-spin shadow-lg"></div>
                  {/* Inner premium gradient */}
                  <div className="absolute inset-4 premium-gradient rounded-full flex items-center justify-center shadow-xl">
                    <Sparkles className="w-8 h-8 text-white animate-pulse drop-shadow-lg" />
                  </div>
                  {/* Floating particles */}
                  <div className="absolute inset-0 rounded-full">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/60 rounded-full animate-float"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-40px)`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  🎰 Spinning the Roulette...
                </h3>
                <p className="text-muted-foreground text-xl font-medium">
                  Finding your next favorite app...
                </p>
              </div>
            ) : currentApp && !isLoading ? (
              <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
                <div className="text-center">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 premium-gradient rounded-2xl mb-6 shadow-xl animate-float">
                      <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
                      {currentApp.name}
                    </h3>
                    <p className="text-muted-foreground text-xl leading-relaxed max-w-lg mx-auto font-medium">
                      {currentApp.description}
                    </p>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 hover:bg-primary/10 transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-primary font-semibold uppercase tracking-wider">App URL</div>
                      <Button
                        onClick={() => copyToClipboard(currentApp.mini_app_url)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-primary/20 rounded-lg transition-all duration-200"
                      >
                        {isCopied ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-primary hover:text-primary/80" />
                        )}
                      </Button>
                    </div>
                    <code 
                      className="text-sm text-foreground break-all font-mono bg-background/50 px-3 py-2 rounded-lg border border-border/50 cursor-pointer hover:bg-background/70 transition-colors duration-200 block"
                      onClick={() => copyToClipboard(currentApp.mini_app_url)}
                    >
                      {currentApp.mini_app_url}
                    </code>
                  </div>

                                   </div>

                 <div className="flex flex-col gap-4">
                   <Button
                     onClick={getRandomApp}
                     disabled={isLoading}
                     className="premium-gradient hover:shadow-2xl text-white h-14 text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl border border-white/20 group"
                   >
                     <Shuffle className={`w-5 h-5 mr-3 ${isSpinning ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                     Spin Again
                   </Button>
                   
                   <div className="flex flex-col sm:flex-row gap-4">
                     <Button
                       onClick={openMiniApp}
                       variant="outline"
                       className="flex-1 border-primary/30 hover:bg-primary/10 text-foreground h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl backdrop-blur-sm bg-background/50 group"
                     >
                       <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                       Visit App
                     </Button>
                     <Button
                       onClick={shareOnFarcaster}
                       variant="outline"
                       className="flex-1 border-primary/30 hover:bg-primary/10 text-foreground h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl backdrop-blur-sm bg-background/50 group"
                     >
                       <Share2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                       Share on Farcaster
                     </Button>
                   </div>
                 </div>
              </div>
            ) : error ? (
              <div className="py-20 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="relative w-20 h-20 mx-auto mb-8">
                  <div className="absolute inset-0 bg-destructive/20 rounded-full blur-md animate-pulse"></div>
                  <div className="relative w-full h-full bg-destructive/10 rounded-full flex items-center justify-center border border-destructive/20 shadow-lg">
                    <Sparkles className="w-10 h-10 text-destructive drop-shadow-sm" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4 bg-gradient-to-r from-destructive to-destructive/80 bg-clip-text text-transparent">Need More Apps!</h3>
                <p className="text-muted-foreground mb-10 max-w-md mx-auto text-lg font-medium">
                  We need more mini apps! Add your app to help grow the roulette!
                </p>
                <Button
                  onClick={getRandomApp}
                  className="premium-gradient hover:shadow-2xl text-white h-14 px-8 text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl border border-white/20 group"
                >
                  <Shuffle className="w-6 h-6 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                  Spin the Roulette
                </Button>
              </div>
            ) : (
              <div className="py-20 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <h3 className="text-4xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Ready to spin?
                </h3>
                <p className="text-muted-foreground mb-12 text-xl font-medium max-w-md mx-auto">
                  Discover amazing Farcaster mini apps built on Base
                </p>
                
                <Button
                  onClick={getRandomApp}
                  className="premium-gradient hover:shadow-2xl text-white h-16 px-10 text-xl font-bold shadow-xl transition-all duration-300 hover:scale-110 rounded-2xl border border-white/20 group animate-glow"
                >
                  <Shuffle className="w-7 h-7 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                  Spin the Roulette
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
