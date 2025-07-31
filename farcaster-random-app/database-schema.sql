-- Database schema for App Roulette

-- Create mini_apps table to store Farcaster mini apps
CREATE TABLE IF NOT EXISTS mini_apps (
  id SERIAL PRIMARY KEY,
  app_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  mini_app_url TEXT NOT NULL UNIQUE,
  creator TEXT DEFAULT 'unknown',
  category TEXT DEFAULT 'Other',
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create airdrop_winners table for tracking random winners
CREATE TABLE IF NOT EXISTS airdrop_winners (
  id SERIAL PRIMARY KEY,
  fid INTEGER NOT NULL,
  wallet_address TEXT NOT NULL,
  won_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  app_discovered TEXT, -- Which app they were viewing when they won
  status TEXT DEFAULT 'pending', -- pending, sent, failed
  transaction_hash TEXT, -- You'll add this when you send tokens manually
  notes TEXT, -- For your manual notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mini_apps_app_id ON mini_apps(app_id);
CREATE INDEX IF NOT EXISTS idx_mini_apps_url ON mini_apps(mini_app_url);
CREATE INDEX IF NOT EXISTS idx_mini_apps_added_at ON mini_apps(added_at);

-- Create indexes for airdrop_winners
CREATE INDEX IF NOT EXISTS idx_airdrop_winners_fid ON airdrop_winners(fid);
CREATE INDEX IF NOT EXISTS idx_airdrop_winners_status ON airdrop_winners(status);
CREATE INDEX IF NOT EXISTS idx_airdrop_winners_won_at ON airdrop_winners(won_at);

-- Optional: Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_mini_apps_updated_at 
    BEFORE UPDATE ON mini_apps 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE mini_apps IS 'Stores Farcaster mini apps for the App Roulette';
COMMENT ON COLUMN mini_apps.app_id IS 'Unique identifier for the mini app';
COMMENT ON COLUMN mini_apps.name IS 'Display name of the mini app';
COMMENT ON COLUMN mini_apps.description IS 'Description of the mini app';
COMMENT ON COLUMN mini_apps.mini_app_url IS 'URL to the Farcaster mini app';
COMMENT ON COLUMN mini_apps.creator IS 'Creator of the mini app';
COMMENT ON COLUMN mini_apps.category IS 'Category of the mini app';
COMMENT ON COLUMN mini_apps.added_at IS 'Timestamp when the app was added';
COMMENT ON COLUMN mini_apps.updated_at IS 'Timestamp when the record was last updated';

-- Comments for airdrop_winners table
COMMENT ON TABLE airdrop_winners IS 'Tracks random airdrop winners (1 in 1000 chance)';
COMMENT ON COLUMN airdrop_winners.fid IS 'Farcaster ID of the winner';
COMMENT ON COLUMN airdrop_winners.wallet_address IS 'Wallet address to send tokens to';
COMMENT ON COLUMN airdrop_winners.won_at IS 'Timestamp when they won';
COMMENT ON COLUMN airdrop_winners.app_discovered IS 'Which app they were viewing when they won';
COMMENT ON COLUMN airdrop_winners.status IS 'Status: pending, sent, failed';
COMMENT ON COLUMN airdrop_winners.transaction_hash IS 'Transaction hash when tokens are sent';
COMMENT ON COLUMN airdrop_winners.notes IS 'Manual notes for processing'; 