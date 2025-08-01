const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function clearTodaysWins() {
  const today = new Date().toISOString().split('T')[0]
  
  console.log('Clearing wins for today:', today)
  
  const { data, error } = await supabase
    .from('airdrop_winners')
    .delete()
    .gte('won_at', today)
  
  if (error) {
    console.error('Error clearing wins:', error)
  } else {
    console.log('Successfully cleared wins for today')
    console.log('Deleted records:', data)
  }
}

clearTodaysWins() 