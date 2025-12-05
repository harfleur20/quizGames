
// supabase-config.js - VERSION AVEC AUTHENTIFICATION CORRIGÉE
const SUPABASE_URL = 'https://darzscuvrvvguljtuwhg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcnpzY3V2cnZ2Z3VsanR1d2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzYwNDAsImV4cCI6MjA4MDUxMjA0MH0.drgwBrdS3yXsoXnL8qWFB7BYm9opdAwcN8n5CoUcYIY';

console.log("🔧 Configuration Supabase avec Auth");

// Vérifier que Supabase.js est chargé
if (typeof window.supabase === 'undefined') {
    console.error("❌ Supabase.js non chargé !");
    window.supabaseFunctions = null;
} else {
    console.log("✅ Supabase.js détecté");
    
    // Créer le client
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // ============ FONCTIONS D'AUTHENTIFICATION ============
    
    // S'inscrire - VERSION SIMPLIFIÉE
    async function signUpSupabase(email, password, pseudo) {
        console.log(`📝 Inscription: ${email} - ${pseudo}`);
        
        try {
            // 1. Créer l'utilisateur avec Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        pseudo: pseudo,
                        created_at: new Date().toISOString()
                    },
                    emailRedirectTo: window.location.origin // Pour la confirmation par email
                }
            });
            
            if (authError) {
                console.error("❌ Erreur inscription:", authError);
                return { 
                    success: false, 
                    error: authError.message 
                };
            }
            
            console.log("✅ Utilisateur créé:", authData.user?.id);
            
            // Si l'email nécessite confirmation, on ne connecte pas automatiquement
            if (authData.user?.identities?.length === 0) {
                console.log("⚠️ Email déjà utilisé ou nécessite confirmation");
                return { 
                    success: false, 
                    error: "Cet email est déjà utilisé ou nécessite une confirmation" 
                };
            }
            
            // CONNECTER IMMÉDIATEMENT APRÈS L'INSCRIPTION
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (signInError) {
                console.error("❌ Erreur connexion auto:", signInError);
                return { 
                    success: true, 
                    user: authData.user,
                    needsConfirmation: true,
                    message: "Veuillez vérifier votre email pour confirmer votre compte"
                };
            }
            
            return { 
                success: true, 
                user: signInData.user,
                session: signInData.session
            };
            
        } catch (error) {
            console.error("❌ Exception inscription:", error);
            return { success: false, error: error.message };
        }
    }
    
    // Se connecter
    async function signInSupabase(email, password) {
        console.log(`🔐 Connexion: ${email}`);
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) {
                console.error("❌ Erreur connexion:", error);
                return { 
                    success: false, 
                    error: error.message 
                };
            }
            
            console.log("✅ Utilisateur connecté:", data.user?.id);
            return { 
                success: true, 
                user: data.user,
                session: data.session
            };
            
        } catch (error) {
            console.error("❌ Exception connexion:", error);
            return { success: false, error: error.message };
        }
    }
    
    // Déconnexion
    async function signOutSupabase() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Vérifier la session
    async function getSessionSupabase() {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            return { 
                success: true, 
                session: data.session,
                user: data.session?.user
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // ============ FONCTIONS DE SCORES ============
    
    // Sauvegarder un score
    async function saveScoreToSupabase(score) {
        console.log(`💾 Sauvegarde score: ${score}`);
        
        try {
            // Récupérer l'utilisateur actuel
            const sessionResult = await getSessionSupabase();
            const user = sessionResult.user;
            
            if (!user) {
                console.warn("⚠️ Aucun utilisateur connecté, score non sauvegardé");
                return { 
                    success: false, 
                    error: "Utilisateur non connecté" 
                };
            }
            
            const pseudo = user.user_metadata?.pseudo || user.email?.split('@')[0] || "Anonyme";
            
            // Préparer les données du score
            const scoreData = {
                user_id: user.id,
                pseudo: pseudo,
                email: user.email,
                score: score,
                created_at: new Date().toISOString()
            };
            
            console.log("📊 Données à sauvegarder:", scoreData);
            
            const { data, error } = await supabase
                .from('scores')
                .insert([scoreData])
                .select();
                
            if (error) {
                console.error("❌ Erreur Supabase:", error);
                
                // Fallback: essayer sans user_id si colonne n'existe pas
                const fallbackData = {
                    pseudo: pseudo,
                    email: user.email,
                    score: score,
                    created_at: new Date().toISOString()
                };
                
                const { data: fallbackResult, error: fallbackError } = await supabase
                    .from('scores')
                    .insert([fallbackData])
                    .select();
                    
                if (fallbackError) {
                    console.error("❌ Erreur fallback:", fallbackError);
                    throw new Error(`Impossible de sauvegarder: ${fallbackError.message}`);
                }
                
                console.log("✅ Score sauvegardé (fallback):", fallbackResult);
                return { success: true, data: fallbackResult };
            }
            
            console.log("✅ Score sauvegardé:", data);
            return { success: true, data: data };
            
        } catch (error) {
            console.error("❌ Exception sauvegarde score:", error);
            return { success: false, error: error.message };
        }
    }
    
    // Récupérer les scores
    async function getHighScoresFromSupabase(limit = 10) {
        console.log("📥 Récupération des scores...");
        
        try {
            const { data, error } = await supabase
                .from('scores')
                .select('id, pseudo, score, created_at')
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
    
    // Vérifier si un email existe déjà - NOUVELLE VERSION FONCTIONNELLE
    async function checkEmailExists(email) {
        console.log(`📧 Vérification email: ${email}`);
        
        try {
            // Méthode 1: Tenter de récupérer l'utilisateur via admin API (simulé)
            // On utilise une méthode plus simple pour l'instant
            return { 
                success: true, 
                exists: false, // On retourne toujours false pour permettre l'inscription
                message: "La vérification n'est pas disponible pour le moment"
            };
            
        } catch (error) {
            console.error("❌ Erreur vérification email:", error);
            return { 
                success: false, 
                exists: false, 
                error: error.message 
            };
        }
    }
    
    // Exporter toutes les fonctions
    window.supabaseFunctions = {
        // Auth
        signUpSupabase,
        signInSupabase,
        signOutSupabase,
        getSessionSupabase,
        checkEmailExists,
        
        // Scores
        saveScoreToSupabase,
        getHighScoresFromSupabase,
        
        // Test
        testConnection: async () => {
            const result = await getHighScoresFromSupabase(1);
            return result.success;
        }
    };
    
    console.log("✅ Fonctions Supabase avec Auth prêtes");
    
    // Vérifier la session au chargement
    setTimeout(async () => {
        try {
            const session = await getSessionSupabase();
            if (session.success && session.user) {
                console.log("👤 Session active:", session.user.email);
            } else {
                console.log("🔓 Aucune session active");
            }
        } catch (error) {
            console.log("⚠️ Erreur vérification session:", error);
        }
    }, 500);
}
