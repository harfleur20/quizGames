// game-notifications.js - VERSION COMPLÈTE CORRIGÉE
// Système de notifications en temps réel pour le quiz

// ==================== VARIABLES DE CONTRÔLE ====================
let notificationQueue = [];
let isShowingNotification = false;
let lastTargetNotificationTime = 0;
const TARGET_NOTIFICATION_COOLDOWN = 30000; // 30 secondes
let targetNotificationCount = 0;
const MAX_TARGET_NOTIFICATIONS = 3;
let lastRankCheckScore = 0;
const RANK_CHECK_INTERVAL = 5;

// ==================== FONCTIONS DE BASE ====================

/**
 * Affiche une notification en jeu
 * @param {string} text - Texte de la notification
 * @param {string} type - Type de notification (success, warning, record, etc.)
 * @param {number} duration - Durée d'affichage en ms
 */
function showInGameNotification(text, type = "success", duration = 3000) {
    const quizScreen = document.getElementById("quiz-screen");
    if (!quizScreen || !quizScreen.classList.contains("active")) {
        return;
    }
    
    const notification = {
        text,
        type,
        duration,
        timestamp: Date.now()
    };
    
    notificationQueue.push(notification);
    
    if (!isShowingNotification) {
        processNextNotification();
    }
}

function processNextNotification() {
    if (notificationQueue.length === 0) {
        isShowingNotification = false;
        return;
    }
    
    isShowingNotification = true;
    const notification = notificationQueue.shift();
    
    createNotificationElement(notification.text, notification.type, notification.duration);
    
    setTimeout(() => {
        processNextNotification();
    }, notification.duration + 500);
}

function createNotificationElement(text, type, duration) {
    const notification = document.createElement("div");
    notification.className = `in-game-notification ${type}`;
    notification.innerHTML = `
        <i class="fa-solid ${getNotificationIcon(type)}"></i>
        <span>${text}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: ${getNotificationTopPosition()};
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateX(100px);
        animation: slideInRight 0.5s ease forwards, 
                   fadeOutRight 0.5s ease ${duration - 500}ms forwards;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
}

function getNotificationTopPosition() {
    const notifications = document.querySelectorAll('.in-game-notification');
    const baseTop = 100;
    const spacing = 10;
    
    if (notifications.length === 0) return `${baseTop}px`;
    
    const lastNotification = notifications[notifications.length - 1];
    const lastTop = parseInt(lastNotification.style.top) || baseTop;
    const lastHeight = lastNotification.offsetHeight || 50;
    
    return `${lastTop + lastHeight + spacing}px`;
}

function getNotificationIcon(type) {
    const icons = {
        success: "fa-check-circle",
        warning: "fa-exclamation-triangle",
        record: "fa-trophy",
        crown: "fa-crown",
        fire: "fa-fire",
        star: "fa-star",
        rocket: "fa-rocket",
        medal: "fa-medal"
    };
    return icons[type] || "fa-bullhorn";
}

function getNotificationColor(type) {
    const colors = {
        success: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
        warning: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
        record: "linear-gradient(135deg, #ffd700 0%, #ff9800 100%)",
        crown: "linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)",
        fire: "linear-gradient(135deg, #ff4444 0%, #ff9800 100%)",
        star: "linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)",
        rocket: "linear-gradient(135deg, #ff4081 0%, #f50057 100%)",
        medal: "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)"
    };
    return colors[type] || colors.success;
}

// ==================== FONCTIONS DE RECORDS ET CLASSEMENT ====================

function checkPersonalRecord(newScore, oldScore) {
    if (newScore > oldScore) {
        const improvement = newScore - oldScore;
        
        let message = "";
        let type = "record";
        
        if (improvement >= 30) {
            message = `💥 MEGA RECORD ! ${newScore}/100 (+${improvement})`;
            type = "fire";
        } else if (improvement >= 20) {
            message = `🚀 EXPLOSION ! ${newScore}/100 (+${improvement})`;
            type = "rocket";
        } else if (improvement >= 10) {
            message = `🎉 RECORD BATTU ! ${newScore}/100 (+${improvement})`;
            type = "record";
        } else {
            message = `📈 Progression ! ${newScore}/100 (+${improvement})`;
            type = "success";
        }
        
        showInGameNotification(message, type, 3000);
        return true;
    }
    return false;
}

function checkTopRankAchievement(currentScore, previousScore = 0) {
    if (!window.allHighscores || window.allHighscores.length === 0) {
        return;
    }
    
    // Vérifier seulement si gain significatif de points
    if (currentScore - lastRankCheckScore < RANK_CHECK_INTERVAL) {
        return;
    }
    
    lastRankCheckScore = currentScore;
    
    // Simuler la position basée sur le score actuel
    let estimatedPosition = window.allHighscores.length + 1;
    
    for (let i = 0; i < window.allHighscores.length; i++) {
        if (currentScore > window.allHighscores[i].score) {
            estimatedPosition = i + 1;
            break;
        }
    }
    
    // Sauvegarder l'ancienne position si non définie
    if (!window.currentUser) window.currentUser = {};
    if (!window.currentUser.estimatedPosition) {
        window.currentUser.estimatedPosition = window.allHighscores.length + 1;
    }
    
    const oldPosition = window.currentUser.estimatedPosition;
    const newPosition = estimatedPosition;
    
    // Vérifier les achievements
    if (newPosition === 1 && oldPosition > 1) {
        const leaderName = window.allHighscores[0]?.name || "le champion";
        showInGameNotification(`👑 NOUVEAU ROI ! Vous détrônez ${leaderName} !`, "crown", 4000);
        triggerCrownAnimation();
    } else if (newPosition <= 3 && oldPosition > 3) {
        showInGameNotification("🥇 ENTREE DANS LE TOP 3 !", "record", 3500);
    } else if (newPosition <= 10 && oldPosition > 10) {
        showInGameNotification("🏅 ENTREE DANS LE TOP 10 !", "medal", 3000);
    } else if (newPosition < oldPosition) {
        const placesGained = oldPosition - newPosition;
        if (placesGained >= 10) {
            showInGameNotification(`🚀 FUSÉE ! +${placesGained} places !`, "rocket", 3000);
        } else if (placesGained >= 5) {
            showInGameNotification(`🔥 +${placesGained} places dans le classement !`, "fire", 2500);
        } else if (placesGained >= 3) {
            showInGameNotification(`📈 +${placesGained} places ! Montez encore !`, "success", 2000);
        }
    }
    
    // Mettre à jour la position estimée
    window.currentUser.estimatedPosition = newPosition;
}

async function checkIfBeatingLeader(currentScore) {
    if (!window.allHighscores || window.allHighscores.length === 0) {
        return false;
    }
    
    const leaderScore = window.allHighscores[0]?.score || 0;
    const leaderName = window.allHighscores[0]?.name || "le champion";
    
    if (currentScore > leaderScore) {
        showInGameNotification(`👑 INCROYABLE ! Vous détrônez ${leaderName} !`, "crown", 4000);
        triggerCrownAnimation();
        return true;
    }
    
    return false;
}

function triggerCrownAnimation() {
    const crown = document.createElement("div");
    crown.innerHTML = "👑";
    crown.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        font-size: 100px;
        z-index: 10000;
        opacity: 0;
        animation: crownFloat 2s ease-out forwards;
        pointer-events: none;
    `;
    
    document.body.appendChild(crown);
    
    setTimeout(() => {
        if (crown.parentNode) {
            crown.remove();
        }
    }, 2000);
}

// ==================== OBJECTIFS ET MILESTONES ====================

function showNextTarget(currentScore, bestScore) {
    const now = Date.now();
    
    // Vérifier les limites
    if (targetNotificationCount >= MAX_TARGET_NOTIFICATIONS) {
        return;
    }
    
    if (now - lastTargetNotificationTime < TARGET_NOTIFICATION_COOLDOWN) {
        return;
    }
    
    if (currentScore < 20 || currentScore > 90) {
        return;
    }
    
    const targets = [30, 40, 50, 60, 70, 80, 90];
    const nextTarget = targets.find(t => t > currentScore);
    
    if (nextTarget) {
        const pointsNeeded = nextTarget - currentScore;
        
        // Ne pas afficher si trop loin ou trop proche
        if (pointsNeeded > 20 || pointsNeeded < 3) {
            return;
        }
        
        const messages = [
            `🎯 Objectif: ${nextTarget}/100 (manque ${pointsNeeded} pts)`,
            `📈 Plus que ${pointsNeeded} points pour ${nextTarget}/100 !`,
            `⚡ ${pointsNeeded} pts pour atteindre ${nextTarget}/100 !`
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showInGameNotification(randomMessage, "warning", 2500);
        
        // Mettre à jour les compteurs
        lastTargetNotificationTime = now;
        targetNotificationCount++;
    }
}

function showMilestoneMessages(score, questionIndex) {
    const milestones = [
        { score: 25, message: "🎯 Premier quart ! Continue !", type: "success" },
        { score: 50, message: "🏅 50/100 ! Excellente moitié !", type: "record" },
        { score: 75, message: "🌟 75/100 ! Dans le top tier !", type: "star" },
        { score: 90, message: "💎 90/100 ! Niveau expert !", type: "crown" },
        { score: 95, message: "🤯 95/100 ! Presque parfait !", type: "fire" }
    ];
    
    milestones.forEach(milestone => {
        if (score === milestone.score) {
            showInGameNotification(milestone.message, milestone.type, 3000);
        }
    });
    
    // Messages de fin de quiz (avec modération)
    if (questionIndex >= 95 && Math.random() > 0.8) {
        const messages = [
            "🏁 Dernière ligne droite !",
            "💥 Tout donner maintenant !",
            "⚡ Plus que quelques questions !"
        ];
        showInGameNotification(messages[Math.floor(Math.random() * messages.length)], "warning", 2000);
    }
}

// ==================== GESTION DES ÉVÉNEMENTS ====================

function setupGameEventListeners() {
    let lastScore = 0;
    let lastMilestoneScore = 0;
    
    const scoreObserver = new MutationObserver(() => {
        const scoreElement = document.getElementById("score");
        if (scoreElement) {
            const currentScore = parseInt(scoreElement.textContent) || 0;
            const questionElement = document.getElementById("current-question");
            const questionIndex = parseInt(questionElement?.textContent || 1) - 1;
            
            if (currentScore > lastScore) {
                // Milestones
                if (currentScore > lastMilestoneScore) {
                    showMilestoneMessages(currentScore, questionIndex);
                    lastMilestoneScore = currentScore;
                }
                
                // Record personnel (tous les 10 points)
                if (window.currentUser && currentScore % 10 === 0) {
                    checkPersonalRecord(currentScore, window.currentUser.bestScore || 0);
                }
                
                // Classement (tous les 5 points à partir de 30)
                if (currentScore >= 30 && currentScore % 5 === 0) {
                    checkTopRankAchievement(currentScore, lastScore);
                    
                    // Vérifier détrônement spécifique du leader
                    if (currentScore >= 50) {
                        checkIfBeatingLeader(currentScore);
                    }
                }
                
                // Objectifs (avec modération)
                showNextTarget(currentScore, window.currentUser?.bestScore || 0);
            }
            
            lastScore = currentScore;
        }
    });
    
    const scoreElement = document.getElementById("score");
    if (scoreElement) {
        scoreObserver.observe(scoreElement, { childList: true, characterData: true, subtree: true });
    }
    
    return scoreObserver;
}

// ==================== INITIALISATION ET RÉINITIALISATION ====================

function resetTargetNotifications() {
    targetNotificationCount = 0;
    lastTargetNotificationTime = 0;
    lastRankCheckScore = 0;
    
    // Réinitialiser la position estimée
    if (window.currentUser) {
        window.currentUser.estimatedPosition = window.allHighscores ? window.allHighscores.length + 1 : 999;
    }
}

function initGameNotifications() {
    // Ajouter les styles CSS dynamiquement
    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100px);
                opacity: 0;
            }
        }
        
        @keyframes crownFloat {
            0% {
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 0;
            }
            50% {
                transform: translate(-50%, -150%) scale(1.2);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -300%) scale(0.8);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Réinitialiser les compteurs
    resetTargetNotifications();
    
    // Démarrer l'observateur de score
    setupGameEventListeners();
    
    console.log("✅ Game notifications initialized");
}

// ==================== EXPORT DES FONCTIONS ====================

window.gameNotifications = {
    showInGameNotification,
    checkPersonalRecord,
    checkIfBeatingLeader,
    checkTopRankAchievement,
    showMilestoneMessages,
    showNextTarget,
    initGameNotifications,
    resetTargetNotifications
};