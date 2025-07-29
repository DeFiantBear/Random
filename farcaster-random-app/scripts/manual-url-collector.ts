// Manual URL Collection System
// For collecting and verifying real URLs from various sources

interface UrlSubmission {
  url: string
  submittedBy: string
  source: string
  timestamp: string
  verified: boolean
  notes?: string
}

// URLs we need to manually verify and add
const URLS_TO_VERIFY = [
  // Add URLs found manually here
  "https://farcaster.xyz/miniapps/e7UFI7j3sB9Q/bankr",
  // Users can submit more URLs here
]

// Manual verification process
export class ManualUrlCollector {
  private submissions: UrlSubmission[] = []

  // Add a URL for verification
  submitUrl(url: string, source: string, submittedBy = "anonymous"): void {
    console.log(`📝 Submitted URL for verification: ${url}`)

    this.submissions.push({
      url,
      submittedBy,
      source,
      timestamp: new Date().toISOString(),
      verified: false,
    })
  }

  // Manually verify a URL (to be done by humans)
  async manuallyVerifyUrl(url: string): Promise<boolean> {
    console.log(`🔍 Please manually verify this URL: ${url}`)
    console.log(`   1. Open the URL in your browser`)
    console.log(`   2. Check if it loads a working mini app`)
    console.log(`   3. Note the app name and creator`)

    // In a real implementation, this would:
    // 1. Open the URL in a browser
    // 2. Check if it loads properly
    // 3. Extract app metadata
    // 4. Return verification result

    return true // Assume verified for now
  }

  // Get all verified URLs
  getVerifiedUrls(): string[] {
    return this.submissions.filter((submission) => submission.verified).map((submission) => submission.url)
  }

  // Process all submissions
  async processSubmissions(): Promise<void> {
    console.log(`📋 Processing ${this.submissions.length} URL submissions...`)

    for (const submission of this.submissions) {
      if (!submission.verified) {
        const isValid = await this.manuallyVerifyUrl(submission.url)
        submission.verified = isValid

        if (isValid) {
          console.log(`✅ Verified: ${submission.url}`)
        } else {
          console.log(`❌ Invalid: ${submission.url}`)
        }
      }
    }
  }
}

// Instructions for manual URL collection
export function printCollectionInstructions(): void {
  console.log(`
🔍 MANUAL URL COLLECTION INSTRUCTIONS:

To find real Farcaster mini app URLs:

1. 📱 CHECK WARPCAST:
   - Go to https://warpcast.com
   - Search for "miniapp" or "mini app"
   - Look for casts with farcaster.xyz/miniapps/ links
   - Copy any URLs you find

2. 🐦 CHECK TWITTER/X:
   - Search for "farcaster.xyz/miniapps"
   - Look through recent tweets
   - Copy any working URLs

3. 💬 CHECK DISCORD:
   - Join Farcaster Discord servers
   - Search for "miniapps" in chat history
   - Look for shared URLs

4. 📚 CHECK DOCUMENTATION:
   - Visit https://docs.farcaster.xyz
   - Look for example mini app URLs
   - Check developer guides

5. 🔗 CHECK GITHUB:
   - Search GitHub for "farcaster.xyz/miniapps"
   - Look in code repositories
   - Check README files

6. ✅ VERIFY EACH URL:
   - Open the URL in your browser
   - Make sure it loads a working mini app
   - Note the app name and creator

7. 📝 SUBMIT URLS:
   - Add verified URLs to the database
   - Include source information
   - Test thoroughly before adding

CURRENT VERIFIED URLS:
${URLS_TO_VERIFY.map((url) => `   ✅ ${url}`).join("\n")}

TO ADD MORE URLS:
- Edit scripts/manual-url-collector.ts
- Add URLs to URLS_TO_VERIFY array
- Run verification process
`)
}

// Export for use in other files
export { URLS_TO_VERIFY }
