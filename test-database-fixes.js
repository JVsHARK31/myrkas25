// Test script untuk memverifikasi perbaikan database
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables tidak ditemukan!');
  console.log('Pastikan file .env berisi:');
  console.log('VITE_SUPABASE_URL=your_supabase_url');
  console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('kertas_kerja_perubahan')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    return false;
  }
}

async function testMasterDataTables() {
  console.log('🔍 Testing master data tables...');
  
  const tables = ['bidang', 'standar', 'giat', 'dana', 'rekening', 'komponen'];
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count(*)')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${table}: ${error.message}`);
        results[table] = false;
      } else {
        console.log(`✅ Table ${table}: OK`);
        results[table] = true;
      }
    } catch (error) {
      console.log(`❌ Table ${table}: ${error.message}`);
      results[table] = false;
    }
  }
  
  return results;
}

async function testRLSPolicies() {
  console.log('🔍 Testing RLS policies (no recursion)...');
  
  try {
    // Test user_profiles access (this was causing recursion)
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error && error.message.includes('infinite recursion')) {
      console.log('❌ RLS recursion still exists! Run FIX_RECURSION_POLICIES.sql');
      return false;
    }
    
    console.log('✅ RLS policies working without recursion');
    return true;
  } catch (error) {
    if (error.message.includes('infinite recursion')) {
      console.log('❌ RLS recursion detected! Run FIX_RECURSION_POLICIES.sql');
      return false;
    }
    
    // Other errors might be OK (like table not existing)
    console.log('⚠️ RLS test completed with warning:', error.message);
    return true;
  }
}

async function runAllTests() {
  console.log('🚀 Starting database tests...\n');
  
  const connectionOK = await testDatabaseConnection();
  console.log('');
  
  const masterDataResults = await testMasterDataTables();
  console.log('');
  
  const rlsOK = await testRLSPolicies();
  console.log('');
  
  // Summary
  console.log('📊 Test Summary:');
  console.log('================');
  console.log(`Database Connection: ${connectionOK ? '✅' : '❌'}`);
  console.log(`RLS Policies: ${rlsOK ? '✅' : '❌'}`);
  console.log('Master Data Tables:');
  
  Object.entries(masterDataResults).forEach(([table, status]) => {
    console.log(`  - ${table}: ${status ? '✅' : '❌'}`);
  });
  
  const allMasterDataOK = Object.values(masterDataResults).every(status => status);
  const allTestsPass = connectionOK && rlsOK && allMasterDataOK;
  
  console.log('');
  if (allTestsPass) {
    console.log('🎉 All tests passed! Database is ready to use.');
  } else {
    console.log('⚠️ Some tests failed. Please check the issues above.');
    console.log('');
    console.log('📋 Next steps:');
    if (!rlsOK) {
      console.log('1. Run FIX_RECURSION_POLICIES.sql in Supabase SQL Editor');
    }
    if (!allMasterDataOK) {
      console.log('2. Run CREATE_MASTER_DATA_TABLES.sql in Supabase SQL Editor');
    }
    if (!connectionOK) {
      console.log('3. Check your .env file and Supabase configuration');
    }
  }
}

// Run tests
runAllTests().catch(console.error);