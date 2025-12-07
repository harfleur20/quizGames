// js/debug.js

async function debugGameStart() {
    console.log("🔍 DEBUG: Démarrage du diagnostic...");
    
    // 1. Vérifier l'utilisateur
    const user = await getCurrentUser();
    console.log("✅ Utilisateur:", user ? user.email : "NON CONNECTÉ");
    
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
    
    console.log("✅ Profil joueur:", player ? "EXISTE" : "MANQUANT");
    console.log("Détails joueur:", player);
    
    if (error) {
        console.error("❌ Erreur Supabase:", error);
        
        // Essayer de créer le profil
        console.log("🔄 Tentative de création du profil...");
        const result = await createPlayerProfile(user);
        console.log("Résultat création:", result);
    }
    
    // 3. Vérifier si l'élément HTML existe
    const gameContainer = document.getElementById('quiz-container');
    console.log("✅ Container trouvé:", gameContainer ? "OUI" : "NON");
    
    if (!gameContainer) {
        console.error("❌ ERREUR CRITIQUE: #quiz-container n'existe pas dans le HTML!");
        console.log("Ajoutez dans votre HTML: <div id='quiz-container'></div>");
        return;
    }
    
    // 4. Tester l'affichage simple
    console.log("🔄 Test affichage...");
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
    
    console.log("✅ Diagnostic terminé!");
}

// Exécuter quand la page est prête
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 Page chargée");
    
    // Vérifier si on est sur la page quiz
    if (window.location.pathname.includes('quiz') || 
        document.getElementById('quiz-container')) {
        
        console.log("🎯 Page quiz détectée, lancement debug...");
        setTimeout(debugGameStart, 1000);
    }
});

// Exposer la fonction globalement
window.debugGameStart = debugGameStart;