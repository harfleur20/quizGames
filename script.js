import { quizQuestions } from "./quizQuestion.js";

// Éléments du DOM
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

// NOUVEAUX ÉLÉMENTS pour le bouton "Voir plus"
const showMoreScoresBtn = document.getElementById("show-more-scores");
const showMoreScoresResultBtn = document.getElementById("show-more-scores-result");

// Variables pour gérer l'affichage des scores
let visibleScoresCount = 4;
let allHighscores = [];
let isExpandedStart = false;
let isExpandedResult = false;

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let quizSession = [];
let timer = null;
let timeLeft = 10;
let playerName = "";
let gameStopped = false;
const TOTAL_QUESTIONS = 100;

// Au chargement, afficher les meilleurs scores
window.addEventListener('DOMContentLoaded', () => {
    console.log("Page chargée, questions disponibles:", quizQuestions.length);
    loadAndDisplayHighscores();
    
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
            rulesContent.classList.toggle('visible');
            if (rulesContent.classList.contains('visible')) {
                toggleRulesBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Masquer les règles';
            } else {
                toggleRulesBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Voir les règles du jeu';
            }
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
});

// Event listeners
if (startButton) {
    startButton.addEventListener("click", startQuiz);
}
if (restartButton) {
    restartButton.addEventListener("click", restartQuiz);
}

// Fonction pour charger et afficher les high scores
function loadAndDisplayHighscores() {
    allHighscores = JSON.parse(localStorage.getItem("quizHighscores")) || [];
    allHighscores.sort((a, b) => b.score - a.score);
    updateHighscoresDisplay();
}

// Fonction pour tirer des questions uniques
function getRandomQuiz(quizQuestions, numQuestions = TOTAL_QUESTIONS) {
    const shuffled = [...quizQuestions];
    
    // Mélanger
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Prendre les premières 'numQuestions'
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
}

function startQuiz() {
    console.log("Démarrage du quiz...");
    
    // Récupérer le nom
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
    
    playerName = playerName.substring(0, 10);
    
    // Mettre à jour le nom du joueur dans l'écran quiz
    if (currentPlayerSpan) {
        currentPlayerSpan.textContent = playerName;
    }

    // Réinitialiser l'état
    currentQuestionIndex = 0;
    score = 0;
    gameStopped = false;
    
    // Mettre à jour le score si l'élément existe
    if (scoreSpan) {
        scoreSpan.textContent = score;
    }

    // Générer les questions
    quizSession = getRandomQuiz(quizQuestions, TOTAL_QUESTIONS);
    console.log(`${quizSession.length} questions générées`);

    // Mettre à jour le total si l'élément existe
    if (totalQuestionsSpan) {
        totalQuestionsSpan.textContent = quizSession.length;
    }

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
        timerDisplay.style.color = "#ffffffff";
    }
    
    // Arrêter le timer précédent
    if (timer) {
        clearInterval(timer);
    }
    
    // Démarrer le timer
    timer = setInterval(updateTimer, 1000);

    const currentQuestion = quizSession[currentQuestionIndex];
    
    // Mettre à jour l'affichage
    if (currentQuestionSpan) {
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
    }
    
    if (progressBar) {
        const progressPercent = ((currentQuestionIndex + 1) / quizSession.length) * 100;
        progressBar.style.width = progressPercent + "%";
        
        // Mettre à jour le pourcentage de progression
        if (progressPercentSpan) {
            progressPercentSpan.textContent = Math.round(progressPercent) + "%";
        }
    }
    
    if (questionText) {
        questionText.textContent = currentQuestion.question;
    }

    // Créer les boutons de réponse
    if (answersContainer) {
        answersContainer.innerHTML = "";
        currentQuestion.answers.forEach((answer, index) => {
            const button = document.createElement("button");
            button.textContent = answer.text;
            button.classList.add("answer-btn");
            button.dataset.correct = answer.correct;
            button.addEventListener("click", selectAnswer);
            
            // Animation d'apparition
            button.style.animationDelay = `${index * 0.1}s`;
            button.classList.add('fade-in');
            
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
        } else {
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
    const selectButton = event.target;
    const isCorrect = selectButton.dataset.correct === "true";

    // Marquer les réponses
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
        if (scoreSpan) {
            scoreSpan.textContent = score;
        }

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
    gameStopped = true;
    clearInterval(timer);
    
    setTimeout(() => {
        if (quizScreen && resultScreen) {
            quizScreen.classList.remove("active");
            resultScreen.classList.add("active");
            
            const finalScore = Math.round((score / TOTAL_QUESTIONS) * 100);
            
            if (finalScoreSpan) {
                finalScoreSpan.textContent = finalScore;
            }
            
            // METTRE À JOUR LES INFOS DU JOUEUR
            if (playerResultName) {
                playerResultName.textContent = playerName;
            }
            
            if (questionsDoneSpan) {
                questionsDoneSpan.textContent = score;
            }
            
            if (percentageSpan) {
                percentageSpan.textContent = finalScore + "%";
            }
            
            if (resultMessage) {
                if (finalScore === 100) {
                    resultMessage.textContent = "🏆 PARFAIT ! 100/100 !";
                } else if (finalScore >= 90) {
                    resultMessage.textContent = "🌟 EXCELLENT ! Performance impressionnante !";
                } else if (finalScore >= 80) {
                    resultMessage.textContent = "👍 TRÈS BIEN ! Très bon score !";
                } else if (finalScore >= 70) {
                    resultMessage.textContent = "👏 BIEN JOUÉ ! Bonne performance !";
                } else if (finalScore >= 50) {
                    resultMessage.textContent = "💪 PAS MAL ! Continue à progresser !";
                } else if (finalScore >= 30) {
                    resultMessage.textContent = "📚 COURAGE ! Tu peux faire mieux !";
                } else {
                    resultMessage.textContent = "🎯 NE baisse pas les bras ! Réessaie !";
                }
            }

            saveHighscore(playerName, finalScore);
            loadAndDisplayHighscores();
            updateHighscoresResultDisplay();
        }
    }, 1000);
}

function showResults() {
    clearInterval(timer);
    
    if (quizScreen && resultScreen) {
        quizScreen.classList.remove("active");
        resultScreen.classList.add("active");
        
        const finalScore = 100;
        
        if (finalScoreSpan) {
            finalScoreSpan.textContent = finalScore;
        }
        
        // METTRE À JOUR LES INFOS DU JOUEUR
        if (playerResultName) {
            playerResultName.textContent = playerName;
        }
        
        if (questionsDoneSpan) {
            questionsDoneSpan.textContent = TOTAL_QUESTIONS;
        }
        
        if (percentageSpan) {
            percentageSpan.textContent = "100%";
        }
        
        if (resultMessage) {
            resultMessage.textContent = "🎉 INCROYABLE ! 100/100 QUESTIONS ! TU ES UN CHAMPION LÉGENDAIRE ! 🏆";
        }

        saveHighscore(playerName, finalScore);
        loadAndDisplayHighscores();
        updateHighscoresResultDisplay();
    }
}

function saveHighscore(name, score) {
    const highscores = JSON.parse(localStorage.getItem("quizHighscores")) || [];
    
    const newScore = {
        name: name,
        score: score,
        date: new Date().toLocaleDateString("fr-FR"),
        timestamp: new Date().getTime()
    };
    
    highscores.push(newScore);
    highscores.sort((a, b) => b.score - a.score);
    
    if (highscores.length > 10) {
        highscores.length = 10;
    }
    
    localStorage.setItem("quizHighscores", JSON.stringify(highscores));
}

// Fonction pour afficher les high scores dans l'écran de démarrage (avec limite)
function updateHighscoresDisplay() {
    if (highscoresListStart && showMoreScoresBtn) {
        highscoresListStart.innerHTML = "";
        
        if (allHighscores.length === 0) {
            highscoresListStart.innerHTML = '<div class="no-scores"><p><i class="fa-regular fa-medal" style="color: #ffffff;"></i> Aucun score enregistré</p><p>Soyez le premier champion !</p></div>';
            showMoreScoresBtn.style.display = 'none';
            return;
        }
        
        // Déterminer combien de scores afficher
        const scoresToShow = isExpandedStart ? allHighscores.length : Math.min(visibleScoresCount, allHighscores.length);
        
        // Mettre à jour le texte du bouton
        if (allHighscores.length > visibleScoresCount) {
            if (isExpandedStart) {
                showMoreScoresBtn.innerHTML = '👆 Voir moins de champions';
                showMoreScoresBtn.classList.add('expanded');
            } else {
                showMoreScoresBtn.innerHTML = `👇 Voir plus de champions (${visibleScoresCount}/${allHighscores.length})`;
                showMoreScoresBtn.classList.remove('expanded');
            }
            showMoreScoresBtn.style.display = 'block';
        } else {
            showMoreScoresBtn.style.display = 'none';
        }
        
        // Afficher les scores
        allHighscores.slice(0, scoresToShow).forEach((scoreData, index) => {
            const scoreElement = document.createElement("div");
            scoreElement.className = "highscore-item";
            
            // Animation
            scoreElement.style.animationDelay = `${index * 0.15}s`;
            scoreElement.classList.add('slide-in');
            
            // Classes spéciales pour les 3 premiers
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
}

// Fonction pour afficher les high scores dans l'écran des résultats (avec limite)
function updateHighscoresResultDisplay() {
    if (highscoresListResult && showMoreScoresResultBtn) {
        highscoresListResult.innerHTML = "";
        
        if (allHighscores.length === 0) {
            highscoresListResult.innerHTML = '<div class="no-scores"><p>🏆 Aucun score enregistré</p></div>';
            showMoreScoresResultBtn.style.display = 'none';
            return;
        }
        
        // Déterminer combien de scores afficher
        const scoresToShow = isExpandedResult ? allHighscores.length : Math.min(visibleScoresCount, allHighscores.length);
        
        // Mettre à jour le texte du bouton
        if (allHighscores.length > visibleScoresCount) {
            if (isExpandedResult) {
                showMoreScoresResultBtn.innerHTML = '👆 Voir moins de champions';
                showMoreScoresResultBtn.classList.add('expanded');
            } else {
                showMoreScoresResultBtn.innerHTML = `👇 Voir plus de champions (${visibleScoresCount}/${allHighscores.length})`;
                showMoreScoresResultBtn.classList.remove('expanded');
            }
            showMoreScoresResultBtn.style.display = 'block';
        } else {
            showMoreScoresResultBtn.style.display = 'none';
        }
        
        // Afficher les scores
        allHighscores.slice(0, scoresToShow).forEach((scoreData, index) => {
            const scoreElement = document.createElement("div");
            scoreElement.className = "highscore-item";
            
            // Animation
            scoreElement.style.animationDelay = `${index * 0.15}s`;
            scoreElement.classList.add('slide-in');
            
            // Classes spéciales pour les 3 premiers
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
}

function restartQuiz() {
    if (resultScreen && startScreen) {
        resultScreen.classList.remove("active");
        startScreen.classList.add("active");
        // Réinitialiser l'état du bouton "Voir plus"
        isExpandedStart = false;
        loadAndDisplayHighscores();
    }
}