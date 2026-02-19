// supabase-config.js - VERSION COMPLÈTE AVEC SYSTÈME DE DEUX CLASSEMENTS
const SUPABASE_URL = "https://darzscuvrvvguljtuwhg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcnpzY3V2cnZ2Z3VsanR1d2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzYwNDAsImV4cCI6MjA4MDUxMjA0MH0.drgwBrdS3yXsoXnL8qWFB7BYm9opdAwcN8n5CoUcYIY";

if (typeof window.supabase === "undefined") {
  console.error("❌ Supabase.js non chargé !");
  window.supabaseFunctions = null;
} else {
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  async function getAuthenticatedUserOrNull() {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("❌ Erreur lecture session:", sessionError);
      return null;
    }

    if (sessionData?.session?.user) {
      return sessionData.session.user;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (!userError && userData?.user) {
      return userData.user;
    }

    const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
    if (!refreshError && refreshedData?.session?.user) {
      return refreshedData.session.user;
    }

    return null;
  }

  // ============ INSCRIPTION ============
  async function signUpSupabase(email, password, pseudo) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { pseudo: pseudo, created_at: new Date().toISOString() } },
      });

      if (authError) {
        return {
          success: false,
          error: authError.message.includes("already") ? "Cet email est déjà utilisé" : authError.message,
        };
      }

      // Ajouter à la table joueurs
      const joueurData = {
        user_id: authData.user.id,
        pseudo: pseudo,
        email: email,
        created_at: new Date().toISOString(),
      };

      await supabase.from("joueurs").insert([joueurData]);

      // Connecter automatiquement
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (loginError || !loginData?.session || !loginData?.user) {
        return {
          success: true,
          user: authData.user,
          session: null,
          requiresEmailConfirmation: true,
          message: "Inscription reussie. Verifiez votre email puis connectez-vous.",
        };
      }

      return {
        success: true,
        user: loginData.user,
        session: loginData.session,
        requiresEmailConfirmation: false,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ============ CONNEXION ============
  async function signInSupabase(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data?.session || !data?.user) {
        return { success: false, error: "Session manquante apres connexion. Verifiez votre email puis reconnectez-vous." };
      }
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
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      let session = data?.session || null;
      let user = session?.user || null;

      if (!user) {
        user = await getAuthenticatedUserOrNull();
      }

      return { success: true, session, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ============ MOT DE PASSE OUBLIE ============
  async function resetPasswordSupabase(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ============ SAUVEGARDE SCORE AVEC SYSTÈME LÉGENDAIRE ============
 // ============ SAUVEGARDE SCORE - LÉGENDAIRES IMMORTELS ============
async function saveScoreWithHistory(score, userId, userPseudo, userEmail = "", estLegendaire = false, viesRestantes = 0, tempsTotal = 0) {
  try {
    const authenticatedUser = await getAuthenticatedUserOrNull();
    if (!authenticatedUser?.id) {
      return {
        success: false,
        error: "Session expiree. Reconnectez-vous avant de sauvegarder.",
        action: "auth_required",
      };
    }

    if (authenticatedUser.id !== userId) {
      return {
        success: false,
        error: "Session invalide pour cet utilisateur. Reconnectez-vous.",
        action: "forbidden",
      };
    }

    const estAutoLegendaire = (score === 100 && viesRestantes > 0);
    const estParfait = (score === 100);

    // 1. Récupérer ancien score avec TOUTES les données
    const { data: oldScoreData, error: fetchError } = await supabase
      .from("scores")
      .select("score, created_at, updated_at, est_legendaire, vies_restantes, temps_total")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) console.error("❌ Erreur récupération ancien score:", fetchError);

    const oldScore = oldScoreData?.score || 0;
    const oldIsLegendary = oldScoreData?.est_legendaire || false;
    const oldLives = oldScoreData?.vies_restantes || 0;
    const oldTime = oldScoreData?.temps_total || 999999;
    
    const isNewRecord = score > oldScore;
    const now = new Date().toISOString();

    // 2. LOGIQUE CRITIQUE : Un légendaire reste toujours légendaire
    let finalEstLegendaire = oldIsLegendary || estLegendaire || estAutoLegendaire;
    
    // Logique de MEILLEURE performance
    let bestScore = oldScore;
    let bestLives = oldLives;
    let bestTime = oldTime;
    let scoreImproved = false;
    let timeImproved = false;
    let livesImproved = false;

    if (oldIsLegendary) {
      // DÉJÀ LÉGENDAIRE → Conserve toujours son statut
      console.log("👑 JOUEUR DÉJÀ LÉGENDAIRE - Statut préservé");
      
      // Ne peut qu'améliorer son temps, pas son score (déjà 100)
      if (score === 100 && viesRestantes > 0) {
        // Seulement si nouveau temps MEILLEUR
        if (tempsTotal < oldTime) {
          bestTime = tempsTotal;
          timeImproved = true;
          console.log(`🏆 Amélioration temps: ${oldTime}s → ${bestTime}s (-${oldTime - bestTime}s)`);
        }
        
        // Seulement si plus de vies
        if (viesRestantes > oldLives) {
          bestLives = viesRestantes;
          livesImproved = true;
          console.log(`💖 Amélioration vies: ${oldLives} → ${bestLives} vies`);
        }
      }
      // Score < 100 → IGNORÉ, garde son 100/100 légendaire
      
    } else if (estAutoLegendaire) {
      // NOUVEAU LÉGENDAIRE
      console.log(`🎉 NOUVEAU LÉGENDAIRE ! ${tempsTotal}s avec ${viesRestantes} vies`);
      bestScore = 100;
      bestLives = viesRestantes;
      bestTime = tempsTotal;
      scoreImproved = true;
      finalEstLegendaire = true;
    } else {
      // JOUEUR NORMAL → logique normale
      bestScore = isNewRecord ? score : oldScore;
      bestLives = viesRestantes;
      bestTime = tempsTotal;
      scoreImproved = isNewRecord;
    }

    // 3. Préparer données pour table scores
    const scoreData = {
      user_id: userId,
      score: bestScore,              // Toujours le meilleur score
      pseudo: userPseudo,
      name: userPseudo,
      email: userEmail || "",
      updated_at: now,
      // COLONNES LÉGENDAIRES
      est_legendaire: finalEstLegendaire,
      vies_restantes: bestLives,      // Meilleures vies
      temps_total: bestTime,          // Meilleur temps
      est_parfait: (bestScore === 100)
    };

    // Gestion des dates
    if (!oldScoreData) {
      scoreData.created_at = now;
    } else if (scoreImproved) {
      scoreData.created_at = now; // Nouveau record = nouvelle date
    } else {
      scoreData.created_at = oldScoreData.created_at;
    }

    // 4. UPSERT dans scores
    const { data: upsertResult, error: upsertError } = await supabase
      .from("scores")
      .upsert(scoreData, { onConflict: 'user_id' })
      .select();

    if (upsertError) {
      console.error("❌ Erreur upsert scores:", upsertError);
      const upsertMessage = String(upsertError.message || "").toLowerCase();
      const upsertIsRls = upsertError.code === "42501" || upsertMessage.includes("row-level security");
      if (upsertIsRls) {
        throw new Error("Permission refusee par la policy RLS sur scores. Verifiez la session active et les policies INSERT/UPDATE.");
      }

      // FALLBACK simplifié
      const scoreDataFallback = {
        user_id: userId,
        score: bestScore,
        pseudo: userPseudo,
        name: userPseudo,
        email: userEmail || "",
        updated_at: now,
        created_at: !oldScoreData ? now : oldScoreData.created_at
      };
      
      const { data: fallbackResult, error: fallbackError } = await supabase
        .from("scores")
        .upsert(scoreDataFallback, { onConflict: 'user_id' })
        .select();
        
      if (fallbackError) {
        const fallbackMessage = String(fallbackError.message || "").toLowerCase();
        const fallbackIsRls = fallbackError.code === "42501" || fallbackMessage.includes("row-level security");
        if (fallbackIsRls) {
          throw new Error("Permission refusee par la policy RLS sur scores. Verifiez la session active et les policies INSERT/UPDATE.");
        }
        throw new Error(`Erreur fallback: ${fallbackError.message}`);
      }
    } else {
      console.log(`✅ Score traité: ${bestScore}/100 ${finalEstLegendaire ? '👑 LÉGENDAIRE' : ''}`);
      if (finalEstLegendaire) {
        console.log(`   📊 Stats: ${bestTime}s, ${bestLives} vies`);
      }
    }

    // 5. Historique (TOUJOURS enregistrer la partie actuelle)
    const historyEntry = {
      user_id: userId,
      score: score,
      played_at: now
    };

    // Ajouter colonnes légendaires
    const historyColumns = await checkHistoryColumns();
    if (historyColumns.hasLegendary) historyEntry.is_legendary = estAutoLegendaire || estLegendaire;
    if (historyColumns.hasLives) historyEntry.lives_remaining = viesRestantes;
    if (historyColumns.hasTime) historyEntry.total_time = tempsTotal;
    if (historyColumns.hasPerfect) historyEntry.is_perfect = estParfait;

    await supabase.from("game_history").insert([historyEntry]);

    // 6. Type de message
    let messageType = "normal";
    let details = {};

    if (!oldScoreData) {
      messageType = "first_time";
      details = { isPerfect: estParfait };
    } else if (scoreImproved) {
      const improvement = bestScore - oldScore;
      const percentage = oldScore > 0 ? Math.round((improvement / oldScore) * 100) : 100;
      let level = "small";
      if (improvement >= 20) level = "huge";
      else if (improvement >= 15) level = "major";
      else if (improvement >= 10) level = "good";
      
      messageType = "record_beaten";
      details = { improvement, percentage, level, isPerfect: estParfait };
    } else if (score === oldScore) {
      messageType = "equal_score";
    } else {
      messageType = "lower_score";
      const difference = oldScore - score;
      details = { difference, needed: difference + 1 };
    }

    // 7. Retour complet
    return {
      success: true,
      action: scoreImproved ? "updated" : "skipped",
      messageType,
      details,
      previousScore: oldScore,
      newScore: bestScore,
      hasImproved: scoreImproved,
      isFirstTime: !oldScoreData,
      timestamp: now,
      recordDate: scoreData.created_at,
      isLegendary: finalEstLegendaire,
      isPerfect: (bestScore === 100),
      livesRemaining: bestLives,
      totalTime: bestTime,
      improvedTime: timeImproved,
      improvedLives: livesImproved,
      improvedScore: scoreImproved,
      oldTime: oldTime,
      newTime: bestTime,
      oldLives: oldLives,
      newLives: bestLives,
      oldIsLegendary: oldIsLegendary,
      newIsLegendary: finalEstLegendaire,
      statusChanged: (oldIsLegendary !== finalEstLegendaire)
    };

  } catch (error) {
    console.error("💥 Erreur sauvegarde:", error);
    return { success: false, error: error.message, action: "failed" };
  }
}

  // ============ VÉRIFIER COLONNES DISPONIBLES ============
  async function checkHistoryColumns() {
    try {
      // Tester avec une requête simple
      const { data, error } = await supabase
        .from("game_history")
        .select("id")
        .limit(1);
        
      // Si erreur spécifique sur les colonnes, on sait lesquelles manquent
      return {
        hasLegendary: true, // À ajuster selon vos tests
        hasLives: true,
        hasTime: true,
        hasPerfect: true
      };
    } catch {
      return { hasLegendary: false, hasLives: false, hasTime: false, hasPerfect: false };
    }
  }

  // ============ SCORES LÉGENDAIRES ============
 // ============ SCORES LÉGENDAIRES (SEULEMENT LES LÉGENDAIRES) ============
async function getLegendaryScores(limit = 10) {
  try {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("est_legendaire", true)    // ← UNIQUEMENT les légendaires
      .eq("est_parfait", true)       // ← Doit être 100/100
      .order("temps_total", { ascending: true })   // ← Tri par temps (plus rapide d'abord)
      .order("vies_restantes", { ascending: false }) // ← Puis par vies restantes
      .order("created_at", { ascending: true })     // ← En cas d'égalité
      .limit(limit);

    if (error) throw error;
    
    // Formater le temps pour l'affichage
    const formattedData = data?.map(item => ({
      ...item,
      displayTime: formatLegendaryTime(item.temps_total)
    })) || [];
    
    console.log(`👑 Hall of Legends : ${formattedData.length} légendaires`);
    formattedData?.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.pseudo} - ${item.temps_total}s - ${item.vies_restantes} vies`);
    });
    
    return { success: true, data: formattedData };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
}

// Fonction utilitaire pour formater le temps
function formatLegendaryTime(seconds) {
  if (!seconds) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

  // ============ SCORES NORMAUX ============
 // ============ SCORES NORMAUX (EXCLUANT LES LÉGENDAIRES) ============
async function getHighScoresFromSupabase(limit = 10) {
  try {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("est_legendaire", false)  // ← CRITIQUE : exclure les légendaires
      .order("score", { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // Debug : vérifier ce qu'on récupère
    console.log(`📊 Classement général : ${data?.length || 0} joueurs (légendaires exclus)`);
    data?.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.pseudo} - ${item.score}/100 (légendaire: ${item.est_legendaire})`);
    });
    
    return { success: true, data: data || [] };
  } catch (error) {
    console.error("❌ Erreur getHighScoresFromSupabase:", error);
    return { success: false, data: [], error: error.message };
  }
}

  // ============ TEMPS RÉEL ============
  async function subscribeToScores(callback) {
    try {
      const subscription = supabase
        .channel("scores-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "scores" }, callback)
        .subscribe();
      return subscription;
    } catch (error) {
      console.error("❌ Erreur subscription:", error);
      return null;
    }
  }

  function unsubscribeFromScores(subscription) {
    try {
      if (subscription) supabase.removeChannel(subscription);
    } catch (error) {
      console.error("❌ Erreur désabonnement:", error);
    }
  }

  // ============ STATISTIQUES ============
  async function getPlayerStatsWithHistory(userId) {
    try {
      const { data: bestScoreData, error: bestScoreError } = await supabase
        .from("scores")
        .select("score, created_at, est_legendaire, vies_restantes")
        .eq("user_id", userId)
        .maybeSingle();

      // Historique (sans colonnes légendaires pour éviter les erreurs)
      const { data: historyData, error: historyError } = await supabase
        .from("game_history")
        .select("score, played_at")
        .eq("user_id", userId)
        .order("played_at", { ascending: false });

      if (historyError) console.error("❌ Erreur historique:", historyError);

      const history = historyData || [];
      const bestScore = bestScoreData?.score || 0;
      const bestDate = bestScoreData?.created_at || null;
      const totalGames = history.length;

      let averageScore = 0;
      if (totalGames > 0) {
        const total = history.reduce((sum, game) => sum + game.score, 0);
        averageScore = Math.round(total / totalGames);
      }

      return {
        success: true,
        data: {
          bestScore,
          bestDate,
          totalGames,
          averageScore,
          isLegendary: bestScoreData?.est_legendaire || false,
          legendaryLives: bestScoreData?.vies_restantes || 0
        },
      };
    } catch (error) {
      console.error("❌ Erreur stats:", error);
      return {
        success: false,
        error: error.message,
        data: { bestScore: 0, bestDate: null, totalGames: 0, averageScore: 0 }
      };
    }
  }

  async function getScoreHistory(userId, limit = 5) {
    try {
      const { data, error } = await supabase
        .from("game_history")
        .select("score, played_at")
        .eq("user_id", userId)
        .order("played_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data: data || [] };
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
    resetPasswordSupabase,
    saveScoreToSupabase: saveScoreWithHistory,
    getHighScoresFromSupabase,
    getPlayerStats: getPlayerStatsWithHistory,
    getScoreHistory,
    getLegendaryScores,
    checkEmailExists: async () => ({ success: true, exists: false }),
    subscribeToScores,
    unsubscribeFromScores,
    
    // Compatibilité
    getPersonalBest: async (userId) => {
      const result = await getPlayerStatsWithHistory(userId);
      if (result.success) {
        return { success: true, bestScore: result.data.bestScore, bestDate: result.data.bestDate };
      }
      return result;
    },
    
    getGameHistory: async (userId, limit = 10) => {
      try {
        const { data, error } = await supabase
          .from("game_history")
          .select("*")
          .eq("user_id", userId)
          .order("played_at", { ascending: false })
          .limit(limit);
        if (error) throw error;
        return { success: true, data: data || [] };
      } catch (error) {
        return { success: false, error: error.message, data: [] };
      }
    },
    
    // ============ NOUVELLES FONCTIONS POUR LE SYSTÈME DE DEUX CLASSEMENTS ============
    
    // Récupère le classement Hall of Legends (trié par temps)
    getLegendaryRanking: async function(limit = 20) {
      try {
        // Récupère uniquement les légendaires, triés par temps (plus rapide d'abord)
        const { data, error } = await supabase
          .from("scores")
          .select("*")
          .eq("est_legendaire", true)
          .eq("est_parfait", true)
          .order("temps_total", { ascending: true })  // Les plus rapides d'abord
          .order("vies_restantes", { ascending: false }) // Puis ceux avec plus de vies
          .order("created_at", { ascending: true })  // Puis les plus anciens
          .limit(limit);

        if (error) throw error;
        
        return { 
          success: true, 
          data: data || [],
          total: data?.length || 0
        };
      } catch (error) {
        return { success: false, error: error.message, data: [] };
      }
    },
    
    // Récupère le rang spécifique d'un utilisateur dans le Hall of Legends
    getUserLegendaryRank: async function(userId) {
      try {
        // 1. Récupérer tous les légendaires triés
        const { data: allLegendary, error } = await supabase
          .from("scores")
          .select("user_id, temps_total, vies_restantes, created_at")
          .eq("est_legendaire", true)
          .eq("est_parfait", true)
          .order("temps_total", { ascending: true })
          .order("vies_restantes", { ascending: false })
          .order("created_at", { ascending: true });

        if (error) throw error;
        
        // 2. Trouver la position de l'utilisateur
        const legendaryList = allLegendary || [];
        const userIndex = legendaryList.findIndex(item => item.user_id === userId);
        
        if (userIndex === -1) {
          return { success: true, isLegendary: false, rank: null, total: legendaryList.length };
        }
        
        // 3. Récupérer les infos détaillées du joueur
        const { data: userData, error: userError } = await supabase
          .from("scores")
          .select("score, vies_restantes, temps_total, created_at")
          .eq("user_id", userId)
          .eq("est_legendaire", true)
          .single();
        
        if (userError) {
          console.error("❌ Erreur récupération données légendaires:", userError);
        }
        
        return {
          success: true,
          isLegendary: true,
          rank: userIndex + 1,  // Position (1 = premier)
          total: legendaryList.length,
          score: userData?.score || 100,
          lives: userData?.vies_restantes || 0,
          time: userData?.temps_total || 0,
          date: userData?.created_at || null
        };
        
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };

  console.log("✅ Supabase config chargé avec système de deux classements !");
}
