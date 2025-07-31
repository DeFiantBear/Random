-- Database schema for App Roulette user authentication

-- Create user_logins table to store Farcaster user authentication data
CREATE TABLE IF NOT EXISTS user_logins (
  id SERIAL PRIMARY KEY,
  farcaster_id TEXT NOT NULL UNIQUE,
  wallet_address TEXT NOT NULL,
  login_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on farcaster_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_logins_farcaster_id ON user_logins(farcaster_id);

-- Create index on wallet_address for future airdrop queries
CREATE INDEX IF NOT EXISTS idx_user_logins_wallet_address ON user_logins(wallet_address);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE user_logins ENABLE ROW LEVEL SECURITY;

-- Optional: Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_logins_updated_at 
    BEFORE UPDATE ON user_logins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE user_logins IS 'Stores Farcaster user authentication data for App Roulette';
COMMENT ON COLUMN user_logins.farcaster_id IS 'Farcaster ID (FID) of the user';
COMMENT ON COLUMN user_logins.wallet_address IS 'Primary Ethereum wallet address of the user';
COMMENT ON COLUMN user_logins.login_timestamp IS 'Timestamp of the most recent login';
COMMENT ON COLUMN user_logins.created_at IS 'Timestamp when the user first logged in';
COMMENT ON COLUMN user_logins.updated_at IS 'Timestamp when the record was last updated'; 