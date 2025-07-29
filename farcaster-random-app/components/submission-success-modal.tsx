"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, ExternalLink, Clock } from "lucide-react"

interface SubmissionSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  submission: {
    appName: string
    url: string
    status: string
    estimatedReviewTime: string
  }
  nextSteps: string[]
}

export default function SubmissionSuccessModal({
  isOpen,
  onClose,
  submission,
  nextSteps,
}: SubmissionSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">Submission Successful! 🎉</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Submission Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">{submission.appName}</h4>
            <p className="text-sm text-green-800 break-all mb-2">{submission.url}</p>
            <div className="flex items-center justify-between text-xs text-green-700">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Review: {submission.estimatedReviewTime}
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                {submission.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">What happens next:</h4>
            <ul className="space-y-2">
              {nextSteps.map((step, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="text-green-600 mr-2 mt-0.5">•</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={() => window.open(submission.url, "_blank")}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Test Your App
            </Button>
            <Button onClick={onClose} className="flex-1 bg-green-600 hover:bg-green-700" size="sm">
              Done
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">Questions? Contact us with your submission details</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
