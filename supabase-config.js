// supabase-config.js - VERSION CORRIGÉE
const SUPABASE_URL = 'https://darzscuvrvvguljtuwhg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcnpzY3V2cnZ2Z3VsanR1d2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzYwNDAsImV4cCI6MjA4MDUxMjA0MH0.drgwBrdS3yXsoXnL8qWFB7BYm9opdAwcN8n5CoUcYIY';

console.log("🔧 Configuration Supabase");

// Vérifier que Supabase.js est chargé
if (typeof window.supabase === 'undefined') {
    console.error("❌ Supabase.js non chargé !");
    window.supabaseFunctions = null;
} else {
    console.log("✅ Supabase.js détecté");
    
    // Créer le client
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Sauvegarder un score
    async function saveScoreToSupabase(name, score) {
        console.log(`💾 Envoi à Supabase: ${name} - ${score}`);
        
        try {
            const { data, error } = await supabase
                .from('scores')
                .insert([{ 
                    name: name, 
                    score: score 
                }])
                .select();
                
            if (error) {
                console.error("❌ Erreur Supabase:", error);
                return { 
                    success: false, 
                    error: `Erreur ${error.code}: ${error.message}` 
                };
            }
            
            console.log("✅ Réponse Supabase:", data);
            return { success: true, data: data };
            
        } catch (error) {
            console.error("❌ Exception:", error);
            return { success: false, error: error.message };
        }
    }
    
    // Récupérer les scores - CORRIGÉ : pas de created_at
    async function getHighScoresFromSupabase(limit = 10) {
        console.log("📥 Récupération des scores...");
        
        try {
            const { data, error } = await supabase
                .from('scores')
                .select('id, name, score, date')  // ← SEULEMENT ces colonnes
                .order('score', { ascending: false })
                .limit(limit);
                
            if (error) {
                console.error("❌ Erreur Supabase:", error);
                return { 
                    success: false, 
                    data: [], 
                    error: `Erreur ${error.code}: ${error.message}` 
                };
            }
            
            console.log(`✅ ${data?.length || 0} scores récupérés`);
            return { success: true, data: data || [] };
            
        } catch (error) {
            console.error("❌ Exception:", error);
            return { success: false, data: [], error: error.message };
        }
    }
    
    // Exporter les fonctions
    window.supabaseFunctions = {
        saveScoreToSupabase,
        getHighScoresFromSupabase,
        testConnection: async () => {
            const result = await getHighScoresFromSupabase(1);
            return result.success;
        }
    };
    
    console.log("✅ Fonctions Supabase prêtes");
}

// Test de connexion automatique
setTimeout(async () => {
    if (window.supabaseFunctions && window.supabaseFunctions.testConnection) {
        try {
            const connected = await window.supabaseFunctions.testConnection();
            console.log(connected ? "✅ Connecté à Supabase" : "❌ Non connecté à Supabase");
        } catch {
            console.log("📱 Test de connexion échoué");
        }
    }
}, 1000);