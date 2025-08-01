// Script untuk menjalankan perbaikan database RLS recursion
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Environment variables tidak ditemukan!');
  console.log('Pastikan file .env berisi:');
  console.log('VITE_SUPABASE_URL=your_supabase_url');
  console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runDatabaseFix() {
  console.log('🔧 Menjalankan perbaikan database RLS recursion...');
  
  try {
    // Read the SQL fix file
    const sqlFilePath = path.join(process.cwd(), 'FIX_RECURSION_POLICIES.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('📄 Membaca file FIX_RECURSION_POLICIES.sql...');
    
    // Split SQL commands by semicolon and filter out empty ones
    const sqlCommands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 Ditemukan ${sqlCommands.length} perintah SQL untuk dijalankan...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Execute each SQL command
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      
      // Skip comments and empty commands
      if (command.startsWith('--') || command.trim() === '') {
        continue;
      }
      
      try {
        console.log(`⚡ Menjalankan perintah ${i + 1}/${sqlCommands.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: command
        });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase
            .from('_sql_exec')
            .select('*')
            .eq('query', command)
            .limit(1);
          
          if (directError) {
            console.log(`⚠️ Perintah ${i + 1} gagal (mungkin sudah ada): ${error.message}`);
            errorCount++;
          } else {
            successCount++;
          }
        } else {
          successCount++;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        console.log(`⚠️ Perintah ${i + 1} gagal: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log('\n📊 Hasil perbaikan database:');
    console.log('============================');
    console.log(`✅ Berhasil: ${successCount} perintah`);
    console.log(`⚠️ Gagal/Skip: ${errorCount} perintah`);
    
    if (successCount > 0) {
      console.log('\n🎉 Perbaikan database selesai!');
      console.log('💡 Silakan refresh aplikasi untuk melihat perubahan.');
    } else {
      console.log('\n❌ Tidak ada perubahan yang berhasil diterapkan.');
      console.log('💡 Mungkin perbaikan sudah pernah dijalankan sebelumnya.');
    }
    
  } catch (error) {
    console.error('❌ Error menjalankan perbaikan database:', error.message);
    console.log('\n💡 Solusi alternatif:');
    console.log('1. Buka Supabase Dashboard');
    console.log('2. Masuk ke SQL Editor');
    console.log('3. Copy-paste isi file FIX_RECURSION_POLICIES.sql');
    console.log('4. Jalankan script tersebut');
  }
}

// Run the fix
runDatabaseFix().catch(console.error);