# Environment Variables Setup

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Airdrop Configuration
# IMPORTANT: Keep your private key secure and never commit it to version control
AIRDROP_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Base Network Configuration
BASE_RPC_URL=https://mainnet.base.org

# Optional: Your airdrop wallet address (for monitoring)
AIRDROP_WALLET_ADDRESS=0x1234567890123456789012345678901234567890

# Optional: WalletConnect Project ID (if using WalletConnect)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

## Security Notes

1. **Never commit your private key** to version control
2. **Use a dedicated airdrop wallet** - don't use your main wallet
3. **Start with small amounts** for testing
4. **Keep your private key secure** - store it safely
5. **Monitor all transactions** during testing

## Getting Your Private Key

1. Create a new MetaMask wallet for airdrops
2. Export the private key (Account Details > Export Private Key)
3. Copy the private key (without the "0x" prefix)
4. Add it to your `.env.local` file as `AIRDROP_PRIVATE_KEY=0x[your_private_key]`

## Testing Setup

1. Send 500 $CITY tokens to your airdrop wallet
2. Make sure you have some ETH for gas fees
3. Test with small amounts first
4. Monitor transactions on Base scan 