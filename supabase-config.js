// supabase-config.js - VERSION AVEC updated_at CORRIGÉ
const SUPABASE_URL = 'https://darzscuvrvvguljtuwhg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcnpzY3V2cnZ2Z3VsanR1d2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzYwNDAsImV4cCI6MjA4MDUxMjA0MH0.drgwBrdS3yXsoXnL8qWFB7BYm9opdAwcN8n5CoUcYIY';

console.log("🔧 Supabase avec historique complet des parties");

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
    
    // ============ SAUVEGARDER SCORE AVEC HISTORIQUE ============
    async function saveScoreWithHistory(score, userId, userPseudo, userEmail = '') {
        console.log("💾 Sauvegarde avec historique pour user:", userId);
        
        try {
            // 1. UPSERT dans la table 'scores' (meilleur score seulement)
            console.log("🏆 Mise à jour du meilleur score...");
            
            // D'abord, récupérer l'ancien score
            const { data: oldScoreData, error: fetchError } = await supabase
                .from('scores')
                .select('score, created_at, updated_at')
                .eq('user_id', userId)
                .maybeSingle();
            
            const oldScore = oldScoreData?.score || 0;
            const isNewRecord = score > oldScore;
            const oldCreatedAt = oldScoreData?.created_at || new Date().toISOString();
            const now = new Date().toISOString();
            
            // Données pour l'upsert
            const scoreData = {
                user_id: userId,
                score: isNewRecord ? score : oldScore,
                pseudo: userPseudo,
                name: userPseudo,
                email: userEmail || '',
                updated_at: now,
                created_at: oldCreatedAt
            };
            
            // Si c'est un nouveau record, on met à jour la date de création aussi
            if (isNewRecord && !oldScoreData) {
                scoreData.created_at = now;
            }
            
            console.log("📊 Données score:", scoreData);
            
            const { data: bestScoreData, error: bestScoreError } = await supabase
                .from('scores')
                .upsert(scoreData, {
                    onConflict: 'user_id',
                    ignoreDuplicates: false
                })
                .select()
                .single();
            
            if (bestScoreError) {
                console.error("❌ Erreur upsert scores:", bestScoreError);
                throw bestScoreError;
            }
            
            console.log(`✅ Meilleur score: ${oldScore} → ${isNewRecord ? score : oldScore}`);
            
            // 2. INSERT dans la table 'game_history' (toutes les parties)
            console.log("📝 Ajout à l'historique des parties...");
            
            const { data: historyData, error: historyError } = await supabase
                .from('game_history')
                .insert({
                    user_id: userId,
                    pseudo: userPseudo,
                    score: score,
                    played_at: now
                })
                .select()
                .single();
            
            if (historyError) {
                console.error("❌ Erreur insertion historique:", historyError);
                // On continue quand même
            } else {
                console.log("✅ Partie ajoutée à l'historique");
            }
            
            // 3. Analyse détaillée
            let messageType = '';
            let details = {};
            
            if (!oldScoreData) {
                // Première partie
                messageType = 'first_time';
                details = { isPerfect: score === 100 };
            } else if (isNewRecord) {
                // Nouveau record
                const improvement = score - oldScore;
                const percentage = oldScore > 0 ? Math.round((improvement / oldScore) * 100) : 100;
                
                let improvementLevel = 'small';
                if (improvement >= 30) improvementLevel = 'huge';
                else if (improvement >= 20) improvementLevel = 'major';
                else if (improvement >= 10) improvementLevel = 'good';
                else if (improvement >= 5) improvementLevel = 'small';
                
                messageType = 'record_beaten';
                details = {
                    improvement: improvement,
                    percentage: percentage,
                    level: improvementLevel,
                    wasPerfect: oldScore === 100,
                    isPerfect: score === 100
                };
            } else if (score === oldScore) {
                // Score égal
                messageType = 'equal_score';
            } else {
                // Score inférieur
                messageType = 'lower_score';
                details = {
                    difference: oldScore - score,
                    needed: Math.max(1, oldScore - score + 1)
                };
            }
            
            console.log(`📊 Résultat: ${messageType}`);
            
            return {
                success: true,
                data: {
                    bestScore: bestScoreData,
                    historyEntry: historyData
                },
                action: isNewRecord ? 'updated' : 'skipped',
                messageType: messageType,
                details: details,
                previousScore: oldScore,
                newScore: score,
                hasImproved: isNewRecord,
                isFirstTime: !oldScoreData,
                timestamp: now
            };
            
        } catch (error) {
            console.error('💥 Erreur sauvegarde avec historique:', error);
            
            // Fallback simple
            try {
                const { data, error: simpleError } = await supabase
                    .from('scores')
                    .upsert({
                        user_id: userId,
                        score: score,
                        pseudo: userPseudo,
                        name: userPseudo,
                        email: userEmail || '',
                        created_at: new Date().toISOString()
                    })
                    .select();
                
                if (!simpleError) {
                    return {
                        success: true,
                        data: data,
                        action: 'inserted_fallback',
                        messageType: 'first_time',
                        previousScore: 0,
                        newScore: score,
                        isFirstTime: true
                    };
                }
            } catch (fallbackError) {
                console.error('💥 Fallback échoué:', fallbackError);
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
    
    // ============ TEMPS RÉEL ============
    async function subscribeToScores(callback) {
        try {
            console.log("🔔 Début de l'abonnement aux scores...");
            
            const subscription = supabase
                .channel('scores-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
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

    // ============ STATISTIQUES AVEC HISTORIQUE ============
    async function getPlayerStatsWithHistory(userId) {
        console.log(`📈 Récupération stats avec historique pour user: ${userId}`);
        
        try {
            // 1. Récupérer le meilleur score - CORRIGÉ avec updated_at
            const { data: bestScoreData, error: bestScoreError } = await supabase
                .from('scores')
                .select('score, updated_at, created_at')
                .eq('user_id', userId)
                .maybeSingle();
            
            // 2. Récupérer l'historique complet
            const { data: historyData, error: historyError } = await supabase
                .from('game_history')
                .select('score, played_at')
                .eq('user_id', userId)
                .order('played_at', { ascending: false });
            
            if (historyError) {
                console.error("❌ Erreur historique:", historyError);
                return await getPlayerStatsFallback(userId);
            }
            
            const history = historyData || [];
            
            // 3. Calculer les statistiques
            // Utiliser updated_at si disponible, sinon created_at
            const bestScore = bestScoreData?.score || 0;
            const bestDate = bestScoreData?.updated_at || bestScoreData?.created_at || null;
            const totalGames = history.length;
            
            // Score moyen
            let averageScore = 0;
            if (totalGames > 0) {
                const total = history.reduce((sum, game) => sum + game.score, 0);
                averageScore = Math.round(total / totalGames);
            }
            
            // Dernière partie
            let lastGame = null;
            let lastGameDate = null;
            let lastGameScore = 0;
            if (history.length > 0) {
                lastGame = history[0];
                lastGameDate = lastGame.played_at;
                lastGameScore = lastGame.score;
            }
            
            // Tendances (dernières 5 parties)
            const last5Games = history.slice(0, 5);
            const last5Average = last5Games.length > 0 
                ? Math.round(last5Games.reduce((sum, game) => sum + game.score, 0) / last5Games.length)
                : 0;
            
            // Progression (première vs dernière partie)
            let progression = 0;
            let progressionPercent = 0;
            if (history.length >= 2) {
                const firstScore = history[history.length - 1].score;
                const lastScore = history[0].score;
                progression = lastScore - firstScore;
                if (firstScore > 0) {
                    progressionPercent = Math.round((progression / firstScore) * 100);
                }
            }
            
            console.log(`✅ Stats avec historique:
                Parties: ${totalGames}
                Meilleur: ${bestScore}/100
                Moyenne: ${averageScore}/100
                Dernière: ${lastGameScore}/100`);
            
            return {
                success: true,
                data: {
                    bestScore: bestScore,
                    bestDate: bestDate,
                    totalGames: totalGames,
                    averageScore: averageScore,
                    lastGame: lastGame,
                    lastGameScore: lastGameScore,
                    lastGameDate: lastGameDate,
                    history: history,
                    last5Average: last5Average,
                    progression: progression,
                    progressionPercent: progressionPercent,
                    isImproving: progression > 0
                }
            };
            
        } catch (error) {
            console.error("❌ Erreur getPlayerStatsWithHistory:", error);
            return await getPlayerStatsFallback(userId);
        }
    }
    
    // Fallback si l'historique n'est pas disponible
    async function getPlayerStatsFallback(userId) {
        console.log("🔄 Utilisation du fallback pour les stats");
        
        try {
            const { data: scores, error } = await supabase
                .from('scores')
                .select('score, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            const scoresList = scores || [];
            const totalGames = scoresList.length > 0 ? 1 : 0;
            
            let bestScore = 0;
            let bestDate = null;
            let averageScore = 0;
            
            if (scoresList.length > 0) {
                bestScore = scoresList[0].score || 0;
                bestDate = scoresList[0].created_at || null;
                averageScore = bestScore;
            }
            
            return {
                success: true,
                data: {
                    bestScore: bestScore,
                    bestDate: bestDate,
                    totalGames: totalGames,
                    averageScore: averageScore,
                    lastGame: null,
                    lastGameScore: 0,
                    lastGameDate: null,
                    history: [],
                    last5Average: 0,
                    progression: 0,
                    progressionPercent: 0,
                    isImproving: false
                }
            };
            
        } catch (fallbackError) {
            console.error("❌ Erreur fallback:", fallbackError);
            return { 
                success: false, 
                error: fallbackError.message,
                data: {
                    bestScore: 0,
                    bestDate: null,
                    totalGames: 0,
                    averageScore: 0,
                    lastGame: null,
                    lastGameScore: 0,
                    lastGameDate: null,
                    history: [],
                    last5Average: 0,
                    progression: 0,
                    progressionPercent: 0,
                    isImproving: false
                }
            };
        }
    }
    
    // ============ ANCIENNES FONCTIONS (pour compatibilité) ============
    async function getPersonalBest(userId) {
        try {
            const result = await getPlayerStatsWithHistory(userId);
            if (result.success) {
                return {
                    success: true,
                    bestScore: result.data.bestScore,
                    bestDate: result.data.bestDate
                };
            }
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    async function getScoreHistory(userId, limit = 5) {
        try {
            const { data, error } = await supabase
                .from('game_history')
                .select('score, played_at')
                .eq('user_id', userId)
                .order('played_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            
            return { 
                success: true, 
                data: data || [],
                lastScores: (data || []).map(item => item.score)
            };
            
        } catch (error) {
            return { success: false, error: error.message, data: [] };
        }
    }
    
    // ============ EXPORT ============
    window.supabaseFunctions = {
        signUpSupabase,
        signInSupabase,
        signOutSupabase,
        getSessionSupabase,
        saveScoreToSupabase: saveScoreWithHistory,
        getHighScoresFromSupabase,
        getPersonalBest,
        getPlayerStats: getPlayerStatsWithHistory,
        getScoreHistory,
        checkEmailExists: async function(email) {
            return { success: true, exists: false };
        },
        subscribeToScores,
        unsubscribeFromScores,
        
        // Nouvelles fonctions pour l'historique
        getGameHistory: async function(userId, limit = 10) {
            try {
                const { data, error } = await supabase
                    .from('game_history')
                    .select('*')
                    .eq('user_id', userId)
                    .order('played_at', { ascending: false })
                    .limit(limit);
                
                if (error) throw error;
                return { success: true, data: data || [] };
            } catch (error) {
                return { success: false, error: error.message, data: [] };
            }
        },
        
        getRecentGames: async function(limit = 5) {
            try {
                const { data, error } = await supabase
                    .from('game_history')
                    .select('*')
                    .order('played_at', { ascending: false })
                    .limit(limit);
                
                if (error) throw error;
                return { success: true, data: data || [] };
            } catch (error) {
                return { success: false, error: error.message, data: [] };
            }
        }
    };
    
    console.log("✅ Prêt à utiliser avec historique complet des parties");
}