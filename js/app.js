/* =================================================================
   SCHOOLBOT — TP3 : js/app.js
   Intègre TP1 + TP2 + Module 3 : Base de données JSON
   ================================================================= */

let currentMode = 'naturel';
let messageCount = 0;

// Réponses génériques par mode (fallback quand aucun intent détecté)
const responses = {
    naturel: [
        "Bonne question ! Tu peux me demander des infos sur les étudiants 🤔",
        "Essaie : 'Qui est Amadou ?' ou 'Liste tous les étudiants' 😊",
        "Je peux t'aider à trouver des infos sur n'importe quel étudiant ! 📝",
        "Pose-moi une question sur les étudiants de l'école !"
    ],
    roast: [
        "Vraiment ? C'est tout ce que t'as trouvé ? 😏 Demande-moi un étudiant !",
        "T'as cherché longtemps pour sortir ça ? 💀 Essaie 'Qui est Fatou ?'",
        "Classique. Prévisible. Décevant. 😂 Demande quelque chose d'utile !",
        "Je peux pas croire que t'aies osé taper ça 😭"
    ],
    sympathique: [
        "Oh c'est TELLEMENT une bonne idée de demander ça ! 💖",
        "Tu peux me demander des infos sur les étudiants ! Je t'adore ! 🌟",
        "Quelle curiosité magnifique ! Demande-moi qui tu veux ! 🥰",
        "T'es incroyable ! Pose-moi une question sur nos étudiants ! 💕"
    ],
    philosophique: [
        "Hmm... La connaissance est-elle vraiment accessible ? 🤔 Demande-moi un étudiant.",
        "Qu'est-ce qu'une question, sinon une quête de sens ? 🧘",
        "Tout n'est-il pas relatif ? Essaie 'Qui est Ibrahim ?' 💭",
        "Le doute est le commencement de toute philosophie... 📖"
    ],
    motivateur: [
        "OUAIS ! DEMANDE-MOI UN ÉTUDIANT ET ON VA TOUT DÉCHIRER ! 🚀",
        "C'EST ÇA L'ESPRIT ! ESSAIE 'QUI EST MOUSSA ?' ! 💪",
        "BOOM ! TU VAS TOUT APPRENDRE SUR CES ÉTUDIANTS ! 🔥",
        "ON LÂCHE RIEN ! POSE TA QUESTION ! ⚡"
    ]
};

const keywordResponses = {
    'bonjour': {
        naturel: "Bonjour ! Je suis SchoolBot, pose-moi des questions sur les étudiants ! 😊",
        roast: "Oh, tu sais dire bonjour. Félicitations. 🙄",
        sympathique: "BONJOUR ! Oh quelle joie ! 💖✨",
        philosophique: "Bonjour... Qu'est-ce que le 'bonjour' sinon une tentative de connexion ? 🧘",
        motivateur: "BONJOUR CHAMPION(NE) ! CETTE JOURNÉE VA ÊTRE INCROYABLE ! 🚀🔥"
    },
    'salut': {
        naturel: "Salut ! Je connais 5 étudiants, demande-moi tout ! 🎓",
        roast: "Salut toi-même. T'arrives enfin ? 😏",
        sympathique: "SALUT ! Oh c'est trop bien ! 🥰💕",
        philosophique: "Salut... Un mot, et tout un univers de sens. 💭",
        motivateur: "SALUT WARRIOR ! PRÊT(E) À TOUT APPRENDRE ? 💪⚡"
    },
    'aide': {
        naturel: "Je peux t'aider ! Essaie :\n• 'Qui est Amadou ?'\n• 'Fun fact sur Fatou'\n• 'Liste tous les étudiants'\n• 'Combien d\\'étudiants ?' 😊",
        roast: "T'as besoin d'aide ? Demande un étudiant, c'est pas si compliqué. 🙄",
        sympathique: "Bien sûr ! Tu peux tout me demander sur les étudiants ! 💖",
        philosophique: "L'aide... qu'est-ce qu'aider vraiment ? Demande-moi un étudiant. 🤔",
        motivateur: "T'AS PAS BESOIN D'AIDE, T'AS BESOIN D'ACTION ! DEMANDE UN ÉTUDIANT ! 🔥"
    },
    'merci': {
        naturel: "De rien ! N'hésite pas 😊",
        roast: "Oh, tu sais dire merci. Quelle éducation. 😂",
        sympathique: "Oh non c'est MOI qui te remercie ! 💕🌟",
        philosophique: "La gratitude... vertu cardinale de tout être pensant. 🧘",
        motivateur: "PAS DE MERCI, ON EST UNE ÉQUIPE ! 💪"
    }
};

// ============================================
// INITIALISATION
// ============================================
function initializeApp() {
    console.log('🚀 Initialisation SchoolBot - TP3...');

    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const clearBtn = document.getElementById('clear-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const modeButtons = document.querySelectorAll('.mode-btn');

    // Thème sauvegardé
    const savedTheme = localStorage.getItem('schoolbot-theme') || 'dark';
    if (savedTheme === 'light') document.body.classList.add('light-theme');

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const t = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('schoolbot-theme', t);
        });
    }

    // ============================================
    // MODULE 3 : Chargement des données JSON
    // ============================================
    chargerDonneesEtudiants().then(data => {
        if (data) {
            addBotMessage(`🎓 Données chargées ! Je connais **${data.etudiants.length} étudiants** de **${data.etablissement}** !\n\nEssaie : "Qui est Amadou ?" ou "Liste tous les étudiants" 😊`);
        } else {
            addBotMessage("⚠️ Impossible de charger les données. Lance le projet avec un serveur local !\n\n```\npython -m http.server 8000\n```");
        }
    });

    // Événements
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    clearBtn.addEventListener('click', () => {
        chatContainer.innerHTML = '';
        messageCount = 0;
        addBotMessage("💬 Conversation effacée ! Recommençons 😊");
    });

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            const msgs = {
                naturel: "Mode Naturel activé 😊",
                roast: "Mode Roast activé... 🔥",
                sympathique: "Mode Sympathique activé ! 💖",
                philosophique: "Mode Philosophique activé... 🧘",
                motivateur: "MODE MOTIVATEUR ! ON VA TOUT DÉCHIRER ! 🚀💪"
            };
            addBotMessage(msgs[currentMode]);
        });
    });

    // Exposer sendMessage pour les suggestions
    window.triggerSend = sendMessage;

    // ============================================
    // FONCTIONS INTERNES
    // ============================================

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addUserMessage(message);
        userInput.value = '';

        sendBtn.classList.add('sending');
        setTimeout(() => sendBtn.classList.remove('sending'), 500);

        showTypingIndicator();
        const delay = Math.random() * 1500 + 800;
        setTimeout(() => {
            hideTypingIndicator();
            addBotMessage(generateResponse(message, currentMode));
        }, delay);
    }

    // ============================================
    // MODULE 3 : Génération de réponses avec données JSON
    // ============================================
    function generateResponse(userMessage, mode) {
        const msg = userMessage.toLowerCase().trim();

        // Mots-clés simples en priorité
        for (const [keyword, modeResponses] of Object.entries(keywordResponses)) {
            if (msg.includes(keyword)) return modeResponses[mode] || modeResponses.naturel;
        }

        // Si données chargées → interpréter la question
        if (donneesChargees()) {
            const intent = interpreterQuestion(userMessage);

            switch(intent.type) {
                case 'presentation': {
                    if (!intent.nom) return "Pour qui ? Donne-moi un prénom ! 😊";
                    const etudiants = rechercherEtudiant(intent.nom);
                    if (etudiants.length > 0) return presenterEtudiant(etudiants[0], mode);
                    return `Je ne connais pas "${intent.nom}" 🤔\nÉtudiants disponibles : Amadou, Fatou, Moussa, Aïssatou, Ibrahim`;
                }
                case 'funfact': {
                    const nom = intent.nom;
                    const etudiant = nom ? rechercherEtudiant(nom)[0] : etudiantAleatoire();
                    if (etudiant) return `🎉 Fun fact sur **${etudiant.prenom}** :\n\n${funFactAleatoire(etudiant)}`;
                    return `Je ne connais pas cette personne 🤷`;
                }
                case 'statistiques': {
                    const stats = studentsData.stats;
                    return `📊 **Statistiques de ${studentsData.etablissement} :**\n\n👥 Total : ${stats.totalEtudiants} étudiants\n🎓 Filières : ${stats.filieres.join(', ')}\n📦 Projets cumulés : ${stats.totalProjets}\n☕ Cafés/jour total : ${stats.totalCafes}`;
                }
                case 'liste': {
                    const liste = studentsData.etudiants
                        .map(e => `• ${e.photo} **${e.prenom} ${e.nom}** — ${e.filiere} (${e.niveau})`)
                        .join('\n');
                    return `📋 **Liste des étudiants :**\n\n${liste}`;
                }
                case 'recherche-interet': {
                    const interesses = filtrerParInteret(intent.interet);
                    if (interesses.length > 0) {
                        const noms = interesses.map(e => `• ${e.photo} ${e.prenom} ${e.nom}`).join('\n');
                        return `**${interesses.length} personne(s)** s'intéressent à "${intent.interet}" :\n\n${noms}`;
                    }
                    return `Personne ne s'intéresse à "${intent.interet}" dans ma base 🤷`;
                }
                case 'filiere': {
                    const parFiliere = filtrerParFiliere(intent.filiere);
                    if (parFiliere.length > 0) {
                        const noms = parFiliere.map(e => `• ${e.photo} ${e.prenom} ${e.nom}`).join('\n');
                        return `**${parFiliere.length} étudiant(s)** en ${intent.filiere} :\n\n${noms}`;
                    }
                    return `Aucun étudiant en ${intent.filiere} 🤔`;
                }
                case 'aleatoire': {
                    const rand = etudiantAleatoire();
                    if (rand) return `🎲 Étudiant aléatoire !\n\n${presenterEtudiant(rand, mode)}`;
                    break;
                }
            }
        }

        // Fallback
        const modeResponses = responses[mode] || responses.naturel;
        return modeResponses[Math.floor(Math.random() * modeResponses.length)];
    }

    function showTypingIndicator() {
        if (document.getElementById('typing-indicator')) return;
        const indicator = document.createElement('div');
        indicator.className = 'message bot-message typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </div>
            </div>
        `;
        chatContainer.appendChild(indicator);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        console.log('Hiding indicator...');
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function addBotMessage(text) {
        const div = document.createElement('div');
        div.className = 'message bot-message';
        div.innerHTML = `<div class="message-avatar">🤖</div><div class="message-content">${formatMessage(text)}</div>`;
        chatContainer.appendChild(div);
        scrollToBottom();
        messageCount++;
    }

    function addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'message user-message';
        div.innerHTML = `<div class="message-content">${escapeHtml(text)}</div><div class="message-avatar">👤</div>`;
        chatContainer.appendChild(div);
        scrollToBottom();
        messageCount++;
    }

    function formatMessage(text) {
        return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    function scrollToBottom() { chatContainer.scrollTop = chatContainer.scrollHeight; }
}

document.addEventListener('DOMContentLoaded', initializeApp);
