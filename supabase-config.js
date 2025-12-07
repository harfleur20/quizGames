
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
    async function saveScoreToSupabase(score) {
        try {
            // Récupérer l'utilisateur
            const session = await getSessionSupabase();
            if (!session.user) {
                return { success: false, error: "Non connecté" };
            }
            
            const user = session.user;
            const pseudo = user.user_metadata?.pseudo || user.email?.split('@')[0];
            
            // Sauvegarder le score
            const { data, error } = await supabase
                .from('scores')
                .insert({
                    pseudo: pseudo,
                    email: user.email,
                    score: score,
                    created_at: new Date().toISOString()
                });
            
            if (error) throw error;
            return { success: true, data: data };
            
        } catch (error) {
            return { success: false, error: error.message };
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
