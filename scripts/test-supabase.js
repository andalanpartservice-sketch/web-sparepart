const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function check() {
  console.log('Testing Supabase Connection...');
  const { data, error } = await supabase.from('products').select('count', { count: 'exact' });
  if (error) {
    console.log('Table error / does not exist yet:', error.message);
  } else {
    console.log('Products table exists! Row count:', data);
  }
}

check();
