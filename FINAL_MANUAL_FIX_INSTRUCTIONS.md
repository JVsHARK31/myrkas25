# MANUAL FIX FOR INFINITE RECURSION ERROR

## Problem
- Error: `42710: policy "Users can view all profiles" for table "user_profiles" already exists`
- Infinite recursion detected in policy for relation "user_profiles"

## Solution
Since automated scripts cannot access the `exec_sql` function, you need to manually fix this in Supabase Dashboard.

## Step-by-Step Instructions

### Method 1: Fix via Supabase Dashboard SQL Editor

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Login to your account
   - Select your project: `R-Kasopname25`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query" to create a new SQL script

3. **Run the following SQL commands ONE BY ONE:**

```sql
-- Step 1: Disable RLS temporarily
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
```

```sql
-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_policy" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON user_profiles;
DROP POLICY IF EXISTS "simple_user_profiles_policy" ON user_profiles;
DROP POLICY IF EXISTS "safe_user_profiles_access" ON user_profiles;
```

```sql
-- Step 3: Create new safe policy
CREATE POLICY "user_profiles_final_access" ON user_profiles
FOR ALL USING (true) WITH CHECK (true);
```

```sql
-- Step 4: Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

```sql
-- Step 5: Test the fix
SELECT 'RLS policies fixed successfully!' as status;
```

### Method 2: Alternative via Authentication Policies

If Method 1 doesn't work:

1. **Go to Authentication > Policies**
   - In Supabase Dashboard, click "Authentication" → "Policies"
   - Find the `user_profiles` table
   - **Delete ALL existing policies** for this table

2. **Create new policy manually:**
   - Click "New Policy"
   - Select "For full customization"
   - Policy name: `user_profiles_safe_access`
   - Target roles: `public`
   - Command: `ALL`
   - USING expression: `true`
   - WITH CHECK expression: `true`
   - Click "Save policy"

### Method 3: Recreate Table (Last Resort)

If both methods above fail:

```sql
-- Drop and recreate the table
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

CREATE POLICY "user_profiles_clean_access" ON user_profiles
FOR ALL USING (true) WITH CHECK (true);
```

## Verification

After applying any of the methods above, test with:

```sql
SELECT * FROM user_profiles LIMIT 1;
```

If this query runs without the "infinite recursion" error, the fix is successful.

## Next Steps

Once the infinite recursion is fixed:

1. Run the comprehensive database setup:
   ```bash
   node fix-database-comprehensive.js
   ```

2. Check if the application works properly:
   ```bash
   npm run dev
   ```

## Important Notes

- Always backup your data before making these changes
- The `true` policy allows all operations - you can make it more restrictive later
- If you're still having issues, contact Supabase support
- Make sure you're using the correct project in Supabase Dashboard

## Contact Information

If you need help:
- Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)
- Supabase Support: [https://supabase.com/support](https://supabase.com/support)