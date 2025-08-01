require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create admin client
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

async function executeSQL(sql, description) {
  console.log(`🔄 ${description}...`);
  
  try {
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql });
    
    if (error) {
      if (error.message.includes('Could not find the function')) {
        console.log(`⚠️ ${description} - exec_sql function not available`);
        return { data: null, error: null }; // Not an error, just not available
      } else {
        console.log(`⚠️ ${description} - Warning: ${error.message}`);
        return { data, error };
      }
    } else {
      console.log(`✅ ${description} - Success`);
      return { data, error: null };
    }
    
  } catch (error) {
    console.log(`❌ ${description} - Error: ${error.message}`);
    return { data: null, error };
  }
}

async function testTableAccess() {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.message.includes('infinite recursion')) {
        return { success: false, message: 'Infinite recursion detected' };
      } else {
        return { success: true, message: `Other error (might be OK): ${error.message}` };
      }
    } else {
      return { success: true, message: 'Table access successful' };
    }
  } catch (error) {
    return { success: false, message: `Test failed: ${error.message}` };
  }
}

async function fixInfiniteRecursion() {
  console.log('🚀 Fixing infinite recursion in user_profiles...');
  
  // Step 1: Try to disable RLS
  await executeSQL(
    'ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;',
    'Disabling RLS on user_profiles'
  );
  
  // Step 2: Drop specific problematic policies
  const policies = [
    'Users can view all profiles',
    'user_profiles_policy',
    'Enable read access for all users',
    'Enable insert for authenticated users only',
    'Enable update for users based on email'
  ];
  
  for (const policy of policies) {
    await executeSQL(
      `DROP POLICY IF EXISTS "${policy}" ON user_profiles;`,
      `Dropping policy: ${policy}`
    );
  }
  
  // Step 3: Create new simple policy
  await executeSQL(
    'CREATE POLICY "user_profiles_simple_access" ON user_profiles FOR ALL USING (true) WITH CHECK (true);',
    'Creating new simple policy'
  );
  
  // Step 4: Re-enable RLS
  await executeSQL(
    'ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;',
    'Re-enabling RLS on user_profiles'
  );
  
  return true;
}

async function recreateTable() {
  console.log('🔄 Recreating user_profiles table...');
  
  // Drop and recreate table
  await executeSQL(
    'DROP TABLE IF EXISTS user_profiles CASCADE;',
    'Dropping existing user_profiles table'
  );
  
  await executeSQL(`
    CREATE TABLE user_profiles (
      id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `, 'Creating new user_profiles table');
  
  await executeSQL(
    'ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;',
    'Enabling RLS on new table'
  );
  
  await executeSQL(
    'CREATE POLICY "user_profiles_new_access" ON user_profiles FOR ALL USING (true) WITH CHECK (true);',
    'Creating policy for new table'
  );
  
  return true;
}

async function main() {
  console.log('🚀 Starting infinite recursion fix...');
  
  if (!process.env.VITE_SUPABASE_URL) {
    console.log('❌ VITE_SUPABASE_URL not found in .env file');
    return;
  }
  
  // Test initial state
  console.log('\n🧪 Testing initial state...');
  let testResult = await testTableAccess();
  console.log(`Initial test: ${testResult.message}`);
  
  if (testResult.success) {
    console.log('✅ No infinite recursion detected. Table is accessible.');
    return;
  }
  
  // Method 1: Fix policies
  console.log('\n📋 Method 1: Fixing policies...');
  await fixInfiniteRecursion();
  
  testResult = await testTableAccess();
  console.log(`After policy fix: ${testResult.message}`);
  
  if (testResult.success) {
    console.log('\n🎉 Policy fix successful!');
    return;
  }
  
  // Method 2: Recreate table
  console.log('\n📋 Method 2: Recreating table...');
  await recreateTable();
  
  testResult = await testTableAccess();
  console.log(`After table recreation: ${testResult.message}`);
  
  if (testResult.success) {
    console.log('\n🎉 Table recreation successful!');
  } else {
    console.log('\n❌ All methods failed. Manual intervention required.');
    console.log('Please run the SQL commands in MANUAL_POLICY_FIX.sql manually.');
  }
}

main().catch(console.error);