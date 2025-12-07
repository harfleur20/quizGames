// test-supabase.js (temporaire)
import { supabase, checkSupabaseConnection } from './src/lib/supabase.js'

async function testConnection() {
  console.log('🧪 Test connexion Supabase...')
  
  // Test 1: Vérifier les variables
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌')
  console.log('Clé:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌')
  
  // Test 2: Tester la connexion
  const connected = await checkSupabaseConnection()
  
  if (connected) {
    console.log('🎉 Supabase configuré avec succès!')
  } else {
    console.log('⚠️ Problème de configuration, vérifiez vos clés')
  }
}

testConnection()