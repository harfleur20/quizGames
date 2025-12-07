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
let lastUpdateTime = 0;

// ==================== INITIALISATION ====================
window.addEventListener('DOMContentLoaded', async () => {
    console.log("🎮 QUIZ CHAMPIONS - ÉDITION TEMPS RÉEL");
    
    await checkExistingSession();
    setupAuthEvents();
    setupQuizEvents();
    
    console.log("✅ Initialisation terminée");
});

async function checkExistingSession() {
    try {
        if (!window.supabaseFunctions || !window.supabaseFunctions.getSessionSupabase) {
            console.log("⚠️ Supabase non chargé");
            showScreen('start');
            loadScoresFromSupabase();
            return;
        }
        
        const result = await window.supabaseFunctions.getSessionSupabase();
        
        if (result.success && result.user) {
            currentUser = {
                id: result.user.id,
                email: result.user.email,
                pseudo: result.user.user_metadata?.pseudo || result.user.email?.split('@')[0]
            };
            
            updateUserDisplay();
            showScreen('start');
            loadScoresFromSupabase();
            
        } else {
            showScreen('start');
            loadScoresFromSupabase();
        }
        
    } catch (error) {
        console.error("❌ Erreur vérification session:", error);
        showScreen('start');
        loadScoresFromSupabase();
    }
}

function setupAuthEvents() {
    if (loginBtnHeader) {
        loginBtnHeader.addEventListener('click', showAuthModal);
    }
    
    if (closeAuthModalBtn) {
        closeAuthModalBtn.addEventListener('click', hideAuthModal);
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
    if (startButton) {
        startButton.addEventListener("click", startQuiz);
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
        });
    }
    
    if (showMoreScoresResultBtn) {
        showMoreScoresResultBtn.addEventListener('click', () => {
            isExpandedResult = !isExpandedResult;
            updateHighscoresResultDisplay();
        });
    }
    
    setupRealTimeUpdates();
}

// ==================== FONCTIONS TEMPS RÉEL ====================
function setupRealTimeUpdates() {
    console.log("🔔 Configuration des mises à jour en temps réel...");
    
    if (!window.supabaseFunctions || !window.supabaseFunctions.subscribeToScores) {
        console.log("⚠️ Fonctions real-time non disponibles");
        return;
    }
    
    scoreSubscription = window.supabaseFunctions.subscribeToScores(handleScoreUpdate);
    
    if (scoreSubscription) {
        console.log("✅ Abonnement aux mises à jour activé");
    }
}

function handleScoreUpdate(payload) {
    const now = Date.now();
    
    if (now - lastUpdateTime < 2000) {
        return;
    }
    
    lastUpdateTime = now;
    
    console.log("🔄 Mise à jour reçue:", payload.eventType);
    
    showUpdateNotification();
    
    setTimeout(() => {
        loadScoresFromSupabase(true);
    }, 500);
}

function showUpdateNotification() {
    const notification = document.createElement("div");
    notification.className = "score-update-notification";
    notification.innerHTML = `
        <i class="fa-solid fa-sync-alt fa-spin"></i>
        <span>Classement mis à jour...</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        animation: slideDown 0.3s ease, fadeOut 0.3s ease 1.5s forwards;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 2000);
}

window.addEventListener('beforeunload', () => {
    if (scoreSubscription && window.supabaseFunctions && window.supabaseFunctions.unsubscribeFromScores) {
        window.supabaseFunctions.unsubscribeFromScores(scoreSubscription);
    }
});

// ==================== FONCTIONS MODAL ====================
function showAuthModal() {
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
        const result = await window.supabaseFunctions.signOutSupabase();
        
        if (result.success) {
            currentUser = null;
            updateUserDisplay();
            loadScoresFromSupabase();
            showMessage("✅ Déconnexion réussie", "success");
            
        } else {
            showMessage(`❌ ${result.error}`, "error");
        }
        
    } catch (error) {
        showMessage("❌ Erreur de déconnexion", "error");
    }
}

function updateUserDisplay() {
    if (currentUser) {
        if (currentUserPseudo) currentUserPseudo.textContent = currentUser.pseudo;
        if (currentUserEmail) currentUserEmail.textContent = currentUser.email;
        if (currentPlayerSpan) currentPlayerSpan.textContent = currentUser.pseudo;
        if (playerResultName) playerResultName.textContent = currentUser.pseudo;
        
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
            logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Déconnexion';
        }
        if (loginBtnHeader) loginBtnHeader.style.display = 'none';
        
    } else {
        if (currentUserPseudo) currentUserPseudo.textContent = "Invité";
        if (currentUserEmail) currentUserEmail.textContent = "Connectez-vous pour jouer";
        if (currentPlayerSpan) currentPlayerSpan.textContent = "Invité";
        if (playerResultName) playerResultName.textContent = "Invité";
        
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (loginBtnHeader) loginBtnHeader.style.display = 'block';
    }
    
    updateConnectionMessage();
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==================== FONCTIONS SUPABASE ====================
async function loadScoresFromSupabase(isUpdate = false) {
    console.log(`📥 Chargement ${isUpdate ? 'dynamique' : ''} des scores...`);
    
    try {
        if (!window.supabaseFunctions || !window.supabaseFunctions.getHighScoresFromSupabase) {
            showMessage("⚠️ Supabase non configuré", "error");
            return;
        }
        
        const result = await window.supabaseFunctions.getHighScoresFromSupabase(20);
        
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
            
            console.log(`✅ ${allHighscores.length} scores chargés`);
            
            if (isUpdate && oldScores.length > 0) {
                animateScoreChanges(oldScores, allHighscores);
            }
            
            updateHighscoresDisplay(isUpdate);
            updateHighscoresResultDisplay(isUpdate);
            
        } else {
            console.log("⚠️ Aucun score trouvé");
            allHighscores = [];
            updateHighscoresDisplay();
            updateHighscoresResultDisplay();
        }
        
    } catch (error) {
        console.error("❌ Erreur chargement scores:", error);
        allHighscores = [];
        updateHighscoresDisplay();
        updateHighscoresResultDisplay();
    }
}

function animateScoreChanges(oldScores, newScores) {
    console.log("🎭 Animation des changements de classement...");
    
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
    console.log(`💾 Sauvegarde: ${score}`);
    
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
            console.log("✅ Score sauvegardé:", result.action);
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
            timerDisplay.style.color = "#ff9800";
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
        } else if (lives === 1) {
            livesDisplay.style.background = "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)";
        } else {
            livesDisplay.style.background = "linear-gradient(135deg, #ff4444 0%, #cc0000 100%)";
        }
    }
}

function shakeLivesDisplay() {
    if (livesDisplay) {
        livesDisplay.classList.add('shake');
        setTimeout(() => livesDisplay.classList.remove('shake'), 500);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function showScreen(screenName) {
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
}

function showMessage(text, type = "info") {
    console.log(`📢 ${text}`);
    
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
        message.style.backgroundColor = "#ff9800";
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
        setTimeout(() => message.remove(), 300);
    }, 4000);
}

function updateHighscoresDisplay(isUpdate = false) {
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
    
    const scoresToShow = isExpandedStart ? allHighscores.length : Math.min(visibleScoresCount, allHighscores.length);
    
    if (allHighscores.length > visibleScoresCount) {
        showMoreScoresBtn.innerHTML = isExpandedStart 
            ? '👆 Voir moins' 
            : `👇 Voir plus (${scoresToShow}/${allHighscores.length})`;
        showMoreScoresBtn.style.display = 'block';
    } else {
        showMoreScoresBtn.style.display = 'none';
    }
    
    allHighscores.slice(0, scoresToShow).forEach((scoreData, index) => {
        const scoreElement = document.createElement("div");
        scoreElement.className = "highscore-item";
        scoreElement.dataset.scoreId = scoreData.id;
        scoreElement.dataset.userId = scoreData.userId;
        scoreElement.style.animationDelay = `${index * 0.15}s`;
        
        if (isUpdate) {
            scoreElement.classList.add('update-animation');
        }
        
        // RÉTABLIR LES CLASSES ORIGINALES POUR LES 3 PREMIÈRES PLACES
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
}

function updateHighscoresResultDisplay(isUpdate = false) {
    if (!highscoresListResult || !showMoreScoresResultBtn) return;
    
    highscoresListResult.innerHTML = "";
    
    if (allHighscores.length === 0) {
        highscoresListResult.innerHTML = '<div class="no-scores"><p>🏆 Aucun score enregistré</p></div>';
        showMoreScoresResultBtn.style.display = 'none';
        return;
    }
    
    const scoresToShow = isExpandedResult ? allHighscores.length : Math.min(visibleScoresCount, allHighscores.length);
    
    if (allHighscores.length > visibleScoresCount) {
        showMoreScoresResultBtn.innerHTML = isExpandedResult 
            ? '👆 Voir moins' 
            : `👇 Voir plus (${scoresToShow}/${allHighscores.length})`;
        showMoreScoresResultBtn.style.display = 'block';
    } else {
        showMoreScoresResultBtn.style.display = 'none';
    }
    
    allHighscores.slice(0, scoresToShow).forEach((scoreData, index) => {
        const scoreElement = document.createElement("div");
        scoreElement.className = "highscore-item";
        scoreElement.dataset.scoreId = scoreData.id;
        scoreElement.dataset.userId = scoreData.userId;
        scoreElement.style.animationDelay = `${index * 0.15}s`;
        
        if (isUpdate) {
            scoreElement.classList.add('update-animation');
        }
        
        // RÉTABLIR LES CLASSES ORIGINALES POUR LES 3 PREMIÈRES PLACES
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
}

function restartQuiz() {
    showScreen('start');
    isExpandedStart = false;
    loadScoresFromSupabase();
}

// ==================== FONCTION POUR METTRE À JOUR LE MESSAGE DE CONNEXION ====================
function updateConnectionMessage() {
    const connectionMessage = document.getElementById("connection-status-message");
    if (!connectionMessage) return;
    
    if (currentUser) {
        connectionMessage.textContent = `✅ Vous êtes connecté avec votre compte : ${currentUser.pseudo}`;
        connectionMessage.className = "connection-status connected";
    } else {
        connectionMessage.textContent = "* Connectez-vous pour sauvegarder votre score";
        connectionMessage.className = "connection-status not-connected";
    }
}

console.log("🎯 Script avec temps réel chargé !");