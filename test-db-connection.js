import { createClient } from '@supabase/supabase-js';

// Use the actual Supabase configuration
const supabaseUrl = 'https://eitaiebffulqhjalotfd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdGFpZWJmZnVscWhqYWxvdGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTQ2MzYsImV4cCI6MjA2OTU5MDYzNn0.S18VdjWf_03qsduqrqHQoAVg0RMmaiLwlJCK8OKFXa8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
       console.log('❌ Error accessing user_profiles:');
       console.log('   Message:', error.message || 'No message');
       console.log('   Details:', error.details || 'No details');
       console.log('   Hint:', error.hint || 'No hint');
       console.log('   Code:', error.code || 'No code');
       console.log('   Full error:', JSON.stringify(error, null, 2));
       
       if (error.message && error.message.includes('infinite recursion')) {
         console.log('🚨 RECURSION ERROR DETECTED! The RLS policies still have recursion issues.');
         return false;
       } else if (error.message && error.message.includes('relation "user_profiles" does not exist')) {
         console.log('⚠️  user_profiles table does not exist yet');
       }
    } else {
      console.log('✅ user_profiles access successful, count:', data || 0);
    }

    // Test other tables
    const tables = ['kertas_kerja_perubahan', 'bidang', 'notifications', 'activities'];
    
    for (const tableName of tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count', { count: 'exact', head: true });
        
        if (error) {
          if (error.message.includes('infinite recursion')) {
            console.log(`🚨 RECURSION ERROR in ${tableName}!`);
          } else if (error.message.includes('does not exist')) {
            console.log(`⚠️  ${tableName}: table does not exist`);
          } else {
            console.log(`❌ ${tableName}: ${error.message}`);
          }
        } else {
          console.log(`✅ ${tableName}: accessible, count = ${data || 0}`);
        }
      } catch (err) {
        console.log(`❌ ${tableName}: exception - ${err.message}`);
      }
    }

    // Test a simple insert to check if policies work
    console.log('\n🔄 Testing basic operations...');
    
    // Try to insert a test record in bidang (if table exists)
    try {
      const { data, error } = await supabase
        .from('bidang')
        .insert([
          { kode: 'TEST', nama: 'Test Bidang', is_active: true }
        ])
        .select();
      
      if (error) {
         console.log('❌ Insert test error:');
         console.log('   Message:', error.message || 'No message');
         console.log('   Details:', error.details || 'No details');
         console.log('   Hint:', error.hint || 'No hint');
         console.log('   Code:', error.code || 'No code');
         
         if (error.message && error.message.includes('infinite recursion')) {
           console.log('🚨 RECURSION ERROR during insert operation!');
         } else {
           console.log('⚠️  Insert test failed (this might be expected if not authenticated)');
         }
      } else {
        console.log('✅ Insert test successful:', data);
        
        // Clean up - delete the test record
        await supabase
          .from('bidang')
          .delete()
          .eq('kode', 'TEST');
        console.log('🧹 Test record cleaned up');
      }
    } catch (err) {
      console.log('❌ Insert test exception:', err.message);
    }

    console.log('\n✅ Database test completed!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testDatabase()
  .then(success => {
    if (success) {
      console.log('\n🎉 Database appears to be working correctly!');
    } else {
      console.log('\n⚠️  Database has some issues that need attention.');
    }
  })
  .catch(console.error);