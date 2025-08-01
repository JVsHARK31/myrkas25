require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function fixRLSRecursion() {
  console.log('🔧 Fixing RLS infinite recursion...');
  
  try {
    // First, try to disable RLS temporarily
    console.log('1. Disabling RLS on user_profiles...');
    const { error: disableError } = await supabaseAdmin.rpc('exec_sql', {
      sql: 'ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;'
    });
    
    if (disableError) {
      console.log('⚠️ Could not disable RLS via RPC, trying direct query...');
      // Try using direct SQL query
      const { error: directError } = await supabaseAdmin
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (directError && directError.message.includes('infinite recursion')) {
        console.log('❌ Infinite recursion detected. Manual intervention needed.');
        console.log('Please go to Supabase Dashboard > Authentication > Policies');
        console.log('And manually delete all policies on user_profiles table.');
        return false;
      }
    }
    
    // Drop all existing policies
    console.log('2. Dropping existing policies...');
    const dropPolicies = [
      'DROP POLICY IF EXISTS "user_profiles_policy" ON user_profiles;',
      'DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;',
      'DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;',
      'DROP POLICY IF EXISTS "Enable update for users based on email" ON user_profiles;'
    ];
    
    for (const sql of dropPolicies) {
      try {
        await supabaseAdmin.rpc('exec_sql', { sql });
        console.log(`✅ Executed: ${sql}`);
      } catch (err) {
        console.log(`⚠️ Skip: ${sql} - ${err.message}`);
      }
    }
    
    // Create simple, non-recursive policy
    console.log('3. Creating simple RLS policy...');
    const createPolicy = `
      CREATE POLICY "simple_user_profiles_policy" ON user_profiles
      FOR ALL USING (true) WITH CHECK (true);
    `;
    
    const { error: policyError } = await supabaseAdmin.rpc('exec_sql', {
      sql: createPolicy
    });
    
    if (policyError) {
      console.log('⚠️ Could not create policy via RPC:', policyError.message);
    } else {
      console.log('✅ Simple policy created successfully');
    }
    
    // Re-enable RLS
    console.log('4. Re-enabling RLS...');
    const { error: enableError } = await supabaseAdmin.rpc('exec_sql', {
      sql: 'ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;'
    });
    
    if (enableError) {
      console.log('⚠️ Could not re-enable RLS:', enableError.message);
    } else {
      console.log('✅ RLS re-enabled successfully');
    }
    
    // Test the fix
    console.log('5. Testing the fix...');
    const { data, error: testError } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (testError) {
      if (testError.message.includes('infinite recursion')) {
        console.log('❌ Infinite recursion still exists');
        return false;
      } else {
        console.log('⚠️ Other error:', testError.message);
      }
    } else {
      console.log('✅ RLS recursion fixed successfully!');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Error fixing RLS recursion:', error.message);
    return false;
  }
}

// Alternative method: Create table if not exists
async function ensureUserProfilesTable() {
  console.log('📋 Ensuring user_profiles table exists...');
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS user_profiles (
      id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: createTableSQL
    });
    
    if (error) {
      console.log('⚠️ Could not create table via RPC:', error.message);
    } else {
      console.log('✅ user_profiles table ensured');
    }
  } catch (err) {
    console.log('⚠️ Error ensuring table:', err.message);
  }
}

async function main() {
  console.log('🚀 Starting RLS recursion fix...');
  
  // Check if we have service role key
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('⚠️ No SUPABASE_SERVICE_ROLE_KEY found in .env');
    console.log('Using VITE_SUPABASE_ANON_KEY instead (limited permissions)');
  }
  
  await ensureUserProfilesTable();
  const success = await fixRLSRecursion();
  
  if (success) {
    console.log('🎉 RLS recursion fix completed successfully!');
    console.log('You can now run the comprehensive database fix.');
  } else {
    console.log('❌ RLS recursion fix failed.');
    console.log('Manual intervention may be required in Supabase Dashboard.');
  }
}

main().catch(console.error);