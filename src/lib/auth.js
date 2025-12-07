// js/auth.js

/**
 * Inscrire un utilisateur avec création automatique du profil joueur
 */
async function signUp(email, password, userData = {}) {
    try {
        console.log('📝 Début inscription pour:', email)
        
        // 1. Inscription dans Auth Supabase
        const { data: authData, error: authError } = await window.supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: userData.displayName || email.split('@')[0],
                    phone: userData.phone || ''
                }
            }
        })

        if (authError) {
            console.error('❌ Erreur auth:', authError)
            throw authError
        }

        console.log('✅ Auth réussie, user ID:', authData.user?.id)

        // 2. Créer le profil joueur
        if (authData.user) {
            await createPlayerProfile(authData.user, userData)
        }

        return {
            success: true,
            user: authData.user,
            message: 'Inscription réussie ! Vous êtes maintenant connecté.'
        }

    } catch (error) {
        console.error('❌ Erreur inscription:', error)
        return {
            success: false,
            error: error.message,
            message: 'Erreur lors de l\'inscription: ' + error.message
        }
    }
}

/**
 * Créer le profil joueur dans la table 'joueurs'
 */
async function createPlayerProfile(user, userData = {}) {
    try {
        const profileData = {
            user_id: user.id,
            email: user.email,
            display_name: userData.displayName || 
                         user.user_metadata?.display_name || 
                         user.email.split('@')[0],
            phone: userData.phone || user.user_metadata?.phone || '',
            provider: user.app_metadata?.provider || 'email',
            is_active: true,
            last_login: new Date().toISOString(),
            scores: [],
            total_games: 0,
            total_points: 0,
            best_score: 0
        }

        console.log('📝 Création profil joueur:', profileData)

        // Insérer dans la table joueurs
        const { data, error } = await window.supabase
            .from('joueurs')
            .insert([profileData])
            .select()
            .single()

        if (error) {
            // Si erreur "duplicate key", le profil existe déjà
            if (error.code === '23505') {
                console.log('ℹ️ Profil joueur déjà existant')
                return { success: true, exists: true }
            }
            throw error
        }

        console.log('✅ Profil joueur créé avec ID:', data.id)
        return { success: true, data }

    } catch (error) {
        console.error('❌ Erreur création profil:', error)
        throw error
    }
}

/**
 * Connexion utilisateur
 */
async function signIn(email, password) {
    try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) throw error

        // Vérifier que le profil joueur existe
        await verifyPlayerProfile(data.user.id)

        return {
            success: true,
            user: data.user,
            message: 'Connexion réussie !'
        }

    } catch (error) {
        console.error('❌ Erreur connexion:', error)
        return {
            success: false,
            error: error.message,
            message: 'Erreur de connexion: ' + error.message
        }
    }
}

/**
 * Déconnexion
 */
async function signOut() {
    try {
        const { error } = await window.supabase.auth.signOut()
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('❌ Erreur déconnexion:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Vérifier si le profil joueur existe, sinon le créer
 */
async function verifyPlayerProfile(userId) {
    try {
        const { data, error } = await window.supabase
            .from('joueurs')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error || !data) {
            console.warn('⚠️ Profil joueur non trouvé, récupération utilisateur...')
            
            // Récupérer l'utilisateur depuis auth
            const { data: userData } = await window.supabase.auth.getUser()
            
            if (userData.user) {
                // Créer le profil
                return await createPlayerProfile(userData.user)
            }
        }

        return data
    } catch (error) {
        console.error('❌ Erreur vérification profil:', error)
        return null
    }
}

/**
 * Récupérer l'utilisateur actuel
 */
async function getCurrentUser() {
    try {
        const { data, error } = await window.supabase.auth.getUser()
        
        if (error) throw error
        
        if (data.user) {
            // Vérifier le profil joueur
            await verifyPlayerProfile(data.user.id)
        }
        
        return data.user
    } catch (error) {
        console.error('❌ Erreur récupération utilisateur:', error)
        return null
    }
}

// Exposer les fonctions au scope global pour les utiliser dans HTML
window.signUp = signUp
window.signIn = signIn
window.signOut = signOut
window.getCurrentUser = getCurrentUser