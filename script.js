import { quizQuestions } from "./quizQuestion.js";

// ==================== ÉLÉMENTS DU DOM ====================
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
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
const playerNameInput = document.getElementById("player-name");

// Éléments pour les règles et high scores
const highscoresListStart = document.getElementById("highscores-list-start");
const highscoresListResult = document.getElementById("highscores-list-result");
const playerResultName = document.getElementById("player-result-name");
const questionsDoneSpan = document.getElementById("questions-done");
const percentageSpan = document.getElementById("percentage");
const currentPlayerSpan = document.getElementById("current-player");

// Éléments pour les règles
const rulesContent = document.getElementById("rules-content");
const toggleRulesBtn = document.getElementById("toggle-rules");
const progressPercentSpan = document.getElementById("progress-percent");

// Boutons "Voir plus"
const showMoreScoresBtn = document.getElementById("show-more-scores");
const showMoreScoresResultBtn = document.getElementById("show-more-scores-result");

// ==================== VARIABLES GLOBALES ====================
let visibleScoresCount = 4;
let allHighscores = [];
let isExpandedStart = false;
let isExpandedResult = false;

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
let playerName = "";
let gameStopped = false;
const TOTAL_QUESTIONS = 100;

// ==================== INITIALISATION ====================
window.addEventListener('DOMContentLoaded', () => {
    console.log("🎮 QUIZ CHAMPIONS - SUPABASE EDITION");
    
    // Charger les scores depuis Supabase
    loadScoresFromSupabase();
    
    // Activer/désactiver le bouton start selon le nom
    if (playerNameInput && startButton) {
        playerNameInput.addEventListener('input', () => {
            const hasName = playerNameInput.value.trim().length > 0;
            startButton.disabled = !hasName;
            startButton.style.opacity = hasName ? '1' : '0.5';
        });
    }
    
    // Gestion du toggle des règles
    if (toggleRulesBtn && rulesContent) {
        toggleRulesBtn.addEventListener('click', () => {
            const isVisible = rulesContent.classList.toggle('visible');
            toggleRulesBtn.innerHTML = isVisible 
                ? '<i class="fa-solid fa-eye-slash"></i> Masquer les règles'
                : '<i class="fa-solid fa-eye"></i> Voir les règles du jeu';
        });
    }
    
    // Bouton "Voir plus" pour l'écran de démarrage
    if (showMoreScoresBtn) {
        showMoreScoresBtn.addEventListener('click', () => {
            isExpandedStart = !isExpandedStart;
            updateHighscoresDisplay();
        });
    }
    
    // Bouton "Voir plus" pour l'écran des résultats
    if (showMoreScoresResultBtn) {
        showMoreScoresResultBtn.addEventListener('click', () => {
            isExpandedResult = !isExpandedResult;
            updateHighscoresResultDisplay();
        });
    }
    
    console.log("✅ Initialisation terminée");
});

// ==================== ÉVÉNEMENTS ====================
if (startButton) {
    startButton.addEventListener("click", startQuiz);
}
if (restartButton) {
    restartButton.addEventListener("click", restartQuiz);
}

// ==================== FONCTIONS SUPABASE ====================
async function loadScoresFromSupabase() {
    console.log("📥 Chargement des scores depuis Supabase...");
    
    try {
        if (!window.supabaseFunctions || !window.supabaseFunctions.getHighScoresFromSupabase) {
            showMessage("⚠️ Supabase non configuré", "error");
            return;
        }
        
        const result = await window.supabaseFunctions.getHighScoresFromSupabase(20);
        
        if (result.success && result.data) {
            console.log("📊 Données reçues:", result.data);
            
            allHighscores = result.data.map(item => ({
                name: item.name,
                score: item.score,
                // MODIFIÉ : utiliser 'created_at' au lieu de 'date'
                date: item.created_at ? formatDate(item.created_at) : "Aujourd'hui",
                timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now()
            }));
            
            console.log(`✅ ${allHighscores.length} scores chargés`);
            updateHighscoresDisplay();
            updateHighscoresResultDisplay();
            
        } else {
            showMessage("⚠️ Aucun score trouvé", "warning");
            allHighscores = [];
        }
        
    } catch (error) {
        console.error("❌ Erreur chargement scores:", error);
        showMessage("❌ Impossible de charger les scores", "error");
        allHighscores = [];
    }
}

async function saveScoreToSupabase(name, score) {
    console.log(`💾 Sauvegarde sur Supabase: ${name} - ${score}`);
    
    try {
        if (!window.supabaseFunctions || !window.supabaseFunctions.saveScoreToSupabase) {
            throw new Error("Fonctions Supabase non disponibles");
        }
        
        const result = await window.supabaseFunctions.saveScoreToSupabase(name, score);
        
        if (result.success) {
            console.log("✅ Score sauvegardé avec succès");
            showMessage("✅ Score enregistré !", "success");
            
            // Recharger les scores après un délai
            setTimeout(() => loadScoresFromSupabase(), 2000);
            return true;
            
        } else {
            throw new Error(result.error || "Erreur inconnue");
        }
        
    } catch (error) {
        console.error("❌ Erreur sauvegarde:", error);
        showMessage(`❌ Échec sauvegarde: ${error.message}`, "error");
        return false;
    }
}

// ==================== FONCTIONS DU QUIZ ====================
function getRandomQuiz(quizQuestions, numQuestions = TOTAL_QUESTIONS) {
    const shuffled = [...quizQuestions];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
}

function startQuiz() {
    console.log("🚀 Démarrage du quiz...");
    
    if (!playerNameInput) {
        alert("Erreur: Champ nom manquant!");
        return;
    }
    
    playerName = playerNameInput.value.trim();
    if (playerName === "") {
        alert("Veuillez entrer votre nom pour commencer !");
        playerNameInput.focus();
        return;
    }
    
    playerName = playerName.substring(0, 15);
    
    // Réinitialiser l'état
    lives = 2;
    currentQuestionIndex = 0;
    score = 0;
    gameStopped = false;
    
    // Mettre à jour l'affichage
    if (currentPlayerSpan) currentPlayerSpan.textContent = playerName;
    
    livesDisplay = document.getElementById("lives-display");
    livesCount = document.getElementById("lives-count");
    
    if (livesCount) livesCount.textContent = lives;
    if (livesDisplay) updateLivesDisplay();
    if (scoreSpan) scoreSpan.textContent = score;
    
    // Générer les questions
    quizSession = getRandomQuiz(quizQuestions, TOTAL_QUESTIONS);
    console.log(`📝 ${quizSession.length} questions générées`);
    
    if (totalQuestionsSpan) totalQuestionsSpan.textContent = quizSession.length;
    
    // Changer d'écran
    if (startScreen && quizScreen) {
        startScreen.classList.remove("active");
        quizScreen.classList.add("active");
        showQuestion();
    }
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
            if (quizScreen && resultScreen) {
                showFinalResults();
            }
        }, 1500);
    }
}

function showFinalResults() {
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");
    
    const finalScore = Math.round((score / TOTAL_QUESTIONS) * 100);
    
    if (finalScoreSpan) finalScoreSpan.textContent = finalScore;
    if (playerResultName) playerResultName.textContent = playerName;
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
    
    // SAUVEGARDE SUPABASE SEULEMENT
    saveScoreToSupabase(playerName, finalScore);
    updateHighscoresResultDisplay();
}

function showResults() {
    clearInterval(timer);
    
    if (quizScreen && resultScreen) {
        quizScreen.classList.remove("active");
        resultScreen.classList.add("active");
        
        const finalScore = 100;
        
        if (finalScoreSpan) finalScoreSpan.textContent = finalScore;
        if (playerResultName) playerResultName.textContent = playerName;
        if (questionsDoneSpan) questionsDoneSpan.textContent = TOTAL_QUESTIONS;
        if (percentageSpan) percentageSpan.textContent = "100%";
        
        if (resultMessage) {
            resultMessage.textContent = lives > 0 
                ? `🎉 INCROYABLE ! 100/100 ! ${lives} vie${lives > 1 ? 's' : ''} restante${lives > 1 ? 's' : ''} ! 🏆`
                : "🎉 CHAMPION LÉGENDAIRE ! 100/100 ! 🏆";
        }
        
        // SAUVEGARDE SUPABASE SEULEMENT
        saveScoreToSupabase(playerName, finalScore);
        updateHighscoresResultDisplay();
    }
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

function showMessage(text, type = "info") {
    console.log(`📢 ${text}`);
    
    // Supprimer les anciens messages
    const oldMessages = document.querySelectorAll('.quiz-message');
    oldMessages.forEach(msg => msg.remove());
    
    // Créer le nouveau message
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
    
    // Couleur selon le type
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
    
    // Animation
    setTimeout(() => {
        message.style.opacity = "1";
        message.style.transform = "translateX(0)";
    }, 10);
    
    // Disparaître après 4 secondes
    setTimeout(() => {
        message.style.opacity = "0";
        message.style.transform = "translateX(100px)";
        setTimeout(() => message.remove(), 300);
    }, 4000);
}

function updateHighscoresDisplay() {
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
        scoreElement.style.animationDelay = `${index * 0.15}s`;
        scoreElement.classList.add('slide-in');
        
        if (index === 0) scoreElement.classList.add("first-place");
        if (index === 1) scoreElement.classList.add("second-place");
        if (index === 2) scoreElement.classList.add("third-place");
        
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

function updateHighscoresResultDisplay() {
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
        scoreElement.style.animationDelay = `${index * 0.15}s`;
        scoreElement.classList.add('slide-in');
        
        if (index === 0) scoreElement.classList.add("first-place");
        if (index === 1) scoreElement.classList.add("second-place");
        if (index === 2) scoreElement.classList.add("third-place");
        
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
    if (resultScreen && startScreen) {
        resultScreen.classList.remove("active");
        startScreen.classList.add("active");
        isExpandedStart = false;
        loadScoresFromSupabase();
    }
}

console.log("🎯 Script 100% Supabase chargé !");
