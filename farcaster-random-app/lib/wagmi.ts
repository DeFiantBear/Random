import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Wagmi configuration for Base network
export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})

// Export types for use in components
export type Config = typeof config 