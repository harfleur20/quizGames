// test-supabase.js (temporaire)
import { supabase, checkSupabaseConnection } from "./src/lib/supabase.js";

async function testConnection() {
  // Test connexion Supabase (logs supprimés pour propreté)

  // Test 1: Vérifier les variables (résultat non loggé)

  // Test 2: Tester la connexion
  const connected = await checkSupabaseConnection();

  if (connected) {
    // Supabase configuré
  } else {
    // Problème de configuration
  }
}

testConnection();
