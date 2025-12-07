
// supabase-config.js - VERSION ULTRA SIMPLE
const SUPABASE_URL = 'https://darzscuvrvvguljtuwhg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcnpzY3V2cnZ2Z3VsanR1d2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzYwNDAsImV4cCI6MjA4MDUxMjA0MH0.drgwBrdS3yXsoXnL8qWFB7BYm9opdAwcN8n5CoUcYIY';

console.log("🔧 Supabase simple");

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
        
        // 2. AJOUTER À LA TABLE JOUEURS (LE PLUS IMPORTANT !)
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
            console.error("❌ ERREUR TABLE JOUEURS:", {
                message: joueurError.message,
                code: joueurError.code,
                details: joueurError.details
            });
            
            // Si c'est une erreur d'unicité, l'email existe déjà
            if (joueurError.code === '23505') {
                return { 
                    success: false, 
                    error: "Cet email est déjà utilisé par un autre joueur" 
                };
            }
            
            // Sinon, on continue quand même (le compte auth est créé)
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
        
        // 4. VÉRIFICATION FINALE
        console.log("🔍 Étape 4: Vérification...");
        const { data: verification } = await supabase
            .from('joueurs')
            .select('*')
            .eq('email', email)
            .single();
        
        if (verification) {
            console.log("🎯 VÉRIFICATION: Joueur trouvé dans la base!");
        } else {
            console.warn("⚠️ VÉRIFICATION: Joueur NON trouvé dans la base");
        }
        
        return { 
            success: true, 
            user: loginData.user,
            session: loginData.session,
            inDatabase: !!verification
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
            .maybeSingle(); // .single() si vous avez la contrainte UNIQUE
        
        const oldScore = oldData?.score || 0;
        let action = 'inserted';
        
        // 2. UPSERT avec la nouvelle approche
        const scoreData = {
            user_id: userId,
            score: Math.max(parseInt(score), oldScore), // Garde toujours le meilleur
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
                .eq('user_id', userId)  // Critère principal
                .eq('id', oldData.id)   // Double sécurité
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
        
        // Tentative de secours : INSERT simple
        if (error.code === '42501') {
            console.log("🔄 Tentative INSERT simple...");
            try {
                const { data, error: insertError } = await supabase
                    .from('scores')
                    .insert({
                        user_id: userId,
                        score: score,
                        pseudo: userPseudo,
                        name: userPseudo,
                        email: userEmail || '',
                        created_at: new Date().toISOString()
                    })
                    .select();
                
                if (insertError) throw insertError;
                
                return {
                    success: true,
                    data: data,
                    action: 'inserted_fallback',
                    previousScore: 0,
                    newScore: score
                };
            } catch (fallbackError) {
                console.error('💥 Échec fallback:', fallbackError);
            }
        }
        
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
    
    // ============ VÉRIFIER EMAIL ============
   
    async function checkEmailExists(email) {
    console.log(`📧 Vérification email: ${email}`);
    
    try {
        // OPTION SIMPLE : On ne vérifie PAS côté client
        // On laisse Supabase Auth gérer les doublons lors de l'inscription
        // Cette fonction retourne TOUJOURS "false" pour permettre l'inscription
        // C'est Supabase qui refusera si l'email existe vraiment
        
        return { 
            success: true, 
            exists: false,  // Toujours false = on laisse passer
            message: "La vérification sera faite par Supabase lors de l'inscription"
        };
        
    } catch (error) {
        // En cas d'erreur, on laisse quand même passer
        return { 
            success: true, 
            exists: false 
        };
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
        checkEmailExists
    };
    
    console.log("✅ Prêt à utiliser");
}
