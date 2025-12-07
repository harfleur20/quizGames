// supabase-config.js - VERSION AVEC TEMPS RÉEL
const SUPABASE_URL = 'https://darzscuvrvvguljtuwhg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcnpzY3V2cnZ2Z3VsanR1d2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzYwNDAsImV4cCI6MjA4MDUxMjA0MH0.drgwBrdS3yXsoXnL8qWFB7BYm9opdAwcN8n5CoUcYIY';

console.log("🔧 Supabase avec temps réel");

if (typeof window.supabase === 'undefined') {
    console.error("❌ Supabase.js non chargé !");
    window.supabaseFunctions = null;
} else {
    console.log("✅ Supabase.js OK");
    
    // Créer le client
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // ============ INSCRIPTION SIMPLE ============
    async function signUpSupabase(email, password, pseudo) {
        console.log(`🚀 INSCRIPTION RÉELLE: ${email} - ${pseudo}`);
        
        try {
            // 1. Créer l'utilisateur dans AUTH
            console.log("📝 Étape 1: Création du compte auth...");
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        pseudo: pseudo,
                        created_at: new Date().toISOString()
                    }
                }
            });
            
            if (authError) {
                console.error("❌ ERREUR AUTH:", authError.message);
                return { 
                    success: false, 
                    error: authError.message.includes("already") 
                        ? "Cet email est déjà utilisé" 
                        : authError.message 
                };
            }
            
            console.log("✅ Compte auth créé, ID:", authData.user?.id);
            
            // 2. AJOUTER À LA TABLE JOUEURS
            console.log("💾 Étape 2: Ajout à la table joueurs...");
            
            const joueurData = {
                user_id: authData.user.id,
                pseudo: pseudo,
                email: email,
                created_at: new Date().toISOString()
            };
            
            console.log("📤 Données joueur:", joueurData);
            
            const { data: joueurResult, error: joueurError } = await supabase
                .from('joueurs')
                .insert([joueurData])
                .select();
            
            if (joueurError) {
                console.error("❌ ERREUR TABLE JOUEURS:", joueurError);
                // On continue quand même
                console.warn("⚠️ Joueur non ajouté à la table, mais compte auth OK");
            } else {
                console.log("✅ Joueur ajouté à la table:", joueurResult);
            }
            
            // 3. Connecter automatiquement
            console.log("🔑 Étape 3: Connexion automatique...");
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (loginError) {
                console.error("❌ ERREUR CONNEXION:", loginError.message);
                return { 
                    success: true, 
                    user: authData.user,
                    message: "Inscription réussie ! Veuillez vous connecter." 
                };
            }
            
            console.log("✅ Connexion automatique réussie");
            
            return { 
                success: true, 
                user: loginData.user,
                session: loginData.session
            };
            
        } catch (error) {
            console.error("💥 ERREUR FATALE inscription:", error);
            return { success: false, error: error.message };
        }
    }

    // ============ CONNEXION ============
    async function signInSupabase(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            return { success: true, user: data.user, session: data.session };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // ============ DÉCONNEXION ============
    async function signOutSupabase() {
        try {
            await supabase.auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // ============ SESSION ============
    async function getSessionSupabase() {
        try {
            const { data } = await supabase.auth.getSession();
            return { 
                success: true, 
                session: data.session,
                user: data.session?.user
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // ============ SAUVEGARDER SCORE ============
    async function saveScoreToSupabase(score, userId, userPseudo, userEmail = '') {
        console.log("💾 UPSERT sécurisé pour user:", userId);
        
        try {
            // 1. D'abord, récupérer l'ancien score
            const { data: oldData, error: fetchError } = await supabase
                .from('scores')
                .select('score, id')
                .eq('user_id', userId)
                .maybeSingle();
            
            const oldScore = oldData?.score || 0;
            let action = 'inserted';
            
            // 2. UPSERT avec la nouvelle approche
            const scoreData = {
                user_id: userId,
                score: Math.max(parseInt(score), oldScore),
                pseudo: userPseudo,
                name: userPseudo,
                email: userEmail || '',
                created_at: new Date().toISOString()
            };
            
            console.log("📤 Données UPSERT:", scoreData);
            
            let resultData;
            
            // 3. Si score existant ET nouveau est meilleur → UPDATE
            if (oldData && score > oldScore) {
                console.log(`🔄 UPDATE: ${oldScore} -> ${score}`);
                
                const { data, error } = await supabase
                    .from('scores')
                    .update({
                        score: score,
                        pseudo: userPseudo,
                        name: userPseudo,
                        email: userEmail || '',
                        created_at: new Date().toISOString()
                    })
                    .eq('user_id', userId)
                    .eq('id', oldData.id)
                    .select();
                
                if (error) throw error;
                
                resultData = data;
                action = 'updated';
                
            } else if (!oldData) {
                // 4. Pas de score existant → INSERT
                console.log("🆕 INSERT: premier score");
                
                const { data, error } = await supabase
                    .from('scores')
                    .insert(scoreData)
                    .select();
                
                if (error) throw error;
                
                resultData = data;
                action = 'inserted';
                
            } else {
                // 5. Ancien score meilleur ou égal → ne rien faire
                console.log(`⏭️ SKIP: ancien score ${oldScore} >= ${score}`);
                action = 'skipped';
                resultData = oldData;
            }
            
            console.log(`✅ ${action.toUpperCase()} réussi:`, resultData);
            
            return {
                success: true,
                data: resultData,
                action: action,
                previousScore: oldScore,
                newScore: score
            };
            
        } catch (error) {
            console.error('💥 Erreur sauvegarde:', error);
            
            return {
                success: false,
                error: error.message,
                action: 'error'
            };
        }
    }
    
    // ============ RÉCUPÉRER LES SCORES ============
    async function getHighScoresFromSupabase(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('scores')
                .select('*')
                .order('score', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            return { success: false, data: [], error: error.message };
        }
    }
    
    // ============ TEMPS RÉEL ============
    async function subscribeToScores(callback) {
        try {
            console.log("🔔 Début de l'abonnement aux scores...");
            
            const subscription = supabase
                .channel('scores-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*', // Écoute INSERT, UPDATE, DELETE
                        schema: 'public',
                        table: 'scores'
                    },
                    (payload) => {
                        console.log('📡 Changement détecté:', payload.eventType);
                        callback(payload);
                    }
                )
                .subscribe((status) => {
                    console.log('📶 Statut subscription:', status);
                });
            
            console.log("✅ Abonnement créé");
            return subscription;
            
        } catch (error) {
            console.error("❌ Erreur subscription:", error);
            return null;
        }
    }
    
    function unsubscribeFromScores(subscription) {
        try {
            if (subscription) {
                supabase.removeChannel(subscription);
                console.log("🔕 Désabonnement réussi");
            }
        } catch (error) {
            console.error("❌ Erreur désabonnement:", error);
        }
    }
    
    // ============ EXPORT ============
    window.supabaseFunctions = {
        signUpSupabase,
        signInSupabase,
        signOutSupabase,
        getSessionSupabase,
        saveScoreToSupabase,
        getHighScoresFromSupabase,
        checkEmailExists: async function(email) {
            return { success: true, exists: false };
        },
        subscribeToScores,
        unsubscribeFromScores
    };
    
    console.log("✅ Prêt à utiliser avec temps réel");
}