// test-supabase.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function runTest() {
  const { data, error } = await supabase
    .from('Puzzles')
    .select('slug, title');

  if (error) {
    console.error('❌ Supabase query failed:', error.message);
  } else {
    console.log('📦 Available puzzle slugs:');
    console.table(data);
  }
}

runTest();
