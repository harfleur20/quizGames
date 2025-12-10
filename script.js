import { quizQuestions } from "./quizQuestion.js";

// ==================== ÉLÉMENTS DU DOM ====================
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

// Modal auth elements
const authModal = document.getElementById("auth-modal");
const closeAuthModalBtn = document.getElementById("close-auth-modal");
const loginBtnHeader = document.getElementById("login-btn-header");

// Éléments du modal
const loginTabModal = document.getElementById("login-tab-modal");
const registerTabModal = document.getElementById("register-tab-modal");
const loginFormModal = document.getElementById("login-form-modal");
const registerFormModal = document.getElementById("register-form-modal");
const loginEmailModal = document.getElementById("login-email-modal");
const loginPasswordModal = document.getElementById("login-password-modal");
const loginBtnModal = document.getElementById("login-btn-modal");
const registerPseudoModal = document.getElementById("register-pseudo-modal");
const registerEmailModal = document.getElementById("register-email-modal");
const registerPasswordModal = document.getElementById(
  "register-password-modal"
);
const registerConfirmModal = document.getElementById("register-confirm-modal");
const registerBtnModal = document.getElementById("register-btn-modal");

// User info elements
const currentUserPseudo = document.getElementById("current-user-pseudo");
const currentUserEmail = document.getElementById("current-user-email");
const logoutBtn = document.getElementById("logout-btn");

// Quiz elements
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");
const timerDisplay = document.getElementById("timer");

const highscoresListStart = document.getElementById("highscores-list-start");
const highscoresListResult = document.getElementById("highscores-list-result");
const playerResultName = document.getElementById("player-result-name");
const questionsDoneSpan = document.getElementById("questions-done");
const percentageSpan = document.getElementById("percentage");
const currentPlayerSpan = document.getElementById("current-player");

const rulesContent = document.getElementById("rules-content");
const toggleRulesBtn = document.getElementById("toggle-rules");
const progressPercentSpan = document.getElementById("progress-percent");
const showLegendaryRankingBtn = document.getElementById("show-legendary-ranking");

const showMoreScoresBtn = document.getElementById("show-more-scores");
const showMoreScoresResultBtn = document.getElementById(
  "show-more-scores-result"
);

// ==================== ÉLÉMENTS DU PANEL STATS ====================
const statsIcon = document.getElementById("stats-icon");
const statsPanel = document.getElementById("stats-panel");
const closeStatsPanelBtn = document.getElementById("close-stats-panel");
const seeAllStatsBtn = document.getElementById("see-all-stats");
const statsBestScore = document.getElementById("stats-best-score");
const statsTotalGames = document.getElementById("stats-total-games");
const statsAverageScore = document.getElementById("stats-average-score");
const recentGamesList = document.getElementById("recent-games-list");

// ==================== VARIABLES GLOBALES ====================
let visibleScoresCount = 4;
let allHighscores = [];
let isExpandedStart = false;
let isExpandedResult = false;
let scoreSubscription = null;
let startTime = 0;
let totalTime = 0;
let legendaryScores = [];
let showLegendaryRankingFlag = false;



// Système de vies
let lives = 2;
let livesDisplay = null;
let livesCount = null;

// État du quiz
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let quizSession = [];
let timer = null;
let timeLeft = 10;
let gameStopped = false;
const TOTAL_QUESTIONS = 100;

// User info
let currentUser = null;

// ==================== CONTRÔLES AUDIO ====================
function setupAudioControls() {
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  if (!audioToggleBtn || !window.audioManager) return;
  
  // Mettre à jour l'icône selon l'état
  function updateAudioButton() {
    const isEnabled = window.audioManager.isEnabled();
    const icon = audioToggleBtn.querySelector('i');
    
    if (isEnabled) {
      icon.className = 'fa-solid fa-volume-high';
      audioToggleBtn.title = 'Désactiver le son';
      audioToggleBtn.classList.remove('muted');
    } else {
      icon.className = 'fa-solid fa-volume-xmark';
      audioToggleBtn.title = 'Activer le son';
      audioToggleBtn.classList.add('muted');
    }
  }
  
  // Initialiser l'icône
  updateAudioButton();
  
  // Gérer le clic
  audioToggleBtn.addEventListener('click', () => {
    const enabled = window.audioManager.toggle();
    updateAudioButton();
    
    // Jouer un son de test si on active
    if (enabled) {
      window.audioManager.playSound('correct');
    }
  });
}

// ==================== INITIALISATION ====================
window.addEventListener("DOMContentLoaded", async () => {
  try {
    // Initialiser l'audio manager
    if (window.audioManager) {
      window.audioManager.init();
      setupAudioControls(); // Configurer le bouton audio
    }
    
    await checkExistingSession();
    setupAuthEvents();
    setupQuizEvents();
    
    // Initialiser les notifications de jeu
    if (window.gameNotifications && window.gameNotifications.initGameNotifications) {
      window.gameNotifications.initGameNotifications();
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
    showScreen("start");
  }
});

async function checkExistingSession() {
  try {
    if (
      !window.supabaseFunctions ||
      !window.supabaseFunctions.getSessionSupabase
    ) {
      currentUser = null;
      updateUserDisplay();
      showScreen("start");
      setTimeout(() => loadScoresFromSupabase(), 1000);
      return;
    }

    const result = await window.supabaseFunctions.getSessionSupabase();

    if (result.success && result.user) {
      currentUser = {
        id: result.user.id,
        email: result.user.email,
        pseudo:
          result.user.user_metadata?.pseudo || result.user.email?.split("@")[0],
        isLegendary: false // Initialisation
      };

      // Vérifier et mettre à jour le statut légendaire
      try {
        const legendaryCheck = await checkIfUserIsLegendary(currentUser.id);
        currentUser.isLegendary = legendaryCheck;
        console.log(`👑 Statut légendaire au chargement: ${currentUser.isLegendary ? 'OUI' : 'NON'}`);
      } catch (legendaryError) {
        console.error("❌ Erreur vérification statut légendaire:", legendaryError);
        currentUser.isLegendary = false;
      }

      updateUserDisplay();
      showScreen("start");
      loadScoresFromSupabase();
      loadPlayerStats();
    } else {
      currentUser = null;
      updateUserDisplay();
      showScreen("start");
      loadScoresFromSupabase();
      resetPlayerStats();
    }
  } catch (error) {
    console.error("❌ Erreur vérification session:", error);
    currentUser = null;
    updateUserDisplay();
    showScreen("start");
    loadScoresFromSupabase();
    resetPlayerStats();
  }
}

function setupAuthEvents() {
  if (loginBtnHeader) {
    loginBtnHeader.addEventListener("click", showAuthModal);
  }

  if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener("click", hideAuthModal);
  }

  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) {
        hideAuthModal();
      }
    });
  }

  if (loginTabModal && registerTabModal) {
    loginTabModal.addEventListener("click", () => {
      loginTabModal.classList.add("active");
      registerTabModal.classList.remove("active");
      loginFormModal.classList.add("active");
      registerFormModal.classList.remove("active");
    });

    registerTabModal.addEventListener("click", () => {
      registerTabModal.classList.add("active");
      loginTabModal.classList.remove("active");
      registerFormModal.classList.add("active");
      loginFormModal.classList.remove("active");
    });
  }

  if (loginBtnModal) {
    loginBtnModal.addEventListener("click", async () => {
      const success = await handleLoginModal();
      if (success) {
        hideAuthModal();
      }
    });
  }

  if (registerBtnModal) {
    registerBtnModal.addEventListener("click", async () => {
      const success = await handleRegisterModal();
      if (success) {
        hideAuthModal();
      }
    });
  }

  if (loginPasswordModal) {
    loginPasswordModal.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const success = await handleLoginModal();
        if (success) {
          hideAuthModal();
        }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

function setupQuizEvents() {
  if (startButton) {
    startButton.addEventListener("click", startQuiz);
  }

  if (restartButton) {
    restartButton.addEventListener("click", restartQuiz);
  }

  if (toggleRulesBtn && rulesContent) {
    toggleRulesBtn.addEventListener("click", () => {
      const isVisible = rulesContent.classList.toggle("visible");
      toggleRulesBtn.innerHTML = isVisible
        ? '<i class="fa-solid fa-eye-slash"></i> Masquer les règles'
        : '<i class="fa-solid fa-eye"></i> Voir les règles du jeu';
    });
  }

  // Bouton retour à l'accueil
  const backToStartBtn = document.getElementById('back-to-start-btn');
  if (backToStartBtn) {
    backToStartBtn.addEventListener('click', goToStartScreen);
  }

  // NOUVEAU : Bouton Hall of Legends
  const showLegendaryRankingBtn = document.getElementById('show-legendary-ranking');
  if (showLegendaryRankingBtn) {
    showLegendaryRankingBtn.addEventListener('click', () => {
      console.log("🏆 Accès au Hall of Legends");
      showLegendaryRanking();
    });
  }

  if (showMoreScoresBtn) {
    showMoreScoresBtn.addEventListener("click", () => {
      isExpandedStart = !isExpandedStart;
      updateHighscoresDisplay();
      loadScoresFromSupabase();
    });
  }

  if (showMoreScoresResultBtn) {
    showMoreScoresResultBtn.addEventListener("click", () => {
      isExpandedResult = !isExpandedResult;
      updateHighscoresResultDisplay();
      loadScoresFromSupabase();
    });
  }

  // Configurer le panel des stats
  setupStatsPanelEvents();

  setTimeout(() => {
    setupRealTimeUpdates();
  }, 2000);
}


// fonction retour à l'écran d'accueil
function goToStartScreen() {
    showScreen('start');
    isExpandedStart = false;
    loadScoresFromSupabase();
    showMessage("Retour à l'accueil", "info");
}

// ==================== FONCTIONS DU PANEL STATS ====================
function setupStatsPanelEvents() {
  if (statsIcon) {
    statsIcon.addEventListener("click", toggleStatsPanel);
  }

  if (closeStatsPanelBtn) {
    closeStatsPanelBtn.addEventListener("click", hideStatsPanel);
  }

  if (seeAllStatsBtn) {
    seeAllStatsBtn.addEventListener("click", () => {
      hideStatsPanel();
      if (currentUser) {
        startQuiz();
      } else {
        showAuthModal();
        showMessage("🔒 Connectez-vous pour voir vos statistiques", "warning");
      }
    });
  }

  // Fermer le panel en cliquant en dehors
  document.addEventListener("click", (e) => {
    if (
      statsPanel &&
      statsPanel.classList.contains("active") &&
      !statsPanel.contains(e.target) &&
      !statsIcon.contains(e.target)
    ) {
      hideStatsPanel();
    }
  });
}

function toggleStatsPanel() {
  if (statsPanel && statsPanel.classList.contains("active")) {
    hideStatsPanel();
  } else {
    showStatsPanel();
  }
}

function showStatsPanel() {
  if (!statsPanel || !currentUser) return;

  loadRecentStats();
  statsPanel.classList.add("active");

  // Positionner le panel
  if (statsIcon) {
    const iconRect = statsIcon.getBoundingClientRect();
    statsPanel.style.top = `${iconRect.bottom + 10}px`;
    statsPanel.style.left = `${iconRect.left}px`;
  }
}

function hideStatsPanel() {
  if (statsPanel) {
    statsPanel.classList.remove("active");
  }
}

async function loadRecentStats() {
  try {
    if (!window.supabaseFunctions || !currentUser) {
      // Pas d'utilisateur connecté ou fonctions non disponibles
      updateRankingDisplay({ 
        error: true,
        message: "Connectez-vous pour voir votre classement" 
      });
      return;
    }

    // Afficher le chargement
    updateRankingDisplay({ loading: true });

    // 1. Charger les stats complètes
    const statsResult = await window.supabaseFunctions.getPlayerStats(
      currentUser.id
    );

    if (statsResult.success && statsResult.data) {
      updateStatsPanel(statsResult.data);
      
      // Mettre à jour le meilleur score de currentUser pour les calculs
      if (!currentUser.bestScore || currentUser.bestScore < statsResult.data.bestScore) {
        currentUser.bestScore = statsResult.data.bestScore || 0;
      }
    }

    // 2. Charger l'historique récent
    const historyResult = await window.supabaseFunctions.getScoreHistory(
      currentUser.id,
      5
    );

    if (historyResult.success && historyResult.data) {
      updateRecentGamesList(historyResult.data);
    }

    // 3. Calculer le rang avec la nouvelle logique
    let scoresToUse = allHighscores;
    
    // Vérifier si on a assez de scores (minimum 10 pour des estimations correctes)
    if (!scoresToUse || scoresToUse.length < 10) {
      // Charger les 50 premiers scores pour des calculs précis
      const scoresResult = await window.supabaseFunctions.getHighScoresFromSupabase(50);
      if (scoresResult.success && scoresResult.data) {
        scoresToUse = scoresResult.data.map(item => ({
          id: item.id,
          userId: item.user_id,
          name: item.pseudo || "Anonyme",
          score: item.score,
          date: item.created_at ? formatDate(item.created_at) : "Aujourd'hui",
          timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
        }));
        
        // Mettre à jour allHighscores pour les autres parties de l'app
        allHighscores = scoresToUse;
      } else {
        // Pas assez de données pour calculer un classement
        updateRankingDisplay({ 
          needsMoreData: true,
          message: "Pas assez de données de classement disponibles" 
        });
        return;
      }
    }
    
    // 4. Calculer le rang avec les nouvelles informations
    if (scoresToUse && scoresToUse.length > 0) {
     const ranking = await getUserRankingPosition(currentUser.id, scoresToUse);
      
      // Ajouter des informations supplémentaires pour l'affichage
      if (statsResult.success && statsResult.data) {
        ranking.userBestScore = statsResult.data.bestScore || 0;
        ranking.averageScore = statsResult.data.averageScore || 0;
        ranking.totalGames = statsResult.data.totalGames || 0;
        ranking.lastGameScore = statsResult.data.lastGameScore || 0;
        ranking.isImproving = statsResult.data.isImproving || false;
      }
      
      // Ajouter des informations de tendance si disponibles
      if (historyResult.success && historyResult.data && historyResult.data.length >= 2) {
        const lastScores = historyResult.data.map(game => game.score);
        ranking.trend = calculateScoreTrend(lastScores);
        ranking.lastScore = lastScores[0] || 0;
      }
      
      updateRankingDisplay(ranking);
    } else {
      // Aucun score disponible
      updateRankingDisplay({ 
        needsMoreData: true,
        message: "Aucun score enregistré. Jouez une partie !" 
      });
    }
    
  } catch (error) {
    console.error("❌ Erreur chargement stats récentes:", error);
    
    // Message d'erreur plus informatif
    let errorMessage = "Impossible de charger les statistiques";
    if (error.message.includes("network") || error.message.includes("fetch")) {
      errorMessage = "Problème de connexion. Vérifiez votre internet";
    } else if (error.message.includes("auth")) {
      errorMessage = "Session expirée. Reconnectez-vous";
    }
    
    showMessage(`⚠️ ${errorMessage}`, "warning");
    updateRankingDisplay({ 
      error: true,
      message: errorMessage 
    });
  }
}

// Fonction utilitaire pour calculer la tendance des scores
function calculateScoreTrend(scores) {
  if (!scores || scores.length < 2) return "stable";
  
  const recentScores = scores.slice(0, Math.min(3, scores.length));
  const oldScores = scores.slice(-Math.min(3, scores.length));
  
  const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  const oldAvg = oldScores.reduce((a, b) => a + b, 0) / oldScores.length;
  
  if (recentAvg > oldAvg + 5) return "improving";
  if (recentAvg < oldAvg - 5) return "declining";
  return "stable";
}

// Fonction utilitaire pour formater les scores du classement
function formatRankingScores(supabaseData) {
  if (!supabaseData || !Array.isArray(supabaseData)) return [];
  
  return supabaseData.map(item => ({
    id: item.id,
    userId: item.user_id,
    name: item.pseudo || item.name || "Anonyme",
    score: item.score,
    date: item.created_at ? formatDate(item.created_at) : "Récemment",
    timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
    email: item.email || "",
  }));
}

function updateStatsPanel(stats) {
  try {
    if (statsBestScore) {
      statsBestScore.textContent = `${stats.bestScore || 0}/100`;

      // Couleur selon le score
      if (stats.bestScore >= 90) {
        statsBestScore.style.color = "#4CAF50";
      } else if (stats.bestScore >= 70) {
        statsBestScore.style.color = "#2196F3";
      } else if (stats.bestScore >= 50) {
        statsBestScore.style.color = "#2b0743ff";
      } else {
        statsBestScore.style.color = "#f44336";
      }
    }

    if (statsTotalGames) {
      statsTotalGames.textContent = stats.totalGames || 0;
    }

    if (statsAverageScore) {
      statsAverageScore.textContent = `${stats.averageScore || 0}/100`;

      if (stats.averageScore >= 80) {
        statsAverageScore.style.color = "#4CAF50";
      } else if (stats.averageScore >= 60) {
        statsAverageScore.style.color = "#2196F3";
      } else if (stats.averageScore >= 40) {
        statsAverageScore.style.color = "#23083cff";
      } else {
        statsAverageScore.style.color = "#f44336";
      }
    }
  } catch (error) {
    console.error("❌ Erreur updateStatsPanel:", error);
  }
}

function updateRecentGamesList(games) {
  try {
    if (!recentGamesList) return;

    recentGamesList.innerHTML = "";

    if (!games || games.length === 0) {
      recentGamesList.innerHTML = `
                <div class="no-recent-games">
                    <i class="fa-solid fa-inbox"></i>
                    <p>Aucune partie récente</p>
                </div>
            `;
      return;
    }

    games.forEach((game, index) => {
      const gameItem = document.createElement("div");
      gameItem.className = "recent-game-item";

      if (index === 0) {
        gameItem.classList.add("new-entry");
        setTimeout(() => gameItem.classList.remove("new-entry"), 1000);
      }

      const gameDate = game.played_at || game.created_at;
      const formattedDate = formatGameDate(gameDate);

      gameItem.innerHTML = `
                <span class="recent-game-date">${formattedDate}</span>
                <span class="recent-game-score">${game.score}/100</span>
            `;

      const scoreElement = gameItem.querySelector(".recent-game-score");
      if (game.score >= 90) {
        scoreElement.style.color = "#4CAF50";
        scoreElement.innerHTML = `${game.score}/100 ⭐`;
      } else if (game.score >= 70) {
        scoreElement.style.color = "#2196F3";
      } else if (game.score >= 50) {
        scoreElement.style.color = "#30073bff";
      }

      recentGamesList.appendChild(gameItem);
    });
  } catch (error) {
    console.error("❌ Erreur updateRecentGamesList:", error);
  }
}

function formatGameDate(dateString) {
    try {
        if (!dateString) return "Récemment";
        
        const date = new Date(dateString);
        const now = new Date();
        
        // Réinitialiser les heures pour comparer uniquement les dates
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const gameDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        const diffTime = today - gameDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return "Aujourd'hui";
        } else if (diffDays === 1) {
            return "Hier";
        } else if (diffDays < 7) {
            return `Il y a ${diffDays} jours`;
        } else {
            return date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        }
    } catch (error) {
        return "Récemment";
    }
}

// ==================== FONCTIONS STATISTIQUES ====================
async function loadPlayerStats() {
  try {
    if (!window.supabaseFunctions || !window.supabaseFunctions.getPlayerStats) {
      return;
    }

    if (!currentUser || !currentUser.id) {
      resetPlayerStats();
      return;
    }

    const result = await window.supabaseFunctions.getPlayerStats(
      currentUser.id
    );

    if (result.success && result.data) {
      updatePlayerStatsDisplay(result.data);
    } else {
      resetPlayerStats();
    }
  } catch (error) {
    console.error("❌ Erreur chargement stats:", error);
    resetPlayerStats();
  }
}

function updatePlayerStatsDisplay(stats) {
  try {
    const bestScoreValue = document.getElementById("best-score-value");
    if (bestScoreValue) {
      bestScoreValue.textContent = stats.bestScore || 0;

      if (stats.bestScore > 0) {
        bestScoreValue.classList.add("score-improved");
        setTimeout(
          () => bestScoreValue.classList.remove("score-improved"),
          2000
        );
      }
    }

    const bestScoreDate = document.getElementById("best-score-date");
    if (bestScoreDate) {
      // CORRECTION CRITIQUE ICI :
      if (stats.bestDate) {
        // Utiliser formatDate pour l'affichage (sans "Aujourd'hui/Hier")
        bestScoreDate.textContent = formatDate(stats.bestDate);
        
        // OU si vous voulez "Hier/Aujourd'hui" :
        // bestScoreDate.textContent = formatGameDate(stats.bestDate);
      } else {
        bestScoreDate.textContent = "Jamais";
      }
    }

    const totalGames = document.getElementById("total-games");
    if (totalGames) {
      totalGames.textContent = stats.totalGames || 0;

      if (stats.totalGames === 1) {
        totalGames.classList.add("new-entry");
        setTimeout(() => totalGames.classList.remove("new-entry"), 2000);
      }
    }

    const averageScore = document.getElementById("average-score");
    if (averageScore) {
      averageScore.textContent = stats.averageScore || 0;
    }

    const recordMessage = document.getElementById("record-message");
    if (recordMessage) {
      if (stats.totalGames === 0) {
        recordMessage.innerHTML = `
                    <strong>🎯 Premier défi !</strong><br>
                    Complétez votre première partie pour établir votre record.
                `;
        recordMessage.style.display = "block";
      } else if (stats.bestScore >= 90) {
        recordMessage.innerHTML = `
                    <strong>🌟 Performance exceptionnelle !</strong><br>
                    Votre meilleur score est de ${stats.bestScore}/100. Continuez comme ça !</span>
                `;
        recordMessage.style.display = "block";
      } else if (stats.progression > 0) {
        recordMessage.innerHTML = `
                    <strong>📈 En progression !</strong><br>
                    Vous avez amélioré votre score de +${stats.progression} points depuis votre dernière partie.
                `;
        recordMessage.style.display = "block";
      } else {
        recordMessage.style.display = "none";
      }
    }
  } catch (error) {
    console.error("❌ Erreur mise à jour stats:", error);
  }
}

function resetPlayerStats() {
  try {
    const elements = {
      "best-score-value": "0",
      "best-score-date": "Jamais",
      "total-games": "0",
      "average-score": "0",
    };

    for (const [id, value] of Object.entries(elements)) {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    }

    const recordMessage = document.getElementById("record-message");
    if (recordMessage) {
      recordMessage.style.display = "none";
    }
  } catch (error) {
    console.error("❌ Erreur reset stats:", error);
  }
}

// ==================== FONCTIONS TEMPS RÉEL ====================
function setupRealTimeUpdates() {
  if (
    !window.supabaseFunctions ||
    !window.supabaseFunctions.subscribeToScores
  ) {
    return;
  }

  try {
    scoreSubscription =
      window.supabaseFunctions.subscribeToScores(handleScoreUpdate);

    if (scoreSubscription) {
    } else {
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'activation du temps réel:", error);
  }
}

function handleScoreUpdate(payload) {
  showUpdateNotification();

  setTimeout(() => {
    loadScoresFromSupabase(true);
    if (currentUser) {
      loadPlayerStats();
      loadRecentStats();
    }
  }, 1000);
}

function showUpdateNotification() {
  try {
    const existingNotification = document.querySelector(
      ".score-update-notification"
    );
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = "score-update-notification";
    notification.innerHTML = `
            <i class="fa-solid fa-sync-alt fa-spin"></i>
            <span>Classement mis à jour !</span>
        `;

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
            animation: slideDown 0.3s ease, fadeOut 0.3s ease 2s forwards;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 2500);
  } catch (error) {
    console.error("❌ Erreur création notification:", error);
  }
}

window.addEventListener("beforeunload", () => {
  if (
    scoreSubscription &&
    window.supabaseFunctions &&
    window.supabaseFunctions.unsubscribeFromScores
  ) {
    window.supabaseFunctions.unsubscribeFromScores(scoreSubscription);
  }
});

// ==================== FONCTIONS MODAL ====================
function showAuthModal() {
  try {
    if (authModal) {
      authModal.classList.add("active");
      if (loginEmailModal) loginEmailModal.value = "";
      if (loginPasswordModal) loginPasswordModal.value = "";
      if (registerPseudoModal) registerPseudoModal.value = "";
      if (registerEmailModal) registerEmailModal.value = "";
      if (registerPasswordModal) registerPasswordModal.value = "";
      if (registerConfirmModal) registerConfirmModal.value = "";

      if (
        loginTabModal &&
        registerTabModal &&
        loginFormModal &&
        registerFormModal
      ) {
        loginTabModal.classList.add("active");
        registerTabModal.classList.remove("active");
        loginFormModal.classList.add("active");
        registerFormModal.classList.remove("active");
      }
    }
  } catch (error) {
    console.error("❌ Erreur ouverture modal:", error);
  }
}

function hideAuthModal() {
  if (authModal) {
    authModal.classList.remove("active");
  }
}

// ==================== GESTION AUTHENTIFICATION ====================
async function handleLoginModal() {
  return new Promise(async (resolve) => {
    if (!loginEmailModal || !loginPasswordModal) {
      showMessage("⚠️ Erreur de formulaire", "error");
      resolve(false);
      return;
    }

    const email = loginEmailModal.value.trim();
    const password = loginPasswordModal.value;

    if (!email || !password) {
      showMessage("⚠️ Veuillez remplir tous les champs", "warning");
      resolve(false);
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("⚠️ Email invalide", "warning");
      resolve(false);
      return;
    }

    loginBtnModal.disabled = true;
    loginBtnModal.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Connexion...';

    try {
      const result = await window.supabaseFunctions.signInSupabase(
        email,
        password
      );

      if (result.success) {
        currentUser = {
          id: result.user.id,
          email: result.user.email,
          pseudo: result.user.user_metadata?.pseudo || email.split("@")[0],
          isLegendary: false // Initialisation
        };

        // Vérifier le statut légendaire
        try {
          const legendaryCheck = await checkIfUserIsLegendary(currentUser.id);
          currentUser.isLegendary = legendaryCheck;
          console.log(`👑 Statut légendaire après connexion: ${currentUser.isLegendary ? 'OUI' : 'NON'}`);
        } catch (legendaryError) {
          console.error("❌ Erreur vérification statut légendaire:", legendaryError);
          currentUser.isLegendary = false;
        }

        updateUserDisplay();
        loadScoresFromSupabase();
        loadPlayerStats();
        showMessage("✅ Connexion réussie !", "success");
        resolve(true);
      } else {
        showMessage(`❌ ${result.error}`, "error");
        resolve(false);
      }
    } catch (error) {
      showMessage("❌ Erreur de connexion", "error");
      console.error(error);
      resolve(false);
    } finally {
      loginBtnModal.disabled = false;
      loginBtnModal.innerHTML =
        '<i class="fa-solid fa-right-to-bracket"></i> SE CONNECTER';
    }
  });
}

async function handleRegisterModal() {
  return new Promise(async (resolve) => {
    if (
      !registerPseudoModal ||
      !registerEmailModal ||
      !registerPasswordModal ||
      !registerConfirmModal
    ) {
      showMessage("⚠️ Erreur de formulaire", "error");
      resolve(false);
      return;
    }

    const pseudo = registerPseudoModal.value.trim();
    const email = registerEmailModal.value.trim();
    const password = registerPasswordModal.value;
    const confirm = registerConfirmModal.value;

    if (!pseudo || !email || !password || !confirm) {
      showMessage("⚠️ Remplissez tous les champs", "warning");
      resolve(false);
      return;
    }

    if (pseudo.length > 10) {
      showMessage("⚠️ Pseudo trop long (max 10 caractères)", "warning");
      resolve(false);
      return;
    }

    if (password !== confirm) {
      showMessage("⚠️ Mots de passe différents", "warning");
      resolve(false);
      return;
    }

    if (password.length < 6) {
      showMessage("⚠️ Mot de passe trop court (6 caractères min)", "warning");
      resolve(false);
      return;
    }

    registerBtnModal.disabled = true;
    registerBtnModal.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Inscription...';

    try {
      const result = await window.supabaseFunctions.signUpSupabase(
        email,
        password,
        pseudo
      );

      if (result.success) {
        currentUser = {
          id: result.user.id,
          email: result.user.email,
          pseudo: result.user.user_metadata?.pseudo || pseudo,
          isLegendary: false // Nouveau compte = pas légendaire
        };

        updateUserDisplay();
        loadScoresFromSupabase();
        loadPlayerStats();
        showMessage("✅ Inscription réussie !", "success");
        resolve(true);
      } else {
        showMessage(`❌ ${result.error}`, "error");
        resolve(false);
      }
    } catch (error) {
      showMessage("❌ Erreur technique", "error");
      console.error(error);
      resolve(false);
    } finally {
      registerBtnModal.disabled = false;
      registerBtnModal.innerHTML =
        '<i class="fa-solid fa-user-plus"></i> S\'INSCRIRE';
    }
  });
}

async function handleLogout() {
  try {
    if (window.supabaseFunctions && window.supabaseFunctions.signOutSupabase) {
      const result = await window.supabaseFunctions.signOutSupabase();

      if (result.success) {
      } else {
      }
    }

    // Toujours réinitialiser l'état local
    currentUser = null;

    // Mettre à jour l'affichage
    updateUserDisplay();

    // Recharger les scores (pour montrer les scores publics)
    loadScoresFromSupabase();

    // Réinitialiser les stats
    resetPlayerStats();

    // Cacher le panel stats s'il est ouvert
    hideStatsPanel();

    showMessage("✅ Déconnexion réussie", "success");

    // Forcer un rechargement si nécessaire
    setTimeout(() => {
      if (
        document.getElementById("current-user-pseudo")?.textContent !== "Invité"
      ) {
        currentUser = null;
        updateUserDisplay();
      }
    }, 500);
  } catch (error) {
    console.error("❌ Erreur de déconnexion:", error);
    showMessage("❌ Erreur de déconnexion", "error");

    // En cas d'erreur, forcer quand même la déconnexion locale
    currentUser = null;
    updateUserDisplay();
  }
}

function updateUserDisplay() {
  try {
    if (currentUser) {
      // Utilisateur connecté
      if (currentUserPseudo) currentUserPseudo.textContent = currentUser.pseudo;
      if (currentUserEmail) currentUserEmail.textContent = currentUser.email;
      if (currentPlayerSpan) currentPlayerSpan.textContent = currentUser.pseudo;
      if (playerResultName) playerResultName.textContent = currentUser.pseudo;

      // Afficher l'icône stats
      if (statsIcon) {
        statsIcon.style.display = "flex";
        statsIcon.title = `Statistiques de ${currentUser.pseudo}`;
      }

      // Afficher bouton déconnexion, cacher connexion
      if (logoutBtn) {
        logoutBtn.style.display = "flex"; // Important: flex pour garder le style
      }
      if (loginBtnHeader) {
        loginBtnHeader.style.display = "none";
      }
    } else {
      // Utilisateur NON connecté (invité)
      if (currentUserPseudo) currentUserPseudo.textContent = "Invité";
      if (currentUserEmail)
        currentUserEmail.textContent = "Connectez-vous pour jouer";
      if (currentPlayerSpan) currentPlayerSpan.textContent = "Invité";
      if (playerResultName) playerResultName.textContent = "Invité";

      // Cacher l'icône stats
      if (statsIcon) {
        statsIcon.style.display = "none";
      }

      // Cacher bouton déconnexion, afficher connexion
      if (logoutBtn) {
        logoutBtn.style.display = "none";
      }
      if (loginBtnHeader) {
        loginBtnHeader.style.display = "flex"; // Important: flex pour garder le style
      }
    }

    updateConnectionMessage();
  } catch (error) {
    console.error("❌ Erreur updateUserDisplay:", error);
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ==================== FONCTIONS SUPABASE ====================
// ==================== FONCTIONS SUPABASE ====================
async function loadScoresFromSupabase(isUpdate = false) {
  try {
    if (
      !window.supabaseFunctions ||
      !window.supabaseFunctions.getHighScoresFromSupabase ||
      !window.supabaseFunctions.getLegendaryScores  // ← On va aussi charger les légendaires
    ) {
      displayDefaultScores();
      return;
    }

    // ⭐ CHANGEMENT CRITIQUE : Charger les DEUX classements
    const [generalResult, legendaryResult] = await Promise.all([
      // 1. Classement général (sans légendaires)
      window.supabaseFunctions.getHighScoresFromSupabase(50),
      
      // 2. Hall of Legends (uniquement légendaires)
      window.supabaseFunctions.getLegendaryScores(10)
    ]);

    // ===== 1. GESTION CLASSEMENT GÉNÉRAL =====
    if (generalResult.success && generalResult.data) {
      const oldScores = [...allHighscores];
      allHighscores = generalResult.data.map((item) => ({
        id: item.id,
        userId: item.user_id,
        name: item.pseudo || "Anonyme",
        score: item.score,
        date: item.created_at ? formatDate(item.created_at) : "Aujourd'hui",
        timestamp: item.created_at
          ? new Date(item.created_at).getTime()
          : Date.now(),
        isLegendary: item.est_legendaire || false  // ← Ajouté
      }));

      if (isUpdate && oldScores.length > 0) {
        animateScoreChanges(oldScores, allHighscores);
      }

      updateHighscoresDisplay(isUpdate);
      updateHighscoresResultDisplay(isUpdate);

      // Debug
      console.log(`📊 Classement général mis à jour : ${allHighscores.length} joueurs`);
    } else {
      displayDefaultScores();
    }

    // ===== 2. GESTION HALL OF LEGENDS =====
    if (legendaryResult.success && legendaryResult.data) {
      legendaryScores = legendaryResult.data;
      
      console.log(`👑 Hall of Legends : ${legendaryScores.length} légendaires`);
      legendaryScores.forEach((score, i) => {
        console.log(`   ${i+1}. ${score.pseudo} - ${score.displayTime || score.temps_total}s - ${score.vies_restantes || 0} vies`);
      });
      
      // Mettre à jour l'affichage du bouton Hall of Legends
      updateLegendaryButton();
      
    } else {
      legendaryScores = [];
      console.log("⚠️ Aucun score légendaire trouvé");
    }

    // ===== 3. Mettre à jour le rang si l'utilisateur est connecté =====
    if (
      currentUser &&
      statsPanel &&
      statsPanel.classList.contains("active")
    ) {
      const ranking = getUserRankingPosition(currentUser.id, allHighscores);
      updateRankingDisplay(ranking);
    }
    
  } catch (error) {
    console.error("❌ Erreur chargement scores:", error);
    displayDefaultScores();
  }
}

// NOUVELLE FONCTION : Mettre à jour le bouton Hall of Legends
function updateLegendaryButton() {
  const showLegendaryBtn = document.getElementById('show-legendary-ranking');
  
  if (!showLegendaryBtn) {
    console.log("⚠️ Bouton Hall of Legends non trouvé");
    return;
  }
  
  if (legendaryScores.length > 0) {
    // Afficher le bouton avec le nombre de légendaires
    showLegendaryBtn.style.display = 'block';
    showLegendaryBtn.innerHTML = `
      <i class="fa-solid fa-crown" style="color: #FFD700;"></i>
      <span>Hall of Legends</span>
      <span style="
        background: #FFD700;
        color: #000;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 12px;
        margin-left: 8px;
        font-weight: bold;
      ">${legendaryScores.length}</span>
    `;
    
    console.log(`✅ Bouton Hall of Legends mis à jour : ${legendaryScores.length} légendaires`);
  } else {
    // Cacher le bouton s'il n'y a pas de légendaires
    showLegendaryBtn.style.display = 'none';
    console.log("ℹ️ Bouton Hall of Legends caché (aucun légendaire)");
  }
}

// NOUVELLE FONCTION : Vérifier et charger les scores légendaires
async function checkAndLoadLegendaryScores() {
  try {
    // Vérifier si la fonction existe
    if (!window.supabaseFunctions || !window.supabaseFunctions.getLegendaryScores) {
      console.log("⚠️ Fonction getLegendaryScores non disponible");
      hideLegendaryButton();
      return;
    }

    // Charger les scores légendaires
    const legendaryResult = await window.supabaseFunctions.getLegendaryScores(1);
    
    if (legendaryResult.success && legendaryResult.data) {
      // Stocker les scores légendaires
      legendaryScores = legendaryResult.data;
      
      // Afficher ou cacher le bouton Hall of Legends
      const showLegendaryBtn = document.getElementById('show-legendary-ranking');
      if (showLegendaryBtn) {
        if (legendaryScores.length > 0) {
          // Afficher le bouton
          showLegendaryBtn.style.display = 'block';
          showLegendaryBtn.innerHTML = `
            <i class="fa-solid fa-crown"></i> Hall of Legends (${legendaryScores.length}+)
          `;
          console.log(`✅ Bouton Hall of Legends affiché (${legendaryScores.length} légendaires)`);
        } else {
          // Cacher le bouton
          hideLegendaryButton();
        }
      }
    } else {
      hideLegendaryButton();
    }
  } catch (error) {
    console.error("❌ Erreur chargement scores légendaires:", error);
    hideLegendaryButton();
  }
}

// NOUVELLE FONCTION : Cacher le bouton Hall of Legends
function hideLegendaryButton() {
  const showLegendaryBtn = document.getElementById('show-legendary-ranking');
  if (showLegendaryBtn) {
    showLegendaryBtn.style.display = 'none';
  }
}

function displayDefaultScores() {
  updateHighscoresDisplay();
  updateHighscoresResultDisplay();
}

function animateScoreChanges(oldScores, newScores) {
  const newEntries = newScores.filter(
    (newScore) => !oldScores.some((oldScore) => oldScore.id === newScore.id)
  );

  const improvedScores = newScores.filter((newScore) => {
    const oldScore = oldScores.find((old) => old.id === newScore.id);
    return oldScore && newScore.score > oldScore.score;
  });

  newEntries.forEach((score) => {
    const element = document.querySelector(`[data-score-id="${score.id}"]`);
    if (element) {
      element.classList.add("new-entry");
      setTimeout(() => element.classList.remove("new-entry"), 2000);
    }
  });

  improvedScores.forEach((score) => {
    const element = document.querySelector(`[data-score-id="${score.id}"]`);
    if (element) {
      element.classList.add("score-improved");
      setTimeout(() => element.classList.remove("score-improved"), 2000);
    }
  });
}

async function saveScoreToSupabase(score) {
  try {
    if (
      !window.supabaseFunctions ||
      !window.supabaseFunctions.saveScoreToSupabase
    ) {
      throw new Error("Fonctions Supabase non disponibles");
    }

    if (!currentUser || !currentUser.id) {
      throw new Error("Utilisateur non connecté");
    }

    const result = await window.supabaseFunctions.saveScoreToSupabase(
      score,
      currentUser.id,
      currentUser.pseudo,
      currentUser.email || ""
    );

    if (result.success) {
      displayPersonalizedMessage(result);

      setTimeout(() => {
        loadPlayerStats();
        loadScoresFromSupabase(true);
        loadRecentStats();
      }, 1000);

      return result;
    } else {
      console.error("❌ Erreur Supabase:", result.error);
      throw new Error(result.error || "Erreur inconnue");
    }
  } catch (error) {
    console.error("❌ Erreur sauvegarde:", error);
    return { success: false, error: error.message };
  }
}

// ==================== FONCTIONS DU QUIZ ====================
function startQuiz() {
  if (!currentUser) {
    showAuthModal();
    showMessage("🔒 Connectez-vous pour jouer", "warning");
    return;
  }

  startQuizGame();
}

function startQuizGame() {
  // SON DE DÉMARRAGE DU JEU
  if (window.audioManager) {
    window.audioManager.playSound('gameStart');
  }
  
  lives = 2;
  currentQuestionIndex = 0;
  score = 0;
  gameStopped = false;
  
  // NOUVEAU : Initialiser le chronomètre pour le système légendaire
  startTime = Date.now();
  totalTime = 0;

  // Réinitialiser les compteurs de notifications
  if (window.gameNotifications && window.gameNotifications.resetTargetNotifications) {
    window.gameNotifications.resetTargetNotifications();
  }
  
  // Message de début
  setTimeout(() => {
    if (window.gameNotifications?.showInGameNotification) {
      window.gameNotifications.showInGameNotification(
        "💪 Le défi commence ! Bonne chance !",
        "success",
        2000
      );
    }
  }, 500);

  livesDisplay = document.getElementById("lives-display");
  livesCount = document.getElementById("lives-count");

  if (livesCount) livesCount.textContent = lives;
  if (livesDisplay) updateLivesDisplay();
  if (scoreSpan) scoreSpan.textContent = score;

  quizSession = getRandomQuiz(quizQuestions, TOTAL_QUESTIONS);

  if (totalQuestionsSpan) totalQuestionsSpan.textContent = quizSession.length;

  showScreen("quiz");
  showQuestion();
}

function getRandomQuiz(quizQuestions, numQuestions = TOTAL_QUESTIONS) {
  const shuffled = [...quizQuestions];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
}

function showQuestion() {
  if (gameStopped) return;

  answersDisabled = false;
  timeLeft = 10;

  if (timerDisplay) {
    timerDisplay.textContent = timeLeft;
    timerDisplay.style.color = "#ffffff";
  }

  if (timer) clearInterval(timer);
  timer = setInterval(updateTimer, 1000);

  const currentQuestion = quizSession[currentQuestionIndex];

  if (currentQuestionSpan)
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

  if (progressBar) {
    const progressPercent =
      ((currentQuestionIndex + 1) / quizSession.length) * 100;
    progressBar.style.width = progressPercent + "%";
    if (progressPercentSpan)
      progressPercentSpan.textContent = Math.round(progressPercent) + "%";
  }

  if (questionText) questionText.textContent = currentQuestion.question;

  if (answersContainer) {
    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.textContent = answer.text;
      button.classList.add("answer-btn");
      button.dataset.correct = answer.correct;
      button.style.animationDelay = `${index * 0.1}s`;
      button.classList.add("fade-in");
      button.addEventListener("click", selectAnswer);
      answersContainer.appendChild(button);
    });
  }
}

function updateTimer() {
  timeLeft--;

  if (timerDisplay) {
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 3) {
      timerDisplay.style.color = "#ffffffff";
      timerDisplay.style.fontWeight = "bold";
    } else if (timeLeft <= 5) {
      timerDisplay.style.color = "#ffffffff";
    }
  }

  if (timeLeft <= 0) {
    clearInterval(timer);
    wrongAnswer();
  }
}

function selectAnswer(event) {
  if (answersDisabled || gameStopped) return;

  clearInterval(timer);
  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";
  
  // JOUER LE SON CORRESPONDANT
  if (window.audioManager) {
    if (isCorrect) {
      window.audioManager.playSound('correct');
    } else {
      window.audioManager.playSound('wrong');
    }
  }

  if (answersContainer) {
    Array.from(answersContainer.children).forEach((button) => {
      if (button.dataset.correct === "true") {
        button.classList.add("correct");
      } else {
        button.classList.add("incorrect");
      }
    });
  }

  if (isCorrect) {
    score++;
    
    // SON MILESTONE : Quand on atteint exactement 50 points !
    if (score === 50 && window.audioManager) {
      window.audioManager.playSound('milestone');
    }
    
    if (scoreSpan) scoreSpan.textContent = score;

    setTimeout(() => {
      if (!gameStopped) {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizSession.length) {
          showQuestion();
        } else {
          showResults();
        }
      }
    }, 1500);
  } else {
    wrongAnswer();
  }
}

function wrongAnswer() {
  if (lives > 1) {
    lives--;
    updateLivesDisplay();
    shakeLivesDisplay();

    setTimeout(() => {
      answersDisabled = false;
      currentQuestionIndex++;
      if (currentQuestionIndex < quizSession.length) {
        showQuestion();
      } else {
        showResults();
      }
    }, 1500);
  } else if (lives === 1) {
    lives--;
    updateLivesDisplay();

    if (livesDisplay) {
      livesDisplay.style.background =
        "linear-gradient(135deg, #ff4444 0%, #cc0000 100%)";
      livesDisplay.classList.add("shake");
    }

    if (livesCount) livesCount.textContent = "0";

    gameStopped = true;
    clearInterval(timer);

    setTimeout(() => {
      showFinalResults();
    }, 1500);
  }
}

function showFinalResults() {
  showScreen("result");

  const finalScore = Math.round((score / TOTAL_QUESTIONS) * 100);
  
  // SON GAME-OVER si score < 30
  if (finalScore < 30 && window.audioManager) {
    window.audioManager.playSound('gameOver');
  }

  if (finalScoreSpan) finalScoreSpan.textContent = finalScore;
  if (questionsDoneSpan) questionsDoneSpan.textContent = score;
  if (percentageSpan) percentageSpan.textContent = finalScore + "%";

  if (resultMessage) {
    let message = "";
    if (score === 0) {
      message = "😢 Aucune bonne réponse... Essayez encore !";
    } else if (finalScore < 30) {
      message = "💔 Plus de vies ! Continue à t'entraîner !";
    } else if (finalScore < 50) {
      message = "👊 Dommage ! Bon effort !";
    } else if (finalScore < 70) {
      message = "👍 Bien joué ! Bon score !";
    } else if (finalScore < 90) {
      message = "🌟 Excellent performance !";
    } else {
      message = "🏆 Impressionnant ! Presque parfait !";
    }
    resultMessage.textContent = message;
  }

  if (currentUser) {
    saveScoreToSupabase(finalScore).then((saveResult) => {
      if (saveResult.success) {
        if (saveResult.action === "updated") {
          showMessage("🎉 Nouveau record personnel !", "success");
        } else if (saveResult.action === "inserted") {
          showMessage("✅ Score enregistré !", "success");
        }
      } else {
        showMessage(`❌ Échec sauvegarde: ${saveResult.error}`, "error");
      }
    });
  }

  updateHighscoresResultDisplay();
}

function showResults() {
  clearInterval(timer);
  
  // NOUVEAU : Calculer le temps total
  totalTime = Math.floor((Date.now() - startTime) / 1000);
  
  // Détecter si c'est un score légendaire
  const isPerfectScore = (score === TOTAL_QUESTIONS);
  const isLegendaryScore = (isPerfectScore && lives > 0);
  
  console.log(`🏆 Score: ${score}/100, Vies: ${lives}, Temps: ${totalTime}s, Légendaire: ${isLegendaryScore}`);
  
  showScreen("result");
  
  const finalScore = 100;
  
  if (finalScoreSpan) finalScoreSpan.textContent = finalScore;
  if (questionsDoneSpan) questionsDoneSpan.textContent = TOTAL_QUESTIONS;
  if (percentageSpan) percentageSpan.textContent = "100%";
  
  if (resultMessage) {
    if (isLegendaryScore) {
      resultMessage.textContent = `🌟 LÉGENDAIRE ! 100/100 avec ${lives} vie${lives > 1 ? 's' : ''} restante${lives > 1 ? 's' : ''} !`;
      resultMessage.style.color = "#FFD700";
      resultMessage.style.fontWeight = "bold";
      
      // Notification spéciale légendaire
      if (window.gameNotifications?.showInGameNotification) {
        window.gameNotifications.showInGameNotification(
          "🏆 ENTRÉE DANS LE HALL OF LEGENDS !",
          "legendary",
          4000
        );
      }
    } else {
      resultMessage.textContent = lives > 0 
        ? `🎉 INCROYABLE ! 100/100 ! ${lives} vie${lives > 1 ? 's' : ''} restante${lives > 1 ? 's' : ''} ! 🏆`
        : "🎉 CHAMPION ! 100/100 ! 🏆";
      
      // Notification normale
      if (window.gameNotifications?.showInGameNotification) {
        window.gameNotifications.showInGameNotification(
          "🎉 Score parfait atteint !",
          "success",
          3000
        );
      }
    }
  }
  
  // NOUVEAU : Si score légendaire, afficher la notification spéciale
  if (isLegendaryScore) {
    setTimeout(() => {
      showLegendaryNotification(lives, totalTime);
    }, 1500);
  }
  
  // Arrêter la musique et jouer son de victoire
  if (isAudioEnabled()) {
    stopBackgroundMusic();
    if (isLegendaryScore) {
      playVictory();
    } else {
      playGameOver();
    }
  }
  
  // NOUVEAU : Sauvegarder avec paramètres légendaires
  if (currentUser) {
    saveScoreToSupabase(
      finalScore,
      currentUser.id,
      currentUser.pseudo,
      currentUser.email || '',
      isLegendaryScore, // est_legendaire
      lives,            // vies_restantes
      totalTime         // temps_total
    ).then(saveResult => {
      if (saveResult.success) {
        if (isLegendaryScore) {
          // ⭐ IMPORTANT : Marquer l'utilisateur comme légendaire
          currentUser.isLegendary = true;
          console.log("👑 Joueur marqué comme légendaire !");
          
          // Mettre à jour l'affichage du panel stats si ouvert
          if (statsPanel && statsPanel.classList.contains("active")) {
            setTimeout(() => {
              loadRecentStats();
            }, 1000);
          }
          
          // Message déjà affiché par la notification
          // Charger les scores légendaires
          setTimeout(() => {
            loadScoresFromSupabase();
          }, 2000);
          
        } else if (saveResult.action === 'updated') {
          // Message normal pour amélioration de score
          showMessage("🎉 Score amélioré !", "success");
        } else if (saveResult.action === 'inserted') {
          // Message normal pour premier score
          showMessage("✅ Score enregistré !", "success");
        }
      } else {
        if (window.gameNotifications?.showInGameNotification) {
          window.gameNotifications.showInGameNotification(
            "❌ Erreur sauvegarde",
            "error",
            3000
          );
        }
      }
    }).catch(error => {
      console.error("❌ Erreur sauvegarde score:", error);
      showMessage("❌ Erreur sauvegarde", "error");
    });
  }
  
  updateHighscoresResultDisplay();
}

// ==================== FONCTIONS UTILITAIRES ====================
function updateLivesDisplay() {
  if (livesCount) livesCount.textContent = lives;

  if (livesDisplay) {
    if (lives === 2) {
      livesDisplay.style.background =
        "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)";
      livesDisplay.style.padding = "10px 20px";
      livesDisplay.style.borderRadius = "20px";
    } else if (lives === 1) {
      livesDisplay.style.background =
        "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)";
    } else {
      livesDisplay.style.background =
        "linear-gradient(135deg, #ff4444 0%, #cc0000 100%)";
    }
  }
}

function displayPersonalizedMessage(result) {
  if (!result || !result.success) return;

  let message = "";
  let messageType = "info";

  switch (result.messageType) {
    case "first_time":
      if (result.details?.isPerfect) {
        message = "🎯 PERFECTION ABSOLUE ! Premier score : 100/100 ! 🌟";
        messageType = "success";
      } else {
        message = `✅ Premier score enregistré : ${result.newScore}/100 ! Bienvenue !`;
        messageType = "success";
      }
      break;

    case "record_beaten":
      const improvement = result.details?.improvement || 0;
      const level = result.details?.level || "small";

      if (result.details?.isPerfect) {
        message = "🏆 RECORD ABSOLU ATTEINT ! 100/100 - LÉGENDAIRE !";
        messageType = "success";
      } else {
        switch (level) {
          case "huge":
            message = `🚀 EXPLOSION ! +${improvement} points - NOUVEAU RECORD !`;
            break;
          case "major":
            message = `🔥 PROGRESSION MAJEURE ! +${improvement} points - Record battu !`;
            break;
          case "good":
            message = `📈 BONNE AMÉLIORATION ! +${improvement} points - Meilleur score !`;
            break;
          default:
            message = `👍 PROGRESSION ! +${improvement} points - Record amélioré !`;
        }
        messageType = "success";
      }
      break;

    case "equal_score":
      message = `⚖️ SCORE IDENTIQUE : ${result.newScore}/100 - Votre record tient bon !`;
      messageType = "info";
      break;

    case "lower_score":
      const difference = result.details?.difference || 0;
      const needed = result.details?.needed || 1;

      if (difference > 20) {
        message = `💪 VOTRE RECORD RESTE : ${result.previousScore}/100 - Gardez la motivation !`;
      } else if (difference > 10) {
        message = `🛡️ PRESQUE ! Record : ${result.previousScore}/100 - Manqué de ${difference} points`;
      } else {
        message = `🎯 TOUT PRÈS ! Record : ${
          result.previousScore
        }/100 - Il vous faut ${needed} point${needed > 1 ? "s" : ""} de plus !`;
      }
      messageType = "warning";
      break;

    default:
      message = "✅ Score traité !";
      messageType = "info";
  }

  showMessage(message, messageType);

  if (result.messageType === "record_beaten" && result.details) {
    setTimeout(() => {
      const improvement = result.details.improvement;
      const percentage = result.details.percentage;

      let detailMessage = `📊 Progression : ${result.previousScore} → ${result.newScore} (+${improvement} pts, +${percentage}%)`;

      if (improvement >= 20) {
        detailMessage += " 🏅";
      } else if (improvement >= 10) {
        detailMessage += " ⭐";
      }

      showMessage(detailMessage, "info");
    }, 1500);
  }
}

function shakeLivesDisplay() {
  if (livesDisplay) {
    livesDisplay.classList.add("shake");
    setTimeout(() => livesDisplay.classList.remove("shake"), 500);
  }
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    return "Aujourd'hui";
  }
}

function showScreen(screenName) {
  try {
    if (startScreen) startScreen.classList.remove("active");
    if (quizScreen) quizScreen.classList.remove("active");
    if (resultScreen) resultScreen.classList.remove("active");

    switch (screenName) {
      case "start":
        if (startScreen) startScreen.classList.add("active");
        break;
      case "quiz":
        if (quizScreen) quizScreen.classList.add("active");
        break;
      case "result":
        if (resultScreen) resultScreen.classList.add("active");
        break;
    }
  } catch (error) {
    console.error("❌ Erreur showScreen:", error);
  }
}

function showMessage(text, type = "info") {
  try {
    const oldMessages = document.querySelectorAll(".quiz-message");
    oldMessages.forEach((msg) => msg.remove());

    const message = document.createElement("div");
    message.className = `quiz-message ${type}`;
    message.textContent = text;
    message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;

    if (type === "success") {
      message.style.backgroundColor = "#4CAF50";
    } else if (type === "error") {
      message.style.backgroundColor = "#f44336";
    } else if (type === "warning") {
      message.style.backgroundColor = "#310d64ff";
    } else {
      message.style.backgroundColor = "#2196F3";
    }

    document.body.appendChild(message);

    setTimeout(() => {
      message.style.opacity = "1";
      message.style.transform = "translateX(0)";
    }, 10);

    setTimeout(() => {
      message.style.opacity = "0";
      message.style.transform = "translateX(100px)";
      setTimeout(() => {
        if (message.parentNode) {
          message.remove();
        }
      }, 300);
    }, 4000);
  } catch (error) {
    console.error("❌ Erreur showMessage:", error);
  }
}

// ==================== FONCTIONS POUR LES HIGH SCORES (ÉCRAN DÉMARRAGE) ====================
function updateHighscoresDisplay(isUpdate = false) {
  try {
    if (!highscoresListStart || !showMoreScoresBtn) return;

    highscoresListStart.innerHTML = "";

    if (allHighscores.length === 0) {
      highscoresListStart.innerHTML = `
                <div class="no-scores">
                    <p><i class="fa-regular fa-trophy"></i> Aucun champion encore</p>
                    <p>Soyez le premier !</p>
                </div>
            `;
      showMoreScoresBtn.style.display = "none";
      return;
    }

    // Ajuster l'affichage selon l'état d'expansion
    const scoresToShow = isExpandedStart
      ? allHighscores
      : allHighscores.slice(0, visibleScoresCount);

    if (allHighscores.length > visibleScoresCount) {
      showMoreScoresBtn.innerHTML = isExpandedStart
        ? "👆 Voir moins"
        : `👇 Voir plus de champions (${scoresToShow.length}/${allHighscores.length})`;
      showMoreScoresBtn.style.display = "block";
    } else {
      showMoreScoresBtn.style.display = "none";
    }

    // Afficher les scores
    scoresToShow.forEach((scoreData, index) => {
      const scoreElement = document.createElement("div");
      scoreElement.className = "highscore-item";
      scoreElement.dataset.scoreId = scoreData.id;
      scoreElement.dataset.userId = scoreData.userId;

      if (isUpdate) {
        scoreElement.classList.add("update-animation");
      }

      if (index === 0) {
        scoreElement.classList.add("first-place");
      } else if (index === 1) {
        scoreElement.classList.add("second-place");
      } else if (index === 2) {
        scoreElement.classList.add("third-place");
      }

      let rankIcon = `${index + 1}.`;
      if (index === 0) rankIcon = "🥇";
      if (index === 1) rankIcon = "🥈";
      if (index === 2) rankIcon = "🥉";

      scoreElement.innerHTML = `
                <div class="highscore-rank">${rankIcon}</div>
                <div class="highscore-name">${scoreData.name}</div>
                <div class="highscore-score">${scoreData.score}/100</div>
                <div class="highscore-date">${scoreData.date}</div>
            `;

      highscoresListStart.appendChild(scoreElement);
    });
  } catch (error) {
    console.error("❌ Erreur updateHighscoresDisplay:", error);
  }
}

// ==================== FONCTIONS POUR LES HIGH SCORES (ÉCRAN RÉSULTATS) ====================
function updateHighscoresResultDisplay(isUpdate = false) {
  try {
    if (!highscoresListResult || !showMoreScoresResultBtn) return;

    highscoresListResult.innerHTML = "";

    if (allHighscores.length === 0) {
      highscoresListResult.innerHTML =
        '<div class="no-scores"><p>🏆 Aucun score enregistré</p></div>';
      showMoreScoresResultBtn.style.display = "none";
      return;
    }

    const scoresToShow = isExpandedResult
      ? allHighscores
      : allHighscores.slice(0, visibleScoresCount);

    if (allHighscores.length > visibleScoresCount) {
      showMoreScoresResultBtn.innerHTML = isExpandedResult
        ? "👆 Voir moins"
        : `👇 Voir plus de champions (${scoresToShow.length}/${allHighscores.length})`;
      showMoreScoresResultBtn.style.display = "block";
    } else {
      showMoreScoresResultBtn.style.display = "none";
    }

    scoresToShow.forEach((scoreData, index) => {
      const scoreElement = document.createElement("div");
      scoreElement.className = "highscore-item";
      scoreElement.dataset.scoreId = scoreData.id;
      scoreElement.dataset.userId = scoreData.userId;

      if (isUpdate) {
        scoreElement.classList.add("update-animation");
      }

      if (index === 0) {
        scoreElement.classList.add("first-place");
      } else if (index === 1) {
        scoreElement.classList.add("second-place");
      } else if (index === 2) {
        scoreElement.classList.add("third-place");
      }

      let rankIcon = `${index + 1}.`;
      if (index === 0) rankIcon = "🥇";
      if (index === 1) rankIcon = "🥈";
      if (index === 2) rankIcon = "🥉";

      scoreElement.innerHTML = `
                <div class="highscore-rank">${rankIcon}</div>
                <div class="highscore-name">${scoreData.name}</div>
                <div class="highscore-score">${scoreData.score}/100</div>
                <div class="highscore-date">${scoreData.date}</div>
            `;

      highscoresListResult.appendChild(scoreElement);
    });
  } catch (error) {
    console.error("❌ Erreur updateHighscoresResultDisplay:", error);
  }
}

function restartQuiz() {
  if (currentUser) {
    loadPlayerStats();
  }

  lives = 2;
  currentQuestionIndex = 0;
  score = 0;
  gameStopped = false;

  startQuiz();
}

// ==================== FONCTION POUR METTRE À JOUR LE MESSAGE DE CONNEXION ====================
function updateConnectionMessage() {
  try {
    const connectionMessage = document.getElementById(
      "connection-status-message"
    );
    if (!connectionMessage) {
      return;
    }

    if (currentUser) {
      connectionMessage.textContent = `✅ Connecté : ${currentUser.pseudo}`;
      connectionMessage.className = "connection-status connected";
    } else {
      connectionMessage.textContent =
        "* Connectez-vous pour sauvegarder votre score";
      connectionMessage.className = "connection-status not-connected";
    }
  } catch (error) {
    console.error("❌ Erreur updateConnectionMessage:", error);
  }
}

// ==================== FONCTION CALCUL RANG AMÉLIORÉE ====================
// ==================== FONCTION CALCUL RANG (VERSION COMPLÈTE AVEC LÉGENDAIRES) ====================
async function getUserRankingPosition(userId, highscores) {
    if (!userId || !highscores || highscores.length === 0) {
        return {
            position: null,
            estimatedPosition: null,
            total: 50,
            score: 0,
            top50Score: 0,
            top10Score: 0,
            top5Score: 0,
            distanceToTop50: 0,
            distanceToTop10: 0,
            distanceToTop5: 0,
            category: "outside",
            isInTop: false,
            isLegendary: false,
            needsMoreData: true,
            loading: false,
            error: false
        };
    }

    // 1. VÉRIFIER SI L'UTILISATEUR EST LÉGENDAIRE
    const userIsLegendary = await checkIfUserIsLegendary(userId);
    
    if (userIsLegendary) {
        // 2. CAS LÉGENDAIRE : Récupérer le rang dans le Hall of Fame
        try {
            const legendaryRank = await getLegendaryUserRank(userId);
            
            return {
                position: legendaryRank.rank,
                estimatedPosition: legendaryRank.rank,
                total: legendaryRank.total || 1,
                score: 100,  // Forcément 100/100 pour un légendaire
                top50Score: 0,
                top10Score: 0,
                top5Score: 0,
                distanceToTop50: 0,
                distanceToTop10: 0,
                distanceToTop5: 0,
                category: "legendary",  // NOUVELLE CATÉGORIE
                isInTop: true,
                isLegendary: true,
                isFirst: legendaryRank.rank === 1,
                isTopThree: legendaryRank.rank <= 3,
                isTopTen: legendaryRank.rank <= 10,
                nextMilestone: getLegendaryNextMilestone(legendaryRank.rank, legendaryRank.total),
                pointsToNextMilestone: 0,
                needsMoreData: false,
                loading: false,
                error: false,
                // Informations légendaires supplémentaires
                legendaryTime: legendaryRank.time,
                legendaryLives: legendaryRank.lives,
                legendaryDate: legendaryRank.date,
                displayText: `👑 Rang ${legendaryRank.rank} dans le Hall of Fame`,
                displayCategory: "Hall of Fame",
                icon: "👑",
                color: "#FFD700"
            };
        } catch (error) {
            console.error("❌ Erreur récupération rang légendaire:", error);
            // Fallback pour légendaire
            return {
                position: 1,
                estimatedPosition: 1,
                total: 1,
                score: 100,
                category: "legendary",
                isInTop: true,
                isLegendary: true,
                needsMoreData: false,
                loading: false,
                error: false,
                displayText: "👑 Membre du Hall of Fame",
                displayCategory: "Hall of Fame",
                icon: "👑",
                color: "#FFD700"
            };
        }
    }

    // 3. CAS NON LÉGENDAIRE : Logique originale
    const scoresToCheck = [...highscores];
    const totalScores = scoresToCheck.length;
    
    // Trier par score décroissant
    const sortedScores = [...scoresToCheck].sort((a, b) => b.score - a.score);
    
    // Trouver la position exacte dans le top 50
    const exactPosition = sortedScores.findIndex((score) => score.userId === userId);
    
    // Récupérer le score de l'utilisateur
    let userScore = 0;
    if (exactPosition !== -1) {
        userScore = sortedScores[exactPosition].score;
    } else {
        // Si l'utilisateur n'est pas dans le top 50, récupérer son meilleur score
        if (window.currentUser?.bestScore) {
            userScore = window.currentUser.bestScore;
        }
    }
    
    // Scores des paliers
    const top5Score = sortedScores.length > 4 ? sortedScores[4].score : 100;
    const top10Score = sortedScores.length > 9 ? sortedScores[9].score : 100;
    const top50Score = sortedScores.length > 49 ? sortedScores[49].score : 0;
    
    // Calculer les distances
    const distanceToTop50 = top50Score > 0 ? top50Score - userScore : 0;
    const distanceToTop10 = top10Score - userScore;
    const distanceToTop5 = top5Score - userScore;
    
    // Déterminer la catégorie
    let category = "outside";
    let position = exactPosition !== -1 ? exactPosition + 1 : null;
    let estimatedPosition = position;
    
    if (exactPosition !== -1) {
        if (exactPosition < 5) category = "top5";
        else if (exactPosition < 10) category = "top10";
        else if (exactPosition < 50) category = "top50";
        else category = "outside";
    } else {
        // Estimation pour les hors top 50
        category = "outside";
        
        // Estimation basée sur le score
        if (top50Score > 0 && userScore > 0) {
            // Logique d'estimation : chaque point = ~2 places
            const scoreDifference = top50Score - userScore;
            if (scoreDifference > 0) {
                estimatedPosition = 50 + Math.ceil(scoreDifference / 2);
            } else {
                estimatedPosition = 51; // Juste en dehors du top 50
            }
        } else {
            estimatedPosition = 51; // Position par défaut
        }
        
        // Limiter à 200 maximum pour le réalisme
        estimatedPosition = Math.min(estimatedPosition, 200);
    }
    
    // Trouver le prochain objectif
    let nextMilestone = "";
    let pointsToNextMilestone = 0;
    
    if (category === "outside") {
        nextMilestone = "Top 50";
        pointsToNextMilestone = Math.max(1, distanceToTop50 + 1);
    } else if (category === "top50") {
        if (position <= 20) {
            nextMilestone = "Top 10";
            pointsToNextMilestone = Math.max(1, distanceToTop10 + 1);
        } else {
            nextMilestone = "Top 20";
            // Estimer le score du 20ème
            const top20Score = sortedScores.length > 19 ? sortedScores[19].score : 80;
            pointsToNextMilestone = Math.max(1, top20Score - userScore + 1);
        }
    } else if (category === "top10") {
        nextMilestone = "Top 5";
        pointsToNextMilestone = Math.max(1, distanceToTop5 + 1);
    } else if (category === "top5") {
        if (position === 1) {
            nextMilestone = "Maintenir la 1ère place";
            pointsToNextMilestone = 0;
        } else {
            nextMilestone = `Top ${position - 1}`;
            const targetScore = sortedScores[position - 2].score;
            pointsToNextMilestone = Math.max(1, targetScore - userScore + 1);
        }
    }
    
    return {
        position: position,
        estimatedPosition: estimatedPosition,
        total: 50,
        score: userScore,
        top50Score: top50Score,
        top10Score: top10Score,
        top5Score: top5Score,
        distanceToTop50: distanceToTop50,
        distanceToTop10: distanceToTop10,
        distanceToTop5: distanceToTop5,
        category: category,
        isInTop: exactPosition !== -1,
        isLegendary: false,  // Non légendaire
        isFirst: exactPosition === 0,
        isTopThree: exactPosition < 3,
        isTopTen: exactPosition < 10,
        nextMilestone: nextMilestone,
        pointsToNextMilestone: pointsToNextMilestone,
        needsMoreData: sortedScores.length < 10,
        loading: false,
        error: false
    };
}

// ==================== FONCTIONS UTILITAIRES POUR LES LÉGENDAIRES ====================

// Vérifier si un utilisateur est légendaire
async function checkIfUserIsLegendary(userId) {
    try {
        if (!window.supabaseFunctions || !window.supabaseFunctions.getUserLegendaryRank) {
            // Fallback : vérifier dans les données locales
            return currentUser?.isLegendary || false;
        }
        
        const result = await window.supabaseFunctions.getUserLegendaryRank(userId);
        return result.success && result.isLegendary;
        
    } catch (error) {
        console.error("❌ Erreur vérification statut légendaire:", error);
        return currentUser?.isLegendary || false;
    }
}

// Récupérer le rang légendaire d'un utilisateur


// Déterminer le prochain objectif pour un légendaire


// Fonction pour récupérer le rang légendaire
async function getLegendaryUserRank(userId) {
    try {
        if (!window.supabaseFunctions || !window.supabaseFunctions.getUserLegendaryRank) {
            return { rank: 1, time: 0, lives: 0, total: 1 };
        }
        
        const result = await window.supabaseFunctions.getUserLegendaryRank(userId);
        
        if (result.success && result.isLegendary) {
            return {
                rank: result.rank,
                time: result.time || 0,
                lives: result.lives || 0,
                total: result.total || 1,
                date: result.date
            };
        }
        
        // Si pas trouvé mais qu'on sait qu'il est légendaire
        return { rank: 1, time: 0, lives: 0, total: 1 };
        
    } catch (error) {
        console.error("❌ Erreur getLegendaryUserRank:", error);
        return { rank: 1, time: 0, lives: 0, total: 1 };
    }
}

// Fonction pour les objectifs légendaires
function getLegendaryNextMilestone(rank, total) {
    if (rank === 1) {
        return "Maintenir la 1ère place";
    } else if (rank === 2) {
        return "Devenir 1er";
    } else if (rank === 3) {
        return "Monter sur le podium (2ème)";
    } else if (rank <= 10) {
        return `Entrer dans le top ${Math.max(3, rank - 3)}`;
    } else {
        return `Top ${Math.floor(rank / 2)}`;
    }
}

function updateRankingDisplay(rankingData) {
    try {
        const rankingElement = document.getElementById("user-ranking");
        if (!rankingElement) {
            return;
        }

        // Cas de chargement
        if (rankingData.loading) {
            rankingElement.innerHTML = `
                <div class="ranking-loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <span>Calcul de votre classement...</span>
                </div>
            `;
            return;
        }

        // Cas d'erreur
        if (rankingData.error) {
            rankingElement.innerHTML = `
                <div class="ranking-info">
                    <span class="ranking-label">🏆 CLASSEMENT</span>
                    <span class="ranking-details error">
                        <i class="fa-solid fa-exclamation-triangle"></i>
                        Données indisponibles
                    </span>
                    <span class="ranking-hint">
                        Rechargez la page ou vérifiez votre connexion
                    </span>
                </div>
            `;
            return;
        }

                // ==================== NOUVEAU : CAS LÉGENDAIRE ====================
        if (rankingData.isLegendary) {
            // Récupérer le rang légendaire spécifique
            getLegendaryRank(rankingData).then(legendaryRank => {
                const isFirstPlace = legendaryRank.rank === 1;
                const isTopThree = legendaryRank.rank <= 3;
                
                rankingElement.innerHTML = `
                    <div class="ranking-info legendary">
                        <span class="rankin-label">
                            <i class="fa-solid fa-crown"></i> HALL OF FAME
                        </span>
                        <span class="ranking-badge rank-legendary">
                            ${getLegendaryRankDisplay(legendaryRank.rank)}
                        </span>
                        
                        <!-- Stats légendaires -->
                        
                            <div class="legendary-stat">
                                <i class="fa-solid fa-clock"></i>
                                <span>Meilleur temps: <strong>${formatTime(legendaryRank.time)}</strong></span>
                            </div>
                            <div class="legendary-stat">
                                <i class="fa-solid fa-heart"></i>
                                <span> <strong>${legendaryRank.lives}</strong></span>
                            </div>
                        </div>
                        
                        <!-- Message motivationnel -->
                        ${isFirstPlace ? 
                            `<span class="ranking-hint legendary-hint">
                                <i class="fa-solid fa-crown"></i> CHAMPION ABSOLU ! Maintenez votre position !
                            </span>` :
                            `<span class="ranking-hint legendary-hint">
                                <i class="fa-solid fa-arrow-up"></i> 
                                ${getLegendaryMotivation(legendaryRank.rank, legendaryRank.time, legendaryRank.total)}
                            </span>`
                        }
                        
                        <!-- Barre de progression légendaire -->
                        <div class="ranking-progress legendary-progress">
                            <div class="ranking-progress-bar" style="width: ${calculateLegendaryProgress(legendaryRank.rank, legendaryRank.total)}%"></div>
                        </div>
                    </div>
                      
                        
                `;
                
                // Animation spéciale pour légendaires
                setTimeout(() => {
                    const badge = rankingElement.querySelector(".ranking-badge");
                    if (badge) {
                        badge.classList.add("legendary-glow");
                        setTimeout(() => badge.classList.remove("legendary-glow"), 2000);
                    }
                }, 100);
            }).catch(error => {
                // Fallback si erreur de chargement du rang légendaire
                rankingElement.innerHTML = `
                    <div class="ranking-info legendary">
                        <span class="ranking-label">
                            <i class="fa-solid fa-crown"></i> HALL OF FAME
                        </span>
                        <span class="ranking-badge rank-legendary">
                            <i class="fa-solid fa-crown"></i> Légendaire
                        </span>
                        <span class="ranking-details">
                            <i class="fa-solid fa-trophy"></i> Score Parfait: <strong>100/100</strong>
                        </span>
                        <span class="ranking-hint legendary-hint">
                            <i class="fa-solid fa-star"></i> Vous avez atteint la perfection !
                        </span>
                    </div>
                `;
            });
            return; // Important : sortir de la fonction
        }

        // Cas : Pas assez de données
        if (rankingData.needsMoreData) {
            rankingElement.innerHTML = `
                <div class="ranking-info">
                    <span class="ranking-label">🏆 CLASSEMENT</span>
                    <span class="ranking-badge rank-outside">
                        <i class="fa-solid fa-chart-line"></i> En attente
                    </span>
                    <span class="ranking-details">
                        <i class="fa-solid fa-info-circle"></i>
                        Plus de données nécessaires
                    </span>
                    <span class="ranking-hint">
                        Jouez une partie pour établir votre classement
                    </span>
                </div>
            `;
            return;
        }

        // CAS 1 : DANS LE TOP 5
        if (rankingData.category === "top5") {
            let rankText = `${rankingData.position}ème`;
            let rankIcon = "🏆";
            
            if (rankingData.position === 1) {
                rankText = "🥇 1er";
                rankIcon = '<i class="fa-solid fa-trophy"></i>';
            } else if (rankingData.position === 2) {
                rankText = "🥈 2ème";
                rankIcon = '<i class="fa-solid fa-star"></i>';
            } else if (rankingData.position === 3) {
                rankText = "🥉 3ème";
                rankIcon = '<i class="fa-solid fa-star"></i>';
            }
            
            rankingElement.innerHTML = `
                <div class="ranking-info elite">
                    <span class="ranking-label">${rankIcon} CLASSEMENT ÉLITE</span>
                    <span class="ranking-badge rank-1">
                        ${rankText}
                    </span>
                    <span class="ranking-details">
                        <i class="fa-solid fa-trophy"></i> Score: <strong>${rankingData.score}/100</strong>
                    </span>
                    ${rankingData.position === 1 ? 
                        `<span class="ranking-hint success">
                            <i class="fa-solid fa-crown"></i> Bravo ! Bientôt dans le Hall of Fame !
                        </span>` : 
                        `<span class="ranking-hint">
                            <i class="fa-solid fa-arrow-up"></i> ${rankingData.nextMilestone}: +${rankingData.pointsToNextMilestone} pts
                        </span>`
                    }
                    <div class="ranking-progress">
                        <div class="ranking-progress-bar" style="width: 100%"></div>
                    </div>
                </div>
            `;
        }
        
        // CAS 2 : DANS LE TOP 10 (positions 6-10)
        else if (rankingData.category === "top10") {
            rankingElement.innerHTML = `
                <div class="ranking-info top10">
                    <span class="ranking-label">🎯 TOP 10 MONDIAL</span>
                    <span class="ranking-badge rank-4-10">
                        ${rankingData.position}ème
                    </span>
                    <span class="ranking-details">
                        <i class="fa-solid fa-star"></i> Score: <strong>${rankingData.score}/100</strong>
                    </span>
                    <span class="ranking-distance">
                        <i class="fa-solid fa-flag"></i> -${rankingData.distanceToTop5} pts du top 5
                    </span>
                    <span class="ranking-hint">
                        <i class="fa-solid fa-bullseye"></i> ${rankingData.nextMilestone}: +${rankingData.pointsToNextMilestone} pts
                    </span>
                    <div class="ranking-progress">
                        <div class="ranking-progress-bar" style="width: ${90 + (10 - rankingData.position)}%"></div>
                    </div>
                </div>
            `;
        }
        
        // CAS 3 : DANS LE TOP 50 (positions 11-50)
        else if (rankingData.category === "top50") {
            let subCategory = "";
            let subIcon = "🔢";
            
            if (rankingData.position <= 20) {
                subCategory = "TOP 20";
                subIcon = "⚡";
            } else if (rankingData.position <= 35) {
                subCategory = "TOP 35";
                subIcon = "🎯";
            } else {
                subCategory = "TOP 50";
                subIcon = "📊";
            }
            
            rankingElement.innerHTML = `
                <div class="ranking-info top50">
                    <span class="ranking-label">${subIcon} ${subCategory}</span>
                    <span class="ranking-badge rank-11-plus">
                        ${rankingData.position}ème
                    </span>
                    <span class="ranking-details">
                        <i class="fa-solid fa-chart-line"></i> Score: <strong>${rankingData.score}/100</strong>
                    </span>
                    <span class="ranking-distance">
                        <i class="fa-solid fa-mountain"></i> -${rankingData.distanceToTop10} pts du top 10
                    </span>
                    <span class="ranking-hint">
                        <i class="fa-solid fa-target"></i> ${rankingData.nextMilestone}: +${rankingData.pointsToNextMilestone} pts
                    </span>
                    <div class="ranking-progress">
                        <div class="ranking-progress-bar" style="width: ${Math.max(30, 100 - rankingData.position)}%"></div>
                    </div>
                </div>
            `;
        }
        
        // CAS 4 : HORS TOP 50
        else {
            const estimatedPos = rankingData.estimatedPosition || "100+";
            const isFar = estimatedPos >= 100;
            
            rankingElement.innerHTML = `
                <div class="ranking-info outside">
                    <span class="ranking-label">🌍 CLASSEMENT GLOBAL</span>
                    <span class="ranking-badge rank-outside">
                        <i class="fa-solid fa-globe"></i> ~${estimatedPos}ème
                    </span>
                    <span class="ranking-details">
                        <i class="fa-solid fa-user"></i> Votre meilleur: <strong>${rankingData.score}/100</strong>
                    </span>
                    ${rankingData.top50Score > 0 ? `
                        <span class="ranking-distance ${rankingData.distanceToTop50 <= 10 ? 'close' : 'far'}">
                            <i class="fa-solid fa-road"></i> 
                            ${rankingData.distanceToTop50 > 0 ? 
                                `Il vous faut +${rankingData.pointsToNextMilestone} pts pour le top 50` :
                                `À ${Math.abs(rankingData.distanceToTop50)} pts du top 50`
                            }
                        </span>
                    ` : ''}
                    <span class="ranking-hint motivational">
                        <i class="fa-solid fa-fire"></i> 
                        ${getMotivationalMessage(rankingData.score, estimatedPos)}
                    </span>
                    <div class="ranking-progress">
                        <div class="ranking-progress-bar" style="width: ${Math.min(30, (rankingData.score / 100) * 30)}%"></div>
                    </div>
                </div>
            `;
        }

        // Animation pour les mises à jour
        setTimeout(() => {
            const badge = rankingElement.querySelector(".ranking-badge");
            if (badge) {
                badge.classList.add("update-animation");
                setTimeout(() => badge.classList.remove("update-animation"), 1000);
            }
        }, 100);
        
    } catch (error) {
        console.error("❌ Erreur updateRankingDisplay:", error);
    }
}

// ==================== FONCTIONS POUR LE PANEL LÉGENDAIRE ====================

// Récupérer le rang spécifique dans le Hall of Legends
async function getLegendaryRank(rankingData) {
    try {
        if (!window.supabaseFunctions || !window.supabaseFunctions.getUserLegendaryRank) {
            return {
                rank: 1,
                time: rankingData.totalTime || 0,
                lives: rankingData.livesRemaining || 0,
                total: 1,
                nextTime: null
            };
        }
        
        const result = await window.supabaseFunctions.getUserLegendaryRank(currentUser.id);
        
        if (result.success && result.isLegendary) {
            // Récupérer le temps du joueur juste devant (pour l'objectif)
            let nextTime = null;
            if (result.rank > 1) {
                const legendaryScoresResult = await window.supabaseFunctions.getLegendaryScores(20);
                if (legendaryScoresResult.success && legendaryScoresResult.data) {
                    const playerIndex = result.rank - 1; // index 0-based
                    if (playerIndex > 0) {
                        nextTime = legendaryScoresResult.data[playerIndex - 1]?.temps_total;
                    }
                }
            }
            
            return {
                rank: result.rank,
                time: result.time || rankingData.totalTime || 0,
                lives: result.lives || rankingData.livesRemaining || 0,
                total: result.total || 1,
                nextTime: nextTime,
                date: result.date
            };
        }
        
        return {
            rank: 1,
            time: rankingData.totalTime || 0,
            lives: rankingData.livesRemaining || 0,
            total: 1,
            nextTime: null
        };
        
    } catch (error) {
        console.error("❌ Erreur getLegendaryRank:", error);
        return {
            rank: 1,
            time: rankingData.totalTime || 0,
            lives: rankingData.livesRemaining || 0,
            total: 1,
            nextTime: null
        };
    }
}

// Formater l'affichage du rang légendaire
function getLegendaryRankDisplay(rank) {
    switch(rank) {
        case 1: return "🥇 1er";
        case 2: return "🥈 2ème";
        case 3: return "🥉 3ème";
        default: return `${rank}ème`;
    }
}

// Message motivationnel spécifique aux légendaires
function getLegendaryMotivation(rank, time, total) {
    const timeStr = formatTime(time);
    
    if (rank === 1) {
        return `👑 Champion ! Temps: ${timeStr}`;
    } else if (rank <= 3) {
        return `⚡ Top ${rank} ! À ${Math.max(1, rank - 1)} place du trône`;
    } else if (rank <= 10) {
        return `🚀 Top 10 ! Montez au top 3`;
    } else if (rank <= total / 2) {
        return `🎯 Rang ${rank}/${total}. Progressez !`;
    } else {
        return `🌟 Rang ${rank}/${total}. Chaque seconde compte !`;
    }
}

// Calculer la progression légendaire (pour la barre)
function calculateLegendaryProgress(rank, total) {
    if (rank === 1) return 100;
    if (total <= 1) return 100;
    
    // Inversé : 1er = 100%, dernier = 20%
    const percentage = 100 - ((rank - 1) / (total - 1)) * 80;
    return Math.max(20, Math.round(percentage));
}

function formatTime(seconds) {
    if (!seconds || seconds === 999999 || seconds === 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    // Version améliorée avec formatage
    if (mins === 0) {
        return `${secs}s`;
    } else if (secs === 0) {
        return `${mins}min`;
    } else {
        return `${mins}m ${secs.toString().padStart(2, '0')}s`;
    }
}

// ==================== FONCTIONS DU SYSTÈME LÉGENDAIRE ====================

// NOUVELLE FONCTION : Notification légendaire
function showLegendaryNotification(livesRemaining, totalTime) {
  console.log("🌟 AFFICHAGE NOTIFICATION LÉGENDAIRE");
  
  // Créer l'overlay
  const overlay = document.createElement("div");
  overlay.className = "legendary-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.5s ease;
  `;
  
  // Créer le contenu
  const notification = document.createElement("div");
  notification.className = "legendary-notification";
  notification.innerHTML = `
    <div class="legendary-content">
      <div class="legendary-icon">🏆</div>
      <h2 class="legendary-title">HALL OF LEGENDS</h2>
      <p class="legendary-subtitle">Tu as rejoint le classement légendaire !</p>
      
      <div class="legendary-stats">
        <div class="legendary-stat">
          <i class="fa-solid fa-trophy"></i>
          <span>Score Parfait: 100/100</span>
        </div>
        <div class="legendary-stat">
          <i class="fa-solid fa-heart"></i>
          <span>Vies restantes: ${livesRemaining}</span>
        </div>
        <div class="legendary-stat">
          <i class="fa-solid fa-clock"></i>
          <span>Temps: ${Math.floor(totalTime/60)}m ${totalTime%60}s</span>
        </div>
      </div>
      
      <div class="legendary-actions">
        <button id="view-legendary-btn" class="legendary-btn">
          <i class="fa-solid fa-crown"></i> Voir le Hall of Legends
        </button>
        <button id="close-legendary-btn" class="legendary-btn secondary">
          <i class="fa-solid fa-times"></i> Continuer
        </button>
      </div>
      
      <p class="legendary-hint">Seulement les meilleurs atteignent ce niveau !</p>
    </div>
  `;
  
  // Style de la notification
  notification.style.cssText = `
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: white;
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    max-width: 500px;
    width: 90%;
    border: 3px solid #FFD700;
    box-shadow: 0 0 50px rgba(255, 215, 0, 0.5);
    position: relative;
    overflow: hidden;
    animation: legendary-popup 0.8s ease;
  `;
  
  // Ajouter l'effet de brillance
  const shineEffect = document.createElement("div");
  shineEffect.style.cssText = `
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 215, 0, 0.2),
      transparent
    );
    animation: legendary-shine 3s infinite;
  `;
  
  notification.appendChild(shineEffect);
  overlay.appendChild(notification);
  document.body.appendChild(overlay);
  
  // Ajouter les écouteurs d'événements
  setTimeout(() => {
    const viewBtn = document.getElementById("view-legendary-btn");
    const closeBtn = document.getElementById("close-legendary-btn");
    
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        overlay.remove();
        showLegendaryRanking();
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.remove();
        showMessage("✨ Bienvenue parmi les légendes !", "success");
      });
    }
  }, 100);
  
  // Fermer en cliquant en dehors
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}


// NOUVELLE FONCTION : Afficher le classement légendaire (design moderne adapté)
function showLegendaryRanking() {
  console.log(" Affichage du Hall of Legends (design adapté)");
  
  // Créer le modal
  const modal = document.createElement("div");
  modal.className = "legendary-modal";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease;
  `;
  
  // Contenu du modal
  const content = document.createElement("div");
  content.style.cssText = `
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    color: white;
    border-radius: 20px;
    padding: 30px;
    max-width: 900px;
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 215, 0, 0.3);
  `;
  
  // Header
  const header = document.createElement("div");
  header.style.cssText = `
    margin-bottom: 30px;
    text-align: center;
    position: relative;
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(255, 215, 0, 0.2);
  `;
  
  header.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-bottom: 10px;
    ">
      
      <h2 style="
        font-size: 5rem;
        margin: 0;
        color: #debc0fff;
        font-weight: 700;
        letter-spacing: 1px;
      ">
        HALL OF LEGENDS
      </h2>
    </div>
    <p style="
      color: #aaa;
      font-size: 1.1rem;
      margin-top: 10px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.5;
    ">
      Classement exclusif des joueurs ayant atteint la perfection (100/100)
    </p>
  `;
  
  // Section statistiques
  const statsSection = document.createElement("div");
  statsSection.style.cssText = `
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 35px;
  `;
  
  const totalLegendary = legendaryScores.length;
  
  // Calculer les statistiques
  const perfectScores = legendaryScores.length;
  const avgTime = legendaryScores.length > 0 
    ? Math.round(legendaryScores.reduce((sum, score) => sum + (score.temps_total || 0), 0) / legendaryScores.length)
    : 0;
  
  statsSection.innerHTML = `
    <div class="legendary-stat-card">
      <div class="legendary-stat-number">${totalLegendary}</div>
      <div class="legendary-stat-label">Légendes totales</div>
    </div>
    
    <div class="legendary-stat-card">
      <div class="legendary-stat-number">${perfectScores}</div>
      <div class="legendary-stat-label">Scores parfaits</div>
    </div>
    
    <div class="legendary-stat-card">
      <div class="legendary-stat-number">${formatTime(avgTime)}</div>
      <div class="legendary-stat-label">Temps moyen</div>
    </div>
  `;
  
  // Liste des légendaires
  const listContainer = document.createElement("div");
  listContainer.id = "legendary-scores-container";
  listContainer.style.cssText = `
    margin:30px 0;
    min-height: 200px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 20px;
  `;
  
  if (legendaryScores.length === 0) {
    listContainer.innerHTML = `
      <div class="legendary-empty-state">
        <div class="legendary-empty-icon">
          <i class="fa-solid fa-crown"></i>
        </div>
        <h3 class="legendary-empty-title">Le trône est vide</h3>
        <p class="legendary-empty-text">
          Soyez le premier à rejoindre le Hall of Legends !
        </p>
        <div class="legendary-requirements">
          <p><i class="fa-solid fa-trophy"></i> Conditions d'entrée :</p>
          <ul>
            <li>Atteindre 100/100 au quiz</li>
            <li>Conserver au moins 1 vie restante</li>
            <li>Votre temps sera enregistré</li>
          </ul>
        </div>
      </div>
    `;
  } else {
    listContainer.innerHTML = `
      <div class="legendary-list-header">
        <h4><i class="fa-solid fa-ranking-star"></i> Classement par temps</h4>
        <div class="legendary-count-badge">
          ${legendaryScores.length} Légende${legendaryScores.length > 1 ? 's' : ''}
        </div>
      </div>
      
      <div id="legendary-scores-list">
        ${legendaryScores.map((score, index) => `
          <div class="legendary-player-card ${index === 0 ? 'first-place' : ''} ${currentUser && score.user_id === currentUser.id ? 'current-user' : ''}">
            <div class="player-rank">
              <div class="rank-badge rank-${index + 1}">
                ${getLegendaryRankNumber(index + 1)}
              </div>
            </div>
            
            <div class="player-info">
              <div class="player-name">
                ${score.pseudo || "Anonyme"}
                ${currentUser && score.user_id === currentUser.id ? 
                  '<span class="you-badge">VOUS</span>' : 
                  ''
                }
              </div>
              <div class="player-stats">
                <span class="player-stat">
                  <i class="fa-solid fa-clock"></i> ${formatTime(score.temps_total || 0)}
                </span>
                <span class="player-stat">
                  <i class="fa-solid fa-heart"></i> ${score.vies_restantes || 0} vies
                </span>
                <span class="player-stat">
                  <i class="fa-solid fa-calendar"></i> ${formatGameDate(score.created_at)}
                </span>
              </div>
            </div>
            
            <div class="player-score">
              <div class="score-value">100</div>
              <div class="score-divider">/</div>
              <div class="score-total">100</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  // Footer
  const footer = document.createElement("div");
  footer.style.cssText = `
    margin-top: 35px;
    padding-top: 25px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
  `;
  
  footer.innerHTML = `
    <p class="legendary-footer-text">
      <i class="fa-solid fa-info-circle"></i>
      ${totalLegendary === 1 ? 
        'Seulement 1 joueur a atteint ce niveau de perfection.' :
        `Seulement ${totalLegendary} joueurs ont atteint ce niveau de perfection.`
      }
    </p>
    
    <div class="legendary-actions">
      <button id="start-legendary-challenge" class="legendary-btn primary">
        <i class="fa-solid fa-bolt"></i>
        <span>Entre dans la légende</span>
      </button>
      
      <button id="close-legendary-modal" class="legendary-btn secondary">
        <i class="fa-solid fa-times"></i>
        <span>Fermer</span>
      </button>
    </div>
  `;
  
  // Assembler le modal
  content.appendChild(header);
  content.appendChild(statsSection);
  content.appendChild(listContainer);
  content.appendChild(footer);
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Ajouter les styles CSS dynamiquement
  addLegendaryModalStyles();
  
  // Écouteurs d'événements
  setTimeout(() => {
    const closeBtn = document.getElementById('close-legendary-modal');
    const challengeBtn = document.getElementById('start-legendary-challenge');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.remove());
    }
    
    if (challengeBtn) {
      challengeBtn.addEventListener('click', () => {
        modal.remove();
        if (currentUser) {
          startQuiz();
        } else {
          showAuthModal();
          showMessage("🔒 Connectez-vous pour relever le défi légendaire !", "warning");
        }
      });
    }
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    content.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }, 100);
}

// Fonction pour ajouter les styles CSS
function addLegendaryModalStyles() {
  if (document.getElementById('legendary-modal-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'legendary-modal-styles';
  style.textContent = `
    /* Styles pour le modal légendaire */
    .legendary-stat-card {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 215, 0, 0.04) 100%);
      // border: 1px solid rgba(255, 215, 0, 0.1);
      border-radius: 16px;
      padding: 25px 15px;
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .legendary-stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(255, 215, 0, 0.1);
      // border-color: rgba(255, 215, 0, 0.2);
    }
    
    .legendary-stat-number {
      font-size: 2.8rem;
      font-weight: 800;
      color: #e6dfbaff;
      margin-bottom: 5px;
      text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
    }
    
    .legendary-stat-label {
      font-size: 0.95rem;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 500;
    }
    
    .legendary-empty-state {
      text-align: center;
      padding: 60px 30px;
      color: #888;
      border: 2px dashed rgba(255, 215, 0, 0.2);
      border-radius: 16px;
      background: rgba(255, 215, 0, 0.02);
    }
    
    .legendary-empty-icon {
      font-size: 80px;
      color: rgba(255, 215, 0, 0.15);
      margin-bottom: 20px;
    }
    
    .legendary-empty-title {
      color: #FFD700;
      margin-bottom: 15px;
      font-size: 1.6rem;
      font-weight: 600;
    }
    
    .legendary-empty-text {
      color: #aaa;
      font-size: 1.1rem;
      margin-bottom: 25px;
      line-height: 1.5;
    }
    
    .legendary-requirements {
      margin-top: 30px;
      padding: 20px;
      background: rgba(255, 215, 0, 0.05);
      border-radius: 12px;
      border-left: 4px solid #FFD700;
      text-align: left;
    }
    
    .legendary-requirements p {
      color: #FFD700;
      margin-bottom: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.1rem;
    }
    
    .legendary-requirements ul {
      color: #ccc;
      padding-left: 20px;
      margin: 0;
      line-height: 1.8;
    }
    
    .legendary-list-header {
      margin-bottom: 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .legendary-list-header h4 {
      color: #FFD700;
      margin: 0;
      font-size: 1.3rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .legendary-count-badge {
      color: #aaa;
      font-size: 0.9rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 8px 16px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Cartes de joueur */
    .legendary-player-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      padding: 25px;
      margin-bottom: 15px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 20px;
      position: relative;
    }
    
    .legendary-player-card:hover {
      transform: translateY(-5px);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .legendary-player-card.first-place {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
      border-color: rgba(255, 215, 0, 0.4);
      transform: scale(1.02);
    }
    
    .legendary-player-card.current-user {
      border-left: 4px solid #a8af4cff;
    }
    
    .player-rank {
      flex-shrink: 0;
    }
    
    .rank-badge {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      font-weight: 800;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .rank-1 {
      background: linear-gradient(135deg, #d8d3b3ff 0%, #f3e0bcff 100%);
      color: #000;
    }
    
    .rank-2 {
      background: linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%);
      color: #000;
    }
    
    .rank-3 {
      background: linear-gradient(135deg, #CD7F32 0%, #B87333 100%);
      color: #000;
    }
    
    .rank-4, .rank-5, .rank-6, .rank-7, .rank-8, .rank-9, .rank-10 {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    
    .player-info {
      flex: 1;
    }
    
    .player-name {
      font-weight: 700;
      font-size: 1.4rem;
      color: #fff;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .you-badge {
      background: rgba(76, 175, 80, 0.2);
      color: #4CAF50;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.85rem;
      border: 1px solid rgba(76, 175, 80, 0.3);
    }
    
    .player-stats {
      display: flex;
      align-items: center;
      gap: 20px;
      font-size: 0.95rem;
      color: #aaa;
    }
    
    .player-stat {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .player-score {
      display: flex;
      align-items: baseline;
      gap: 5px;
      flex-shrink: 0;
    }
    
    .score-value {
      font-size: 3.5rem;
      font-weight: 800;
      color: #FFD700;
      line-height: 1;
    }
    
    .score-divider {
      font-size: 1.2rem;
      color: #aaa;
      font-weight: 500;
    }
    
    .score-total {
      font-size: 1.2rem;
      color: #aaa;
      font-weight: 500;
    }
    
    .legendary-footer-text {
      color: #888;
      font-size: 0.95rem;
      margin-bottom: 20px;
      line-height: 1.6;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .legendary-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .legendary-btn {
      padding: 16px 35px;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 12px;
      border: none;
    }
    
    .legendary-btn.primary {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      color: #000;
      box-shadow: 0 5px 25px rgba(255, 215, 0, 0.3);
    }
    
    .legendary-btn.primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 35px rgba(255, 215, 0, 0.5);
    }
    
    .legendary-btn.secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .legendary-btn.secondary:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }
    
    /* Animation et scrollbar */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .legendary-modal > div::-webkit-scrollbar {
      width: 8px;
    }
    
    .legendary-modal > div::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }
    
    .legendary-modal > div::-webkit-scrollbar-thumb {
      background: rgba(255, 215, 0, 0.3);
      border-radius: 4px;
    }
    
    .legendary-modal > div::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 215, 0, 0.5);
    }
  `;
  
  document.head.appendChild(style);
}

// Fonctions utilitaires
function getLegendaryRankNumber(rank) {
  switch(rank) {
    case 1: return "🥇";
    case 2: return "🥈";
    case 3: return "🥉";
    default: return rank;
  }
}

function getStatColor(value, type) {
  if (type === 'time') {
    if (value < 300) return '#4CAF50';
    if (value < 600) return '#2196F3';
    if (value < 900) return '#FF9800';
    return '#f44336';
  } else if (type === 'lives') {
    if (value === 2) return '#4CAF50';
    if (value === 1) return '#FF9800';
    return '#f44336';
  }
  return '#fff';
}

// Fonctions utilitaires pour les couleurs
function getRankBorderColor(rank) {
  switch(rank) {
    case 1: return '#FFD700'; // Or
    case 2: return '#C0C0C0'; // Argent
    case 3: return '#CD7F32'; // Bronze
    default: return 'rgba(255, 215, 0, 0.3)';
  }
}

function getRankBackgroundColor(rank) {
  switch(rank) {
    case 1: return 'rgba(255, 215, 0, 0.2)';
    case 2: return 'rgba(192, 192, 192, 0.2)';
    case 3: return 'rgba(205, 127, 50, 0.2)';
    default: return 'rgba(255, 255, 255, 0.05)';
  }
}

function getRankTextColor(rank) {
  switch(rank) {
    case 1: return '#FFD700';
    case 2: return '#C0C0C0';
    case 3: return '#CD7F32';
    default: return '#FFFFFF';
  }
}

function getLegendaryRankIcon(rank) {
  switch(rank) {
    case 1: return "👑";
    case 2: return "⚔️";
    case 3: return "🛡️";
    default: return `${rank}`;
  }
}


// NOUVELLE FONCTION : Charger les scores légendaires
async function loadLegendaryScores() {
  console.log("📥 Chargement des scores légendaires...");
  
  try {
    if (!window.supabaseFunctions || !window.supabaseFunctions.getLegendaryScores) {
      console.log("⚠️ Fonction légendaire non disponible");
      return;
    }
    
    const result = await window.supabaseFunctions.getLegendaryScores(10);
    
    if (result.success && result.data) {
      legendaryScores = result.data;
      console.log(`✅ ${legendaryScores.length} scores légendaires chargés`);
      
      // Si le bouton Hall of Legends n'existe pas encore, le créer
      const showLegendaryBtn = document.getElementById('show-legendary-ranking');
      if (showLegendaryBtn && legendaryScores.length > 0) {
        showLegendaryBtn.style.display = 'block';
        showLegendaryBtn.innerHTML = `
          <i class="fa-solid fa-crown"></i> Hall of Legends (${legendaryScores.length}+)
        `;
      }
    } else {
      console.log("⚠️ Aucun score légendaire trouvé");
      legendaryScores = [];
    }
    
  } catch (error) {
    console.error("❌ Erreur chargement scores légendaires:", error);
    legendaryScores = [];
  }
}

// NOUVELLE FONCTION : Afficher le classement légendaire (version simplifiée)

function getLegendaryRankColor(rank) {
  switch(rank) {
    case 1: return '#FFD700'; // Or
    case 2: return '#C0C0C0'; // Argent
    case 3: return '#CD7F32'; // Bronze
    default: return '#FFFFFF';
  }
}


// Ajouter les animations CSS (dans la tête ou dans le style existant)
function addLegendaryStyles() {
  // Ces styles seront ajoutés dynamiquement si besoin
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes legendary-popup {
      0% {
        transform: scale(0.8);
        opacity: 0;
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    @keyframes legendary-shine {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }
    
    .legendary-btn {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      color: #000;
      border: none;
      padding: 12px 25px;
      border-radius: 10px;
      font-weight: bold;
      cursor: pointer;
      margin: 10px;
      transition: all 0.3s ease;
    }
    
    .legendary-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
    }
    
    .legendary-btn.secondary {
      background: #333;
      color: #FFD700;
      border: 2px solid #FFD700;
    }
  `;
  document.head.appendChild(style);
}

// Initialiser les styles légendaires au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addLegendaryStyles);
} else {
  addLegendaryStyles();
}

// ==================== FONCTION AUDIO UTILITAIRE ====================
function isAudioEnabled() {
  return window.audioManager ? window.audioManager.isEnabled() : false;
}

function playVictory() {
  if (window.audioManager) {
    window.audioManager.playSound('victory');
  }
}

function playGameOver() {
  if (window.audioManager) {
    window.audioManager.playSound('gameOver');
  }
}

function stopBackgroundMusic() {
  if (window.audioManager) {
    window.audioManager.stopBackgroundMusic();
  }
}

// ==================== FONCTION POUR SAUVEGARDER AVEC PARAMÈTRES LÉGENDAIRES ====================
// Modifier la fonction existante saveScoreToSupabase
const originalSaveScoreToSupabase = saveScoreToSupabase;
saveScoreToSupabase = async function(score, userId, pseudo, email, estLegendaire, viesRestantes, tempsTotal) {
  try {
    // Modifier pour inclure les paramètres légendaires si fournis
    if (estLegendaire !== undefined) {
      // Note: Ta fonction saveScoreToSupabase actuelle ne prend pas ces paramètres
      // On va donc sauvegarder normalement pour l'instant
      console.log(`🏆 Score légendaire détecté: ${score}/100, Vies: ${viesRestantes}, Temps: ${tempsTotal}s`);
    }
    
    // Appeler la fonction originale
    return await originalSaveScoreToSupabase.call(this, score);
  } catch (error) {
    console.error("❌ Erreur sauvegarde légendaire:", error);
    return { success: false, error: error.message };
  }
};

console.log("🎮 Script prêt avec système légendaire !");

// Fonction pour les messages motivationnels
function getMotivationalMessage(score, position) {
    const messages = [
        { min: 80, max: 100, msg: "Score exceptionnel ! Le top 50 est à portée !" },
        { min: 60, max: 79, msg: "Bonne performance ! Continuez à progresser !" },
        { min: 40, max: 59, msg: "Bien parti ! Chaque point compte pour avancer !" },
        { min: 20, max: 39, msg: "Début prometteur ! L'entraînement paie toujours !" },
        { min: 0, max: 19, msg: "Premiers pas ! Le chemin vers le top commence ici !" }
    ];
    
    const found = messages.find(m => score >= m.min && score <= m.max);
    return found ? found.msg : "Chaque partie vous rapproche du sommet !";
}

// ==================== FONCTIONS POUR LES COURONNES ====================
// Vérifie et ajoute les couronnes après chargement des scores
function updateLegendaryDisplay() {
    console.log("🌟 Mise à jour de l'affichage légendaire...");
    
    // 1. Ajouter les couronnes aux highscores
    setTimeout(() => {
        addCrownsToHighscores();
    }, 500);
    
    // 2. Mettre à jour le bouton Hall of Legends
    const legendaryBtn = document.getElementById('show-legendary-ranking');
    if (legendaryBtn && legendaryScores.length > 0) {
        legendaryBtn.innerHTML = `
            <i class="fa-solid fa-crown"></i> 
            <span>Hall of Legends</span>
            <span style="
                background: #FFD700;
                color: #000;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 12px;
                margin-left: 8px;
                font-weight: bold;
            ">${legendaryScores.length}</span>
        `;
        
        legendaryBtn.classList.add('legendary-access-btn');
    }
    
    // 3. Mettre à jour le nom de l'utilisateur courant s'il est légendaire
    if (currentUser) {
        updateCurrentUserCrown();
    }
}

// Ajoute une couronne à l'utilisateur courant s'il est légendaire
function updateCurrentUserCrown() {
    const userElements = [
        document.getElementById('current-user-pseudo'),
        document.getElementById('current-player'),
        document.getElementById('player-result-name')
    ];
    
    userElements.forEach(element => {
        if (element && currentUser.isLegendary) {
            // Vérifier si la couronne n'est pas déjà présente
            if (!element.innerHTML.includes('fa-crown') && !element.innerHTML.includes('👑')) {
                element.innerHTML = `<i class="fa-solid fa-crown"; margin-right: 5px;"></i> ${currentUser.pseudo}`;
                element.style.fontWeight = '600';
            }
        }
    });
}

// Appeler cette fonction après chaque chargement de scores
// MODIFIEZ la fonction loadScoresFromSupabase :
const originalLoadScores = loadScoresFromSupabase;
loadScoresFromSupabase = async function(isUpdate = false) {
    await originalLoadScores.call(this, isUpdate);
    
    // Après chargement des scores, mettre à jour l'affichage légendaire
    setTimeout(() => {
        updateLegendaryDisplay();
    }, 300);
};

