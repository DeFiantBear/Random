"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, RefreshCw, CheckCircle, AlertTriangle, ExternalLink, Code, Users, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SubmissionResponse {
  success: boolean
  message?: string
  error?: string
  submission?: {
    appName: string
    url: string
    status: string
    estimatedReviewTime: string
  }
  nextSteps?: string[]
  example?: string
}

const CATEGORIES = [
  "Gaming",
  "Finance",
  "Art & Creativity",
  "Social",
  "Utilities",
  "Media",
  "Developer Tools",
  "Education",
  "Health & Fitness",
  "Other",
]

export default function MiniAppSubmissionForm() {
  const [formData, setFormData] = useState({
    url: "",
    appName: "",
    description: "",
    creator: "",
    category: "",
    contactInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null)
  const [urlValidation, setUrlValidation] = useState<{ valid: boolean; message: string } | null>(null)
  const { toast } = useToast()

  // Real-time URL validation
  const validateUrl = (url: string) => {
    if (!url) {
      setUrlValidation(null)
      return
    }

    const urlPattern = /^https:\/\/farcaster\.xyz\/miniapps\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/

    if (urlPattern.test(url)) {
      setUrlValidation({
        valid: true,
        message: "✅ Valid Farcaster mini app URL format",
      })
    } else {
      setUrlValidation({
        valid: false,
        message: "❌ Must be: https://farcaster.xyz/miniapps/[ID]/[app-name]",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "url") {
      validateUrl(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!urlValidation?.valid) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Farcaster mini app URL",
        variant: "destructive",
      })
      return
    }

    if (!formData.appName.trim() || !formData.description.trim() || !formData.creator.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setSubmissionResult(null)

    try {
      const response = await fetch("/api/random-app", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data: SubmissionResponse = await response.json()
      setSubmissionResult(data)

      if (data.success) {
        toast({
          title: "Submission Successful! 🎉",
          description: "Your mini app has been submitted for verification",
        })

        // Reset form
        setFormData({
          url: "",
          appName: "",
          description: "",
          creator: "",
          category: "",
          contactInfo: "",
        })
        setUrlValidation(null)
      } else {
        toast({
          title: "Submission Failed",
          description: data.error || "Please check your information and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      })
      setSubmissionResult({
        success: false,
        error: "Network error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const testMiniApp = () => {
    if (formData.url) {
      window.open(formData.url, "_blank")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Submit Your Mini App</CardTitle>
        <p className="text-gray-600 mt-2">Add your Farcaster mini app to our discovery database</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success/Error Display */}
        {submissionResult && (
          <div
            className={`p-4 rounded-lg border ${
              submissionResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start space-x-3">
              {submissionResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${submissionResult.success ? "text-green-900" : "text-red-900"}`}>
                  {submissionResult.success ? "Submission Successful!" : "Submission Failed"}
                </p>
                <p className={`text-sm mt-1 ${submissionResult.success ? "text-green-800" : "text-red-800"}`}>
                  {submissionResult.message || submissionResult.error}
                </p>

                {submissionResult.success && submissionResult.nextSteps && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-green-900 mb-2">Next Steps:</p>
                    <ul className="text-sm text-green-800 space-y-1">
                      {submissionResult.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {submissionResult.example && (
                  <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
                    <strong>Example:</strong> {submissionResult.example}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mini App URL */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium text-gray-700">
              Mini App URL <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="url"
                type="url"
                placeholder="https://farcaster.xyz/miniapps/[ID]/[app-name]"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                className={`pr-10 ${
                  urlValidation?.valid === false
                    ? "border-red-300 focus:border-red-500"
                    : urlValidation?.valid === true
                      ? "border-green-300 focus:border-green-500"
                      : ""
                }`}
                required
              />
              {formData.url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={testMiniApp}
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
            {urlValidation && (
              <p className={`text-sm ${urlValidation.valid ? "text-green-600" : "text-red-600"}`}>
                {urlValidation.message}
              </p>
            )}
            <p className="text-xs text-gray-500">Must be a real, working Farcaster mini app URL</p>
          </div>

          {/* App Name */}
          <div className="space-y-2">
            <Label htmlFor="appName" className="text-sm font-medium text-gray-700">
              App Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="appName"
              placeholder="My Awesome Mini App"
              value={formData.appName}
              onChange={(e) => handleInputChange("appName", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what your mini app does and why users will love it..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              required
            />
            <p className="text-xs text-gray-500">{formData.description.length}/500 characters</p>
          </div>

          {/* Creator */}
          <div className="space-y-2">
            <Label htmlFor="creator" className="text-sm font-medium text-gray-700">
              Creator Username <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="creator"
                placeholder="your-username"
                value={formData.creator}
                onChange={(e) => handleInputChange("creator", e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500">Your Farcaster/Warpcast username (without @)</p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <Label htmlFor="contactInfo" className="text-sm font-medium text-gray-700">
              Contact Info (Optional)
            </Label>
            <Input
              id="contactInfo"
              placeholder="Twitter, Discord, or email for follow-up"
              value={formData.contactInfo}
              onChange={(e) => handleInputChange("contactInfo", e.target.value)}
            />
            <p className="text-xs text-gray-500">How we can reach you if we have questions</p>
          </div>

          {/* Requirements Checklist */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3 flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Submission Requirements
            </h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>URL must start with https://farcaster.xyz/miniapps/</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Mini app must be fully functional and working</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Must be your own creation or you have permission</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>App should provide value to Farcaster users</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !urlValidation?.valid}
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Submit Mini App
              </>
            )}
          </Button>
        </form>

        {/* Additional Info */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Submissions are reviewed within 24-48 hours</p>
          <p className="text-xs text-gray-400 mt-1">
            We'll test your app to ensure it works before adding it to our database
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
