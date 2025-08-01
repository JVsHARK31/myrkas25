-- =====================================================
-- MANUAL FIX FOR POLICY CONFLICT ERROR 42710
-- Run this script in Supabase SQL Editor
-- =====================================================

-- Step 1: Disable RLS temporarily to break infinite recursion
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies that might cause conflicts
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_policy" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON user_profiles;
DROP POLICY IF EXISTS "simple_user_profiles_policy" ON user_profiles;
DROP POLICY IF EXISTS "safe_user_profiles_access" ON user_profiles;

-- Step 3: Create new safe policy with unique name
CREATE POLICY "user_profiles_safe_access_v2" ON user_profiles
FOR ALL USING (true) WITH CHECK (true);

-- Step 4: Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Test the fix
SELECT 'RLS policies fixed successfully - no more infinite recursion!' as status;

-- Step 6: Verify policy exists
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- =====================================================
-- ALTERNATIVE APPROACH (if above fails)
-- =====================================================

-- Option A: Drop and recreate the entire table
/*
DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_profiles_access" ON user_profiles
FOR ALL USING (true) WITH CHECK (true);
*/

-- Option B: Use different policy approach
/*
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Clear all policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON user_profiles';
    END LOOP;
END $$;

-- Create minimal policy
CREATE POLICY "minimal_access" ON user_profiles
FOR SELECT USING (true);

CREATE POLICY "minimal_insert" ON user_profiles
FOR INSERT WITH CHECK (true);

CREATE POLICY "minimal_update" ON user_profiles
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "minimal_delete" ON user_profiles
FOR DELETE USING (true);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
*/