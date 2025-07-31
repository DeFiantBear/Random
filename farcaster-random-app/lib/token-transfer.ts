import { createWalletClient, http, parseEther, createPublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'wagmi/chains'
import { CITY_TOKEN_ADDRESS, ERC20_ABI, TOKENS_PER_CLAIM } from './contracts'

// Create public client for reading from blockchain
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
})

// Create wallet client for signing transactions
const createAirdropWalletClient = (privateKey: string) => {
  const account = privateKeyToAccount(privateKey as `0x${string}`)
  
  return createWalletClient({
    account,
    chain: base,
    transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
  })
}

export interface TransferResult {
  success: boolean
  transactionHash?: string
  error?: string
  gasUsed?: bigint
}

/**
 * Transfer $CITY tokens to a user's wallet
 * @param toAddress - The recipient's wallet address
 * @param amount - Amount of tokens to transfer (in wei)
 * @returns TransferResult with transaction details
 */
export async function transferCityTokens(
  toAddress: string,
  amount: bigint = parseEther(TOKENS_PER_CLAIM.toString())
): Promise<TransferResult> {
  try {
    // Validate inputs
    if (!process.env.AIRDROP_PRIVATE_KEY) {
      throw new Error('AIRDROP_PRIVATE_KEY environment variable not set')
    }

    if (!toAddress || !toAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error('Invalid recipient address')
    }

    // Create wallet client
    const walletClient = createAirdropWalletClient(process.env.AIRDROP_PRIVATE_KEY)
    const account = privateKeyToAccount(process.env.AIRDROP_PRIVATE_KEY as `0x${string}`)

    // Check airdrop wallet balance
    const balance = await publicClient.readContract({
      address: CITY_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [account.address],
    })

    if (balance < amount) {
      throw new Error(`Insufficient balance. Have: ${balance}, Need: ${amount}`)
    }

    // Estimate gas for the transfer
    const gasEstimate = await publicClient.estimateContractGas({
      address: CITY_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [toAddress, amount],
      account: account.address,
    })

    // Execute the transfer
    const hash = await walletClient.writeContract({
      address: CITY_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [toAddress, amount],
      gas: gasEstimate,
    })

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    return {
      success: true,
      transactionHash: hash,
      gasUsed: receipt.gasUsed,
    }

  } catch (error) {
    console.error('Token transfer error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Check the balance of the airdrop wallet
 */
export async function getAirdropWalletBalance(): Promise<bigint> {
  try {
    if (!process.env.AIRDROP_PRIVATE_KEY) {
      throw new Error('AIRDROP_PRIVATE_KEY environment variable not set')
    }

    const account = privateKeyToAccount(process.env.AIRDROP_PRIVATE_KEY as `0x${string}`)
    
    const balance = await publicClient.readContract({
      address: CITY_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [account.address],
    })

    return balance
  } catch (error) {
    console.error('Error getting airdrop wallet balance:', error)
    throw error
  }
}

/**
 * Get the airdrop wallet address
 */
export function getAirdropWalletAddress(): string {
  if (!process.env.AIRDROP_PRIVATE_KEY) {
    throw new Error('AIRDROP_PRIVATE_KEY environment variable not set')
  }

  const account = privateKeyToAccount(process.env.AIRDROP_PRIVATE_KEY as `0x${string}`)
  return account.address
} 