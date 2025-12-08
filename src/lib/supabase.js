// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

// IMPORTANT : Récupérez ces valeurs depuis le dashboard Supabase
// 1. Allez sur https://supabase.com/dashboard
// 2. Sélectionnez votre projet
// 3. Allez dans Settings > API
// 4. Copiez "Project URL" et "anon public"

// Pour développement local, créez un fichier .env.local :
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://darzscuvrvvguljtuwhg.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcnpzY3V2cnZ2Z3VsanR1d2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzYwNDAsImV4cCI6MjA4MDUxMjA0MH0.drgwBrdS3yXsoXnL8qWFB7BYm9opdAwcN8n5CoUcYIY";

// Vérifiez que les variables sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ ERREUR: Variables Supabase non définies!");
  console.error("Ajoutez dans .env.local:");
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL=https://darzscuvrvvguljtuwhg.supabase.co"
  );
  console.error(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcnpzY3V2cnZ2Z3VsanR1d2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzYwNDAsImV4cCI6MjA4MDUxMjA0MH0.drgwBrdS3yXsoXnL8qWFB7BYm9opdAwcN8n5CoUcYIY"
  );
}

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Optionnel: Fonction pour vérifier la connexion
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("joueurs")
      .select("count")
      .limit(1);
    if (error) throw error;

    return true;
  } catch (error) {
    console.error("❌ Erreur connexion Supabase:", error.message);
    return false;
  }
};

// Exporter par défaut aussi si besoin
export default supabase;
