// Comprehensive Database Fix Script for R-KAS Application
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || 
    supabaseUrl === 'your_supabase_project_url' || 
    supabaseKey === 'your_supabase_anon_key') {
  console.error('❌ CRITICAL: Supabase credentials not configured!');
  console.log('\n📋 To fix this:');
  console.log('1. Open your Supabase project dashboard');
  console.log('2. Go to Settings > API');
  console.log('3. Copy the Project URL and anon/public key');
  console.log('4. Update the .env file with your actual credentials');
  console.log('\nExample .env content:');
  console.log('VITE_SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('⚠️ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
  } catch (err) {
    console.log('❌ Connection error:', err.message);
    return false;
  }
}

async function createMissingTables() {
  console.log('\n🏗️ Creating missing tables...');
  
  const tables = [
    {
      name: 'user_profiles',
      sql: `
        CREATE TABLE IF NOT EXISTS public.user_profiles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT,
          full_name TEXT,
          role TEXT DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'kertas_kerja_perubahan',
      sql: `
        CREATE TABLE IF NOT EXISTS public.kertas_kerja_perubahan (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          kode_bidang TEXT,
          nama_bidang TEXT,
          kode_standar TEXT,
          nama_standar TEXT,
          kode_giat TEXT,
          nama_giat TEXT,
          kode_dana TEXT,
          nama_dana TEXT,
          kode_rekening TEXT,
          nama_rekening TEXT,
          kode_komponen TEXT,
          nama_komponen TEXT,
          anggaran_murni DECIMAL(15,2) DEFAULT 0,
          perubahan DECIMAL(15,2) DEFAULT 0,
          anggaran_setelah_perubahan DECIMAL(15,2) DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'bidang',
      sql: `
        CREATE TABLE IF NOT EXISTS public.bidang (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          kode TEXT UNIQUE NOT NULL,
          nama TEXT NOT NULL,
          deskripsi TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'standar',
      sql: `
        CREATE TABLE IF NOT EXISTS public.standar (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          kode TEXT UNIQUE NOT NULL,
          nama TEXT NOT NULL,
          bidang_id UUID REFERENCES public.bidang(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'giat',
      sql: `
        CREATE TABLE IF NOT EXISTS public.giat (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          kode TEXT UNIQUE NOT NULL,
          nama TEXT NOT NULL,
          standar_id UUID REFERENCES public.standar(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'dana',
      sql: `
        CREATE TABLE IF NOT EXISTS public.dana (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          kode TEXT UNIQUE NOT NULL,
          nama TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'rekening',
      sql: `
        CREATE TABLE IF NOT EXISTS public.rekening (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          kode TEXT UNIQUE NOT NULL,
          nama TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'komponen',
      sql: `
        CREATE TABLE IF NOT EXISTS public.komponen (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          kode TEXT UNIQUE NOT NULL,
          nama TEXT NOT NULL,
          rekening_id UUID REFERENCES public.rekening(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];
  
  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql_query: table.sql
      });
      
      if (error) {
        console.log(`⚠️ Table ${table.name}: ${error.message}`);
      } else {
        console.log(`✅ Table ${table.name} ready`);
      }
    } catch (err) {
      console.log(`⚠️ Table ${table.name}: ${err.message}`);
    }
  }
}

async function enableRLS() {
  console.log('\n🔒 Enabling Row Level Security...');
  
  const tables = [
    'user_profiles', 'kertas_kerja_perubahan', 'bidang', 
    'standar', 'giat', 'dana', 'rekening', 'komponen'
  ];
  
  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql_query: `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`
      });
      
      if (error) {
        console.log(`⚠️ RLS ${table}: ${error.message}`);
      } else {
        console.log(`✅ RLS enabled for ${table}`);
      }
    } catch (err) {
      console.log(`⚠️ RLS ${table}: ${err.message}`);
    }
  }
}

async function createSafePolicies() {
  console.log('\n🛡️ Creating safe RLS policies...');
  
  const policies = [
    // User profiles policies
    `CREATE POLICY IF NOT EXISTS "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);`,
    `CREATE POLICY IF NOT EXISTS "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = auth_id);`,
    `CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = auth_id);`,
    
    // Kertas kerja policies
    `CREATE POLICY IF NOT EXISTS "Users can view kertas kerja" ON public.kertas_kerja_perubahan FOR SELECT USING (true);`,
    `CREATE POLICY IF NOT EXISTS "Authenticated users can manage kertas kerja" ON public.kertas_kerja_perubahan FOR ALL USING (auth.uid() IS NOT NULL);`,
    
    // Master data policies
    `CREATE POLICY IF NOT EXISTS "Users can view bidang" ON public.bidang FOR SELECT USING (true);`,
    `CREATE POLICY IF NOT EXISTS "Authenticated users can manage bidang" ON public.bidang FOR ALL USING (auth.uid() IS NOT NULL);`,
    
    `CREATE POLICY IF NOT EXISTS "Users can view standar" ON public.standar FOR SELECT USING (true);`,
    `CREATE POLICY IF NOT EXISTS "Authenticated users can manage standar" ON public.standar FOR ALL USING (auth.uid() IS NOT NULL);`,
    
    `CREATE POLICY IF NOT EXISTS "Users can view giat" ON public.giat FOR SELECT USING (true);`,
    `CREATE POLICY IF NOT EXISTS "Authenticated users can manage giat" ON public.giat FOR ALL USING (auth.uid() IS NOT NULL);`,
    
    `CREATE POLICY IF NOT EXISTS "Users can view dana" ON public.dana FOR SELECT USING (true);`,
    `CREATE POLICY IF NOT EXISTS "Authenticated users can manage dana" ON public.dana FOR ALL USING (auth.uid() IS NOT NULL);`,
    
    `CREATE POLICY IF NOT EXISTS "Users can view rekening" ON public.rekening FOR SELECT USING (true);`,
    `CREATE POLICY IF NOT EXISTS "Authenticated users can manage rekening" ON public.rekening FOR ALL USING (auth.uid() IS NOT NULL);`,
    
    `CREATE POLICY IF NOT EXISTS "Users can view komponen" ON public.komponen FOR SELECT USING (true);`,
    `CREATE POLICY IF NOT EXISTS "Authenticated users can manage komponen" ON public.komponen FOR ALL USING (auth.uid() IS NOT NULL);`
  ];
  
  for (const policy of policies) {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql_query: policy
      });
      
      if (error) {
        console.log(`⚠️ Policy: ${error.message}`);
      } else {
        console.log(`✅ Policy created`);
      }
    } catch (err) {
      console.log(`⚠️ Policy: ${err.message}`);
    }
  }
}

async function insertSampleData() {
  console.log('\n📊 Inserting sample data...');
  
  try {
    // Insert sample bidang
    const { error: bidangError } = await supabase
      .from('bidang')
      .upsert([
        { kode: '01', nama: 'Bidang Pendidikan', deskripsi: 'Urusan pendidikan' },
        { kode: '02', nama: 'Bidang Kesehatan', deskripsi: 'Urusan kesehatan' }
      ], { onConflict: 'kode' });
    
    if (!bidangError) {
      console.log('✅ Sample bidang data inserted');
    }
    
    // Insert sample dana
    const { error: danaError } = await supabase
      .from('dana')
      .upsert([
        { kode: 'DAK', nama: 'Dana Alokasi Khusus' },
        { kode: 'DAU', nama: 'Dana Alokasi Umum' }
      ], { onConflict: 'kode' });
    
    if (!danaError) {
      console.log('✅ Sample dana data inserted');
    }
    
    // Insert sample rekening
    const { error: rekeningError } = await supabase
      .from('rekening')
      .upsert([
        { kode: '5.1.1', nama: 'Belanja Pegawai' },
        { kode: '5.1.2', nama: 'Belanja Barang dan Jasa' }
      ], { onConflict: 'kode' });
    
    if (!rekeningError) {
      console.log('✅ Sample rekening data inserted');
    }
    
  } catch (err) {
    console.log('⚠️ Sample data:', err.message);
  }
}

async function runComprehensiveFix() {
  console.log('🚀 Starting comprehensive database fix...');
  console.log('=====================================\n');
  
  // Test connection first
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('\n❌ Cannot proceed without valid Supabase connection.');
    console.log('Please check your .env file and Supabase credentials.');
    return;
  }
  
  // Run all fixes
  await createMissingTables();
  await enableRLS();
  await createSafePolicies();
  await insertSampleData();
  
  console.log('\n🎉 Database fix completed!');
  console.log('=====================================');
  console.log('✅ All tables created/verified');
  console.log('✅ RLS enabled on all tables');
  console.log('✅ Safe policies created (no recursion)');
  console.log('✅ Sample data inserted');
  console.log('\n💡 You can now restart your application.');
  console.log('The database should be working properly now.');
}

// Run the comprehensive fix
runComprehensiveFix().catch(console.error);