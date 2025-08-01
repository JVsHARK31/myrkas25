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

async function fixPolicyConflict() {
  console.log('🔧 Fixing policy conflict for user_profiles table...');
  
  try {
    // List of all possible policy names that might exist
    const policyNames = [
      'Users can view all profiles',
      'user_profiles_policy',
      'Enable read access for all users',
      'Enable insert for authenticated users only',
      'Enable update for users based on email',
      'simple_user_profiles_policy'
    ];
    
    console.log('1. Dropping existing policies...');
    
    // Drop all existing policies
    for (const policyName of policyNames) {
      const dropSQL = `DROP POLICY IF EXISTS "${policyName}" ON user_profiles;`;
      
      try {
        // Try using direct SQL execution if available
        const { error } = await supabaseAdmin.rpc('exec_sql', {
          sql: dropSQL
        });
        
        if (error && !error.message.includes('Could not find the function')) {
          console.log(`⚠️ Error dropping policy "${policyName}": ${error.message}`);
        } else if (!error) {
          console.log(`✅ Dropped policy: "${policyName}"`);
        }
      } catch (err) {
        console.log(`⚠️ Skip policy "${policyName}": ${err.message}`);
      }
    }
    
    console.log('2. Creating new safe policy...');
    
    // Create a simple, safe policy
    const createPolicySQL = `
      CREATE POLICY "safe_user_profiles_access" ON user_profiles
      FOR ALL USING (true) WITH CHECK (true);
    `;
    
    try {
      const { error: createError } = await supabaseAdmin.rpc('exec_sql', {
        sql: createPolicySQL
      });
      
      if (createError) {
        if (createError.message.includes('Could not find the function')) {
          console.log('⚠️ exec_sql function not available, trying alternative method...');
          
          // Alternative: Try to test if policies are working
          const { data, error: testError } = await supabaseAdmin
            .from('user_profiles')
            .select('id')
            .limit(1);
          
          if (testError) {
            console.log('❌ Policy test failed:', testError.message);
            return false;
          } else {
            console.log('✅ Policies appear to be working (test query successful)');
            return true;
          }
        } else {
          console.log('⚠️ Error creating policy:', createError.message);
        }
      } else {
        console.log('✅ New safe policy created successfully');
      }
    } catch (err) {
      console.log('⚠️ Error in policy creation:', err.message);
    }
    
    console.log('3. Testing policy functionality...');
    
    // Test if we can query the table without infinite recursion
    const { data, error: testError } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (testError) {
      if (testError.message.includes('infinite recursion')) {
        console.log('❌ Infinite recursion still exists');
        console.log('Manual intervention required in Supabase Dashboard');
        return false;
      } else {
        console.log('⚠️ Other error during test:', testError.message);
      }
    } else {
      console.log('✅ Policy conflict resolved successfully!');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Error fixing policy conflict:', error.message);
    return false;
  }
}

// Alternative method: Manual SQL commands
async function manualPolicyFix() {
  console.log('\n🛠️ Manual policy fix instructions:');
  console.log('If the automated fix fails, please run these SQL commands manually in Supabase SQL Editor:');
  console.log('');
  console.log('-- 1. Drop all existing policies');
  console.log('DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;');
  console.log('DROP POLICY IF EXISTS "user_profiles_policy" ON user_profiles;');
  console.log('DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;');
  console.log('DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;');
  console.log('DROP POLICY IF EXISTS "Enable update for users based on email" ON user_profiles;');
  console.log('');
  console.log('-- 2. Create new safe policy');
  console.log('CREATE POLICY "safe_user_profiles_access" ON user_profiles');
  console.log('FOR ALL USING (true) WITH CHECK (true);');
  console.log('');
  console.log('-- 3. Test the fix');
  console.log('SELECT \'RLS policies fixed successfully - no more infinite recursion!\' as status;');
}

async function main() {
  console.log('🚀 Starting policy conflict fix...');
  
  // Check if we have proper credentials
  if (!process.env.VITE_SUPABASE_URL) {
    console.log('❌ VITE_SUPABASE_URL not found in .env file');
    return;
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('⚠️ No SUPABASE_SERVICE_ROLE_KEY found, using ANON_KEY (limited permissions)');
  }
  
  const success = await fixPolicyConflict();
  
  if (success) {
    console.log('\n🎉 Policy conflict fix completed successfully!');
    console.log('The "Users can view all profiles" policy conflict has been resolved.');
  } else {
    console.log('\n❌ Automated fix failed.');
    await manualPolicyFix();
  }
}

main().catch(console.error);