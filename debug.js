// js/debug.js

async function debugGameStart() {
    // DEBUG: Démarrage du diagnostic (logs supprimés)
    
    // 1. Vérifier l'utilisateur
    const user = await getCurrentUser();
    // Résultat utilisateur non loggé
    
    if (!user) {
        console.error("❌ Erreur: Utilisateur non connecté");
        return;
    }
    
    // 2. Vérifier le profil joueur
    const { data: player, error } = await window.supabase
        .from('joueurs')
        .select('*')
        .eq('user_id', user.id)
        .single();
    
    // Profil joueur non loggé
    
    if (error) {
        console.error("❌ Erreur Supabase:", error);
        
        // Essayer de créer le profil
        // Tentative de création du profil
        const result = await createPlayerProfile(user);
        // Résultat création non loggé
    }
    
    // 3. Vérifier si l'élément HTML existe
    const gameContainer = document.getElementById('quiz-container');
    // Container trouvé (non loggé)
    
    if (!gameContainer) {
        console.error("❌ ERREUR CRITIQUE: #quiz-container n'existe pas dans le HTML!");
        // Indiquer d'ajouter #quiz-container dans le HTML
        return;
    }
    
    // 4. Tester l'affichage simple
    // Test affichage (log supprimé)
    gameContainer.innerHTML = `
        <h1>🎮 QUIZ EN DIRECT</h1>
        <p>Bienvenue ${player?.display_name || user.email}!</p>
        <div style="background: #f0f0f0; padding: 20px; border-radius: 10px;">
            <h3>Question test:</h3>
            <p>Quelle est la capitale de la France?</p>
            <button onclick="alert('Bonne réponse!')">Paris</button>
            <button onclick="alert('Mauvaise réponse!')">Londres</button>
            <button onclick="alert('Mauvaise réponse!')">Berlin</button>
        </div>
    `;
    
    // Diagnostic terminé (log supprimé)
}

// Exécuter quand la page est prête
document.addEventListener('DOMContentLoaded', function() {
    // Page chargée (log supprimé)
    
    // Vérifier si on est sur la page quiz
    if (window.location.pathname.includes('quiz') || 
        document.getElementById('quiz-container')) {
        // Page quiz détectée (log supprimé)
        setTimeout(debugGameStart, 1000);
    }
});

// Exposer la fonction globalement
window.debugGameStart = debugGameStart;