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
const registerPasswordModal = document.getElementById("register-password-modal");
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

const showMoreScoresBtn = document.getElementById("show-more-scores");
const showMoreScoresResultBtn = document.getElementById("show-more-scores-result");

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

// ==================== INITIALISATION ====================
window.addEventListener('DOMContentLoaded', async () => {
    console.log("🎮 QUIZ CHAMPIONS - Chargement...");
    
    try {
        await checkExistingSession();
        setupAuthEvents();
        setupQuizEvents();
        
        console.log("✅ Initialisation terminée");
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation:", error);
        showScreen('start');
    }
});

async function checkExistingSession() {
    try {
        console.log("🔍 Vérification de la session...");
        
        if (!window.supabaseFunctions || !window.supabaseFunctions.getSessionSupabase) {
            console.log("⚠️ Supabase non chargé - mode invité");
            currentUser = null; // S'assurer que currentUser est null
            updateUserDisplay(); // Mettre à jour l'affichage
            showScreen('start');
            setTimeout(() => loadScoresFromSupabase(), 1000);
            return;
        }
        
        const result = await window.supabaseFunctions.getSessionSupabase();
        
        if (result.success && result.user) {
            console.log("✅ Utilisateur connecté:", result.user.email);
            currentUser = {
                id: result.user.id,
                email: result.user.email,
                pseudo: result.user.user_metadata?.pseudo || result.user.email?.split('@')[0]
            };
            
            updateUserDisplay();
            showScreen('start');
            loadScoresFromSupabase();
            loadPlayerStats();
            
        } else {
            console.log("👤 Mode invité");
            currentUser = null; // IMPORTANT: Définir explicitement à null
            updateUserDisplay(); // Mettre à jour l'affichage
            showScreen('start');
            loadScoresFromSupabase();
            resetPlayerStats();
        }
        
    } catch (error) {
        console.error("❌ Erreur vérification session:", error);
        currentUser = null; // En cas d'erreur, forcer invité
        updateUserDisplay();
        showScreen('start');
        loadScoresFromSupabase();
        resetPlayerStats();
    }
}

function setupAuthEvents() {
    console.log("🔧 Configuration des événements auth...");
    
    if (loginBtnHeader) {
        loginBtnHeader.addEventListener('click', showAuthModal);
        console.log("✅ Bouton connexion configuré");
    }
    
    if (closeAuthModalBtn) {
        closeAuthModalBtn.addEventListener('click', hideAuthModal);
        console.log("✅ Bouton fermer modal configuré");
    }
    
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                hideAuthModal();
            }
        });
    }
    
    if (loginTabModal && registerTabModal) {
        loginTabModal.addEventListener('click', () => {
            loginTabModal.classList.add('active');
            registerTabModal.classList.remove('active');
            loginFormModal.classList.add('active');
            registerFormModal.classList.remove('active');
        });
        
        registerTabModal.addEventListener('click', () => {
            registerTabModal.classList.add('active');
            loginTabModal.classList.remove('active');
            registerFormModal.classList.add('active');
            loginFormModal.classList.remove('active');
        });
        console.log("✅ Onglets auth configurés");
    }
    
    if (loginBtnModal) {
        loginBtnModal.addEventListener('click', async () => {
            const success = await handleLoginModal();
            if (success) {
                hideAuthModal();
            }
        });
    }
    
    if (registerBtnModal) {
        registerBtnModal.addEventListener('click', async () => {
            const success = await handleRegisterModal();
            if (success) {
                hideAuthModal();
            }
        });
    }
    
    if (loginPasswordModal) {
        loginPasswordModal.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                const success = await handleLoginModal();
                if (success) {
                    hideAuthModal();
                }
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function setupQuizEvents() {
    console.log("🔧 Configuration des événements quiz...");
    
    if (startButton) {
        startButton.addEventListener("click", startQuiz);
        console.log("✅ Bouton démarrer configuré");
    }
    
    if (restartButton) {
        restartButton.addEventListener("click", restartQuiz);
    }
    
    if (toggleRulesBtn && rulesContent) {
        toggleRulesBtn.addEventListener('click', () => {
            const isVisible = rulesContent.classList.toggle('visible');
            toggleRulesBtn.innerHTML = isVisible 
                ? '<i class="fa-solid fa-eye-slash"></i> Masquer les règles'
                : '<i class="fa-solid fa-eye"></i> Voir les règles du jeu';
        });
    }
    
    if (showMoreScoresBtn) {
        showMoreScoresBtn.addEventListener('click', () => {
            isExpandedStart = !isExpandedStart;
            updateHighscoresDisplay();
            loadScoresFromSupabase();
        });
    }
    
    if (showMoreScoresResultBtn) {
        showMoreScoresResultBtn.addEventListener('click', () => {
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

// ==================== FONCTIONS DU PANEL STATS ====================
function setupStatsPanelEvents() {
    console.log("🔧 Configuration du panel stats...");
    
    if (statsIcon) {
        statsIcon.addEventListener('click', toggleStatsPanel);
        console.log("✅ Icône stats configurée");
    }
    
    if (closeStatsPanelBtn) {
        closeStatsPanelBtn.addEventListener('click', hideStatsPanel);
    }
    
    if (seeAllStatsBtn) {
        seeAllStatsBtn.addEventListener('click', () => {
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
    document.addEventListener('click', (e) => {
        if (statsPanel && statsPanel.classList.contains('active') && 
            !statsPanel.contains(e.target) && 
            !statsIcon.contains(e.target)) {
            hideStatsPanel();
        }
    });
}

function toggleStatsPanel() {
    if (statsPanel && statsPanel.classList.contains('active')) {
        hideStatsPanel();
    } else {
        showStatsPanel();
    }
}

function showStatsPanel() {
    if (!statsPanel || !currentUser) return;
    
    loadRecentStats();
    statsPanel.classList.add('active');
    
    // Positionner le panel
    if (statsIcon) {
        const iconRect = statsIcon.getBoundingClientRect();
        statsPanel.style.top = `${iconRect.bottom + 10}px`;
        statsPanel.style.left = `${iconRect.left}px`;
    }
}

function hideStatsPanel() {
    if (statsPanel) {
        statsPanel.classList.remove('active');
    }
}

async function loadRecentStats() {
    console.log("📊 Chargement des stats récentes et du rang...");
    
    try {
        if (!window.supabaseFunctions || !currentUser) {
            console.log("⚠️ Impossible de charger les stats");
            return;
        }
        
        // Afficher le chargement
        updateRankingDisplay({ loading: true });
        
        // 1. Charger les stats complètes
        const statsResult = await window.supabaseFunctions.getPlayerStats(currentUser.id);
        
        if (statsResult.success && statsResult.data) {
            updateStatsPanel(statsResult.data);
        }
        
        // 2. Charger l'historique récent
        const historyResult = await window.supabaseFunctions.getScoreHistory(currentUser.id, 5);
        
        if (historyResult.success && historyResult.data) {
            updateRecentGamesList(historyResult.data);
        }
        
        // 3. Calculer le rang parmi les 50 premiers
        if (allHighscores.length > 0) {
            const ranking = getUserRankingPosition(currentUser.id, allHighscores);
            updateRankingDisplay(ranking);
        } else {
            // Si pas de scores chargés, on charge les 50 premiers
            const scoresResult = await window.supabaseFunctions.getHighScoresFromSupabase(50);
            if (scoresResult.success && scoresResult.data) {
                const ranking = getUserRankingPosition(currentUser.id, scoresResult.data);
                updateRankingDisplay(ranking);
            }
        }
        
    } catch (error) {
        console.error("❌ Erreur chargement stats récentes:", error);
        showMessage("⚠️ Impossible de charger les statistiques", "warning");
        updateRankingDisplay({ error: true });
    }
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
                statsBestScore.style.color = "#ff9800";
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
                statsAverageScore.style.color = "#ff9800";
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
                gameItem.classList.add('new-entry');
                setTimeout(() => gameItem.classList.remove('new-entry'), 1000);
            }
            
            const gameDate = game.played_at || game.created_at;
            const formattedDate = formatGameDate(gameDate);
            
            gameItem.innerHTML = `
                <span class="recent-game-date">${formattedDate}</span>
                <span class="recent-game-score">${game.score}/100</span>
            `;
            
            const scoreElement = gameItem.querySelector('.recent-game-score');
            if (game.score >= 90) {
                scoreElement.style.color = "#4CAF50";
                scoreElement.innerHTML = `${game.score}/100 ⭐`;
            } else if (game.score >= 70) {
                scoreElement.style.color = "#2196F3";
            } else if (game.score >= 50) {
                scoreElement.style.color = "#ff9800";
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
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return "Aujourd'hui";
        } else if (diffDays === 1) {
            return "Hier";
        } else if (diffDays < 7) {
            return `Il y a ${diffDays} jours`;
        } else {
            return date.toLocaleDateString("fr-FR", {
                day: '2-digit',
                month: '2-digit'
            });
        }
    } catch (error) {
        return "Récemment";
    }
}

// ==================== FONCTIONS STATISTIQUES ====================
async function loadPlayerStats() {
    console.log("📊 Chargement des statistiques personnelles...");
    
    try {
        if (!window.supabaseFunctions || !window.supabaseFunctions.getPlayerStats) {
            console.log("⚠️ Fonctions statistiques non disponibles");
            return;
        }
        
        if (!currentUser || !currentUser.id) {
            console.log("👤 Utilisateur non connecté - pas de stats");
            resetPlayerStats();
            return;
        }
        
        const result = await window.supabaseFunctions.getPlayerStats(currentUser.id);
        
        if (result.success && result.data) {
            console.log("✅ Statistiques chargées");
            updatePlayerStatsDisplay(result.data);
        } else {
            console.log("⚠️ Aucune statistique trouvée");
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
                bestScoreValue.classList.add('score-improved');
                setTimeout(() => bestScoreValue.classList.remove('score-improved'), 2000);
            }
        }
        
        const bestScoreDate = document.getElementById("best-score-date");
        if (bestScoreDate) {
            if (stats.bestDate) {
                bestScoreDate.textContent = formatDate(stats.bestDate);
            } else {
                bestScoreDate.textContent = "Jamais";
            }
        }
        
        const totalGames = document.getElementById("total-games");
        if (totalGames) {
            totalGames.textContent = stats.totalGames || 0;
            
            if (stats.totalGames === 1) {
                totalGames.classList.add('new-entry');
                setTimeout(() => totalGames.classList.remove('new-entry'), 2000);
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
                recordMessage.style.display = 'block';
            } else if (stats.bestScore >= 90) {
                recordMessage.innerHTML = `
                    <strong>🌟 Performance exceptionnelle !</strong><br>
                    Votre meilleur score est de ${stats.bestScore}/100. Continuez comme ça !</span>
                `;
                recordMessage.style.display = 'block';
            } else if (stats.progression > 0) {
                recordMessage.innerHTML = `
                    <strong>📈 En progression !</strong><br>
                    Vous avez amélioré votre score de +${stats.progression} points depuis votre première partie.
                `;
                recordMessage.style.display = 'block';
            } else {
                recordMessage.style.display = 'none';
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
            "average-score": "0"
        };
        
        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
        
        const recordMessage = document.getElementById("record-message");
        if (recordMessage) {
            recordMessage.style.display = 'none';
        }
        
    } catch (error) {
        console.error("❌ Erreur reset stats:", error);
    }
}

// ==================== FONCTIONS TEMPS RÉEL ====================
function setupRealTimeUpdates() {
    console.log("🔔 Tentative d'activation des mises à jour temps réel...");
    
    if (!window.supabaseFunctions || !window.supabaseFunctions.subscribeToScores) {
        console.log("⚠️ Fonctions real-time non disponibles");
        return;
    }
    
    try {
        scoreSubscription = window.supabaseFunctions.subscribeToScores(handleScoreUpdate);
        
        if (scoreSubscription) {
            console.log("✅ Abonnement aux mises à jour activé");
        } else {
            console.log("⚠️ Échec de l'abonnement");
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'activation du temps réel:", error);
    }
}

function handleScoreUpdate(payload) {
    console.log("🔄 Mise à jour temps réel:", payload.eventType);
    
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
        const existingNotification = document.querySelector('.score-update-notification');
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

window.addEventListener('beforeunload', () => {
    if (scoreSubscription && window.supabaseFunctions && window.supabaseFunctions.unsubscribeFromScores) {
        window.supabaseFunctions.unsubscribeFromScores(scoreSubscription);
    }
});

// ==================== FONCTIONS MODAL ====================
function showAuthModal() {
    try {
        if (authModal) {
            authModal.classList.add('active');
            if (loginEmailModal) loginEmailModal.value = '';
            if (loginPasswordModal) loginPasswordModal.value = '';
            if (registerPseudoModal) registerPseudoModal.value = '';
            if (registerEmailModal) registerEmailModal.value = '';
            if (registerPasswordModal) registerPasswordModal.value = '';
            if (registerConfirmModal) registerConfirmModal.value = '';
            
            if (loginTabModal && registerTabModal && loginFormModal && registerFormModal) {
                loginTabModal.classList.add('active');
                registerTabModal.classList.remove('active');
                loginFormModal.classList.add('active');
                registerFormModal.classList.remove('active');
            }
        }
    } catch (error) {
        console.error("❌ Erreur ouverture modal:", error);
    }
}

function hideAuthModal() {
    if (authModal) {
        authModal.classList.remove('active');
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
        loginBtnModal.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connexion...';
        
        try {
            const result = await window.supabaseFunctions.signInSupabase(email, password);
            
            if (result.success) {
                currentUser = {
                    id: result.user.id,
                    email: result.user.email,
                    pseudo: result.user.user_metadata?.pseudo || email.split('@')[0]
                };
                
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
            loginBtnModal.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> SE CONNECTER';
        }
    });
}

async function handleRegisterModal() {
    return new Promise(async (resolve) => {
        if (!registerPseudoModal || !registerEmailModal || !registerPasswordModal || !registerConfirmModal) {
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
        registerBtnModal.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Inscription...';
        
        try {
            const result = await window.supabaseFunctions.signUpSupabase(email, password, pseudo);
            
            if (result.success) {
                currentUser = {
                    id: result.user.id,
                    email: result.user.email,
                    pseudo: result.user.user_metadata?.pseudo || pseudo
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
            registerBtnModal.innerHTML = '<i class="fa-solid fa-user-plus"></i> S\'INSCRIRE';
        }
    });
}

async function handleLogout() {
    try {
        if (window.supabaseFunctions && window.supabaseFunctions.signOutSupabase) {
            const result = await window.supabaseFunctions.signOutSupabase();
            
            if (result.success) {
                console.log("✅ Déconnexion réussie");
            } else {
                console.log("⚠️ Pas de session active ou erreur");
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
            if (document.getElementById('current-user-pseudo')?.textContent !== "Invité") {
                console.log("Forcer la mise à jour...");
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
                statsIcon.style.display = 'flex';
                statsIcon.title = `Statistiques de ${currentUser.pseudo}`;
            }
            
            // Afficher bouton déconnexion, cacher connexion
            if (logoutBtn) {
                logoutBtn.style.display = 'flex'; // Important: flex pour garder le style
            }
            if (loginBtnHeader) {
                loginBtnHeader.style.display = 'none';
            }
            
        } else {
            // Utilisateur NON connecté (invité)
            if (currentUserPseudo) currentUserPseudo.textContent = "Invité";
            if (currentUserEmail) currentUserEmail.textContent = "Connectez-vous pour jouer";
            if (currentPlayerSpan) currentPlayerSpan.textContent = "Invité";
            if (playerResultName) playerResultName.textContent = "Invité";
            
            // Cacher l'icône stats
            if (statsIcon) {
                statsIcon.style.display = 'none';
            }
            
            // Cacher bouton déconnexion, afficher connexion
            if (logoutBtn) {
                logoutBtn.style.display = 'none';
            }
            if (loginBtnHeader) {
                loginBtnHeader.style.display = 'flex'; // Important: flex pour garder le style
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
async function loadScoresFromSupabase(isUpdate = false) {
    console.log(`📥 ${isUpdate ? 'Mise à jour' : 'Chargement'} des scores...`);
    
    try {
        if (!window.supabaseFunctions || !window.supabaseFunctions.getHighScoresFromSupabase) {
            console.log("⚠️ Fonctions Supabase non disponibles");
            displayDefaultScores();
            return;
        }
        
        // Charger 50 scores
        const result = await window.supabaseFunctions.getHighScoresFromSupabase(50);
        
        if (result.success && result.data) {
            const oldScores = [...allHighscores];
            allHighscores = result.data.map(item => ({
                id: item.id,
                userId: item.user_id,
                name: item.pseudo || "Anonyme",
                score: item.score,
                date: item.created_at ? formatDate(item.created_at) : "Aujourd'hui",
                timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now()
            }));
            
            console.log(`✅ ${allHighscores.length} scores chargés (top 50)`);
            
            if (isUpdate && oldScores.length > 0) {
                animateScoreChanges(oldScores, allHighscores);
            }
            
            updateHighscoresDisplay(isUpdate);
            updateHighscoresResultDisplay(isUpdate);
            
            // Mettre à jour le rang si l'utilisateur est connecté
            if (currentUser && statsPanel && statsPanel.classList.contains('active')) {
                const ranking = getUserRankingPosition(currentUser.id, allHighscores);
                updateRankingDisplay(ranking);
            }
            
        } else {
            console.log("⚠️ Aucun score trouvé - affichage par défaut");
            displayDefaultScores();
        }
        
    } catch (error) {
        console.error("❌ Erreur chargement scores:", error);
        displayDefaultScores();
    }
}

function displayDefaultScores() {
    updateHighscoresDisplay();
    updateHighscoresResultDisplay();
}

function animateScoreChanges(oldScores, newScores) {
    console.log("🎭 Animation des changements...");
    
    const newEntries = newScores.filter(newScore => 
        !oldScores.some(oldScore => oldScore.id === newScore.id)
    );
    
    const improvedScores = newScores.filter(newScore => {
        const oldScore = oldScores.find(old => old.id === newScore.id);
        return oldScore && newScore.score > oldScore.score;
    });
    
    newEntries.forEach(score => {
        const element = document.querySelector(`[data-score-id="${score.id}"]`);
        if (element) {
            element.classList.add('new-entry');
            setTimeout(() => element.classList.remove('new-entry'), 2000);
        }
    });
    
    improvedScores.forEach(score => {
        const element = document.querySelector(`[data-score-id="${score.id}"]`);
        if (element) {
            element.classList.add('score-improved');
            setTimeout(() => element.classList.remove('score-improved'), 2000);
        }
    });
}

async function saveScoreToSupabase(score) {
    console.log(`💾 Sauvegarde détaillée: ${score}`);
    
    try {
        if (!window.supabaseFunctions || !window.supabaseFunctions.saveScoreToSupabase) {
            throw new Error("Fonctions Supabase non disponibles");
        }
        
        if (!currentUser || !currentUser.id) {
            throw new Error("Utilisateur non connecté");
        }
        
        const result = await window.supabaseFunctions.saveScoreToSupabase(
            score,
            currentUser.id,
            currentUser.pseudo,
            currentUser.email || ''
        );
        
        if (result.success) {
            console.log(`✅ Score sauvegardé (type: ${result.messageType})`);
            
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
    console.log("🚀 Démarrage du quiz...");
    
    if (!currentUser) {
        showAuthModal();
        showMessage("🔒 Connectez-vous pour jouer", "warning");
        return;
    }
    
    startQuizGame();
}

function startQuizGame() {
    lives = 2;
    currentQuestionIndex = 0;
    score = 0;
    gameStopped = false;
    
    livesDisplay = document.getElementById("lives-display");
    livesCount = document.getElementById("lives-count");
    
    if (livesCount) livesCount.textContent = lives;
    if (livesDisplay) updateLivesDisplay();
    if (scoreSpan) scoreSpan.textContent = score;
    
    quizSession = getRandomQuiz(quizQuestions, TOTAL_QUESTIONS);
    console.log(`📝 ${quizSession.length} questions générées`);
    
    if (totalQuestionsSpan) totalQuestionsSpan.textContent = quizSession.length;
    
    showScreen('quiz');
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
    
    if (currentQuestionSpan) currentQuestionSpan.textContent = currentQuestionIndex + 1;
    
    if (progressBar) {
        const progressPercent = ((currentQuestionIndex + 1) / quizSession.length) * 100;
        progressBar.style.width = progressPercent + "%";
        if (progressPercentSpan) progressPercentSpan.textContent = Math.round(progressPercent) + "%";
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
            button.classList.add('fade-in');
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
            timerDisplay.style.color = "#ff4444";
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
    
    if (answersContainer) {
        Array.from(answersContainer.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            } else {
                button.classList.add("incorrect");
            }
        });
    }
    
    if (isCorrect) {
        score++;
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
            livesDisplay.style.background = "linear-gradient(135deg, #ff4444 0%, #cc0000 100%)";
            livesDisplay.classList.add('shake');
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
    showScreen('result');
    
    const finalScore = Math.round((score / TOTAL_QUESTIONS) * 100);
    
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
        saveScoreToSupabase(finalScore).then(saveResult => {
            if (saveResult.success) {
                if (saveResult.action === 'updated') {
                    showMessage("🎉 Nouveau record personnel !", "success");
                } else if (saveResult.action === 'inserted') {
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
    
    showScreen('result');
    
    const finalScore = 100;
    
    if (finalScoreSpan) finalScoreSpan.textContent = finalScore;
    if (questionsDoneSpan) questionsDoneSpan.textContent = TOTAL_QUESTIONS;
    if (percentageSpan) percentageSpan.textContent = "100%";
    
    if (resultMessage) {
        resultMessage.textContent = lives > 0 
            ? `🎉 INCROYABLE ! 100/100 ! ${lives} vie${lives > 1 ? 's' : ''} restante${lives > 1 ? 's' : ''} ! 🏆`
            : "🎉 CHAMPION LÉGENDAIRE ! 100/100 ! 🏆";
    }
    
    if (currentUser) {
        saveScoreToSupabase(finalScore).then(saveResult => {
            if (saveResult.success) {
                if (saveResult.action === 'updated') {
                    showMessage("🎉 NOUVEAU RECORD ! 100/100 !", "success");
                } else if (saveResult.action === 'inserted') {
                    showMessage("✅ Score parfait enregistré !", "success");
                }
            } else {
                showMessage(`❌ Échec sauvegarde: ${saveResult.error}`, "error");
            }
        });
    }
    
    updateHighscoresResultDisplay();
}

// ==================== FONCTIONS UTILITAIRES ====================
function updateLivesDisplay() {
    if (livesCount) livesCount.textContent = lives;
    
    if (livesDisplay) {
        if (lives === 2) {
            livesDisplay.style.background = "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)";
            livesDisplay.style.padding = "10px 20px";
            livesDisplay.style.borderRadius = "20px";

        } else if (lives === 1) {
            livesDisplay.style.background = "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)";
        } else {
            livesDisplay.style.background = "linear-gradient(135deg, #ff4444 0%, #cc0000 100%)";
        }
    }
}

function displayPersonalizedMessage(result) {
    if (!result || !result.success) return;
    
    let message = "";
    let messageType = "info";
    
    switch(result.messageType) {
        case 'first_time':
            if (result.details?.isPerfect) {
                message = "🎯 PERFECTION ABSOLUE ! Premier score : 100/100 ! 🌟";
                messageType = "success";
            } else {
                message = `✅ Premier score enregistré : ${result.newScore}/100 ! Bienvenue !`;
                messageType = "success";
            }
            break;
            
        case 'record_beaten':
            const improvement = result.details?.improvement || 0;
            const level = result.details?.level || 'small';
            
            if (result.details?.isPerfect) {
                message = "🏆 RECORD ABSOLU ATTEINT ! 100/100 - LÉGENDAIRE !";
                messageType = "success";
            } else {
                switch(level) {
                    case 'huge':
                        message = `🚀 EXPLOSION ! +${improvement} points - NOUVEAU RECORD !`;
                        break;
                    case 'major':
                        message = `🔥 PROGRESSION MAJEURE ! +${improvement} points - Record battu !`;
                        break;
                    case 'good':
                        message = `📈 BONNE AMÉLIORATION ! +${improvement} points - Meilleur score !`;
                        break;
                    default:
                        message = `👍 PROGRESSION ! +${improvement} points - Record amélioré !`;
                }
                messageType = "success";
            }
            break;
            
        case 'equal_score':
            message = `⚖️ SCORE IDENTIQUE : ${result.newScore}/100 - Votre record tient bon !`;
            messageType = "info";
            break;
            
        case 'lower_score':
            const difference = result.details?.difference || 0;
            const needed = result.details?.needed || 1;
            
            if (difference > 20) {
                message = `💪 VOTRE RECORD RESTE : ${result.previousScore}/100 - Gardez la motivation !`;
            } else if (difference > 10) {
                message = `🛡️ PRESQUE ! Record : ${result.previousScore}/100 - Manqué de ${difference} points`;
            } else {
                message = `🎯 TOUT PRÈS ! Record : ${result.previousScore}/100 - Il vous faut ${needed} point${needed > 1 ? 's' : ''} de plus !`;
            }
            messageType = "warning";
            break;
            
        default:
            message = "✅ Score traité !";
            messageType = "info";
    }
    
    showMessage(message, messageType);
    
    if (result.messageType === 'record_beaten' && result.details) {
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
        livesDisplay.classList.add('shake');
        setTimeout(() => livesDisplay.classList.remove('shake'), 500);
    }
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
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
        
        switch(screenName) {
            case 'start':
                if (startScreen) startScreen.classList.add("active");
                break;
            case 'quiz':
                if (quizScreen) quizScreen.classList.add("active");
                break;
            case 'result':
                if (resultScreen) resultScreen.classList.add("active");
                break;
        }
    } catch (error) {
        console.error("❌ Erreur showScreen:", error);
    }
}

function showMessage(text, type = "info") {
    console.log(`📢 ${text}`);
    
    try {
        const oldMessages = document.querySelectorAll('.quiz-message');
        oldMessages.forEach(msg => msg.remove());
        
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
            showMoreScoresBtn.style.display = 'none';
            return;
        }
        
        // Ajuster l'affichage selon l'état d'expansion
        const scoresToShow = isExpandedStart ? allHighscores : allHighscores.slice(0, visibleScoresCount);
        
        if (allHighscores.length > visibleScoresCount) {
            showMoreScoresBtn.innerHTML = isExpandedStart 
                ? '👆 Voir moins' 
                : `👇 Voir plus de champions (${scoresToShow.length}/${allHighscores.length})`;
            showMoreScoresBtn.style.display = 'block';
        } else {
            showMoreScoresBtn.style.display = 'none';
        }
        
        // Afficher les scores
        scoresToShow.forEach((scoreData, index) => {
            const scoreElement = document.createElement("div");
            scoreElement.className = "highscore-item";
            scoreElement.dataset.scoreId = scoreData.id;
            scoreElement.dataset.userId = scoreData.userId;
            
            if (isUpdate) {
                scoreElement.classList.add('update-animation');
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
            highscoresListResult.innerHTML = '<div class="no-scores"><p>🏆 Aucun score enregistré</p></div>';
            showMoreScoresResultBtn.style.display = 'none';
            return;
        }
        
        const scoresToShow = isExpandedResult ? allHighscores : allHighscores.slice(0, visibleScoresCount);
        
        if (allHighscores.length > visibleScoresCount) {
            showMoreScoresResultBtn.innerHTML = isExpandedResult 
                ? '👆 Voir moins' 
                : `👇 Voir plus de champions (${scoresToShow.length}/${allHighscores.length})`;
            showMoreScoresResultBtn.style.display = 'block';
        } else {
            showMoreScoresResultBtn.style.display = 'none';
        }
        
        scoresToShow.forEach((scoreData, index) => {
            const scoreElement = document.createElement("div");
            scoreElement.className = "highscore-item";
            scoreElement.dataset.scoreId = scoreData.id;
            scoreElement.dataset.userId = scoreData.userId;
            
            if (isUpdate) {
                scoreElement.classList.add('update-animation');
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
        const connectionMessage = document.getElementById("connection-status-message");
        if (!connectionMessage) {
            console.log("ℹ️ Élément connection-status-message non trouvé");
            return;
        }
        
        if (currentUser) {
            connectionMessage.textContent = `✅ Connecté : ${currentUser.pseudo}`;
            connectionMessage.className = "connection-status connected";
        } else {
            connectionMessage.textContent = "* Connectez-vous pour sauvegarder votre score";
            connectionMessage.className = "connection-status not-connected";
        }
    } catch (error) {
        console.error("❌ Erreur updateConnectionMessage:", error);
    }
}

// ==================== FONCTION CALCUL RANG ====================
function getUserRankingPosition(userId, highscores) {
    console.log("📊 Calcul du rang pour user:", userId);
    
    if (!userId || !highscores || highscores.length === 0) {
        console.log("⚠️ Données insuffisantes pour calculer le rang");
        return { 
            position: null, 
            total: highscores?.length || 0,
            isInTop: false,
            score: 0
        };
    }
    
    // Trier par score décroissant (au cas où)
    const sortedScores = [...highscores].sort((a, b) => b.score - a.score);
    
    // Trouver la position de l'utilisateur
    const position = sortedScores.findIndex(score => score.userId === userId);
    
    if (position === -1) {
        console.log("ℹ️ Utilisateur non présent dans le top", sortedScores.length);
        return {
            position: null,
            total: sortedScores.length,
            isInTop: false,
            score: 0,
            topScore: sortedScores.length > 0 ? sortedScores[0].score : 0
        };
    }
    
    const userScore = sortedScores[position].score;
    const topScore = sortedScores.length > 0 ? sortedScores[0].score : userScore;
    const distanceToFirst = position > 0 ? topScore - userScore : 0;
    
    // Calculer le pourcentage de progression vers le top
    const progressPercent = topScore > 0 ? Math.round((userScore / topScore) * 100) : 100;
    
    console.log(`✅ Rang trouvé: ${position + 1}/${sortedScores.length}, Score: ${userScore}/100`);
    
    return {
        position: position + 1, // 1-based pour l'affichage
        total: sortedScores.length,
        score: userScore,
        topScore: topScore,
        distanceToFirst: distanceToFirst,
        progressPercent: progressPercent,
        isInTop: true,
        isFirst: position === 0,
        isTopThree: position < 3,
        isTopTen: position < 10
    };
}

function updateRankingDisplay(rankingData) {
    try {
        const rankingElement = document.getElementById("user-ranking");
        if (!rankingElement) {
            console.log("⚠️ Élément user-ranking non trouvé");
            return;
        }
        
        // Cas de chargement
        if (rankingData.loading) {
            rankingElement.innerHTML = `
                <div class="ranking-loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <span>Calcul de votre rang...</span>
                </div>
            `;
            return;
        }
        
        // Cas d'erreur
        if (rankingData.error) {
            rankingElement.innerHTML = `
                <div class="ranking-info">
                    <span class="ranking-label">🏆 VOTRE RANG</span>
                    <span class="ranking-details">
                        <i class="fa-solid fa-exclamation-triangle"></i>
                        Données indisponibles
                    </span>
                </div>
            `;
            return;
        }
        
        // Cas utilisateur non connecté ou sans scores
        if (!rankingData.isInTop || rankingData.position === null) {
            rankingElement.innerHTML = `
                <div class="ranking-info">
                    <span class="ranking-label">🏆 VOTRE RANG</span>
                    <span class="ranking-badge rank-outside">
                        Hors top ${rankingData.total || 50}
                    </span>
                    <span class="ranking-details">
                        ${rankingData.total ? `Top ${rankingData.total} actuel` : 'Top 50'}
                    </span>
                    <span class="ranking-hint">
                        Jouez pour entrer dans le classement !
                    </span>
                </div>
            `;
            return;
        }
        
        // Déterminer la classe CSS pour le badge
        let rankClass = 'rank-11-plus';
        if (rankingData.position === 1) rankClass = 'rank-1';
        else if (rankingData.position === 2) rankClass = 'rank-2';
        else if (rankingData.position === 3) rankClass = 'rank-3';
        else if (rankingData.position <= 10) rankClass = 'rank-4-10';
        
        // Texte du rang
        let rankText = `${rankingData.position}ème`;
        if (rankingData.position === 1) rankText = '🥇 1er';
        else if (rankingData.position === 2) rankText = '🥈 2ème';
        else if (rankingData.position === 3) rankText = '🥉 3ème';
        else if (rankingData.position <= 10) rankText = `🏆 ${rankingData.position}ème`;
        
        // Détails supplémentaires
        let detailsHtml = `
            <span class="ranking-details">
                Score: <strong>${rankingData.score}/100</strong>
            </span>
        `;
        
        // Distance par rapport au premier (sauf si c'est le premier)
        if (!rankingData.isFirst && rankingData.distanceToFirst > 0) {
            detailsHtml += `
                <span class="ranking-distance">
                    -${rankingData.distanceToFirst} pts du 1er
                </span>
            `;
        }
        
        // Conseils selon la position
        let hintText = '';
        if (rankingData.position === 1) {
            hintText = '👑 Champion en titre !';
        } else if (rankingData.isTopThree) {
            hintText = 'Presque au sommet !';
        } else if (rankingData.isTopTen) {
            hintText = 'Dans le top 10, bravo !';
        } else if (rankingData.position <= 25) {
            hintText = 'Top 25, continuez !';
        } else {
            hintText = `Plus que ${rankingData.position - 10} places pour le top 10`;
        }
        
        // Barre de progression (optionnelle)
        let progressBar = '';
        if (rankingData.topScore > 0 && !rankingData.isFirst) {
            progressBar = `
                <div class="ranking-progress">
                    <div class="ranking-progress-bar" style="width: ${rankingData.progressPercent}%"></div>
                </div>
                <span class="ranking-hint">
                    ${rankingData.progressPercent}% du score maximum
                </span>
            `;
        }
        
        // HTML final
        rankingElement.innerHTML = `
            <div class="ranking-info">
                <span class="ranking-label">🏆 VOTRE RANG</span>
                <span class="ranking-badge ${rankClass}">
                    ${rankText}
                </span>
                ${detailsHtml}
                <span class="ranking-hint">
                    ${hintText}
                </span>
                ${progressBar}
            </div>
        `;
        
        // Animation pour les nouveaux classements
        setTimeout(() => {
            const badge = rankingElement.querySelector('.ranking-badge');
            if (badge) {
                badge.classList.add('update-animation');
                setTimeout(() => badge.classList.remove('update-animation'), 1000);
            }
        }, 100);
        
    } catch (error) {
        console.error("❌ Erreur updateRankingDisplay:", error);
    }
}

console.log("🎯 Script prêt !");