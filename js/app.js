/* =================================================================
   SCHOOLBOT — TP1 : js/app.js
   Exercices 3, 4, 5 : Modes, mots-clés, debug
   ================================================================= */

// ============================================
// VARIABLES GLOBALES
// ============================================
let currentMode = 'naturel';
let messageCount = 0;

// ============================================
// EXERCICE 3 : Réponses par mode (+ mode philosophique)
// ============================================
const responses = {
    naturel: [
        "Bonne question ! Laisse-moi réfléchir... 🤔",
        "Intéressant ! Tu peux me donner plus de détails ?",
        "Je note ça ! 📝",
        "C'est une bonne perspective !",
        "Hmm, je vois ce que tu veux dire.",
        "Super, continue ! Je t'écoute 😊",
        "Voilà une excellente remarque !",
        "Je comprends ton point de vue.",
        "Très pertinent comme question !",
        "Ah oui, c'est un sujet important !"
    ],
    roast: [
        "Vraiment ? C'est tout ce que t'as trouvé comme question ? 😏",
        "Oh wow, quelle originalité... 🙄",
        "T'as cherché longtemps pour sortir ça ? 💀",
        "Classique. Prévisible. Décevant. 😂",
        "C'est mignon comme question. Pour un enfant de 5 ans. 🔥",
        "Je peux pas croire que t'aies osé taper ça 😭",
        "Sérieusement ? On va devoir travailler là-dessus.",
        "Bold move, on verra si ça paye... Spoiler : non. 👀",
        "Tu veux un trophée pour cette question ? 🏆... Non.",
        "J'ai vu des IA plus intelligentes dans des jeux vidéo. 😬"
    ],
    sympathique: [
        "Oh c'est TELLEMENT une bonne question ! 💖",
        "Tu es vraiment brillant(e) de demander ça ! 🌟",
        "Quelle curiosité magnifique ! 🥰",
        "J'adore que tu poses cette question ! ✨",
        "Tu sais quoi ? T'es incroyable ! 💕",
        "Oh wow, tu réfléchis vraiment bien ! 🌈",
        "Ta question me touche vraiment ! 💓",
        "Quelle belle façon de voir les choses ! 🌸",
        "Tu es une source d'inspiration ! 🦋",
        "Je suis tellement content(e) que tu demandes ça ! 💗"
    ],
    // Exercice 3 : Mode Philosophique
    philosophique: [
        "Hmm... La connaissance est-elle vraiment accessible ? 🤔",
        "Comme disait Socrate : 'Je sais que je ne sais rien'... 📚",
        "Mais qu'est-ce qu'une question, sinon une quête de sens ? 🧘",
        "Dans quel monde veux-tu que je réponde à ça ? 🌅",
        "Tout n'est-il pas relatif, finalement ? 💭",
        "La réponse existe-t-elle avant qu'on la cherche ? 🔮",
        "Ton questionnement révèle déjà une sagesse profonde... 🌙",
        "Peut-être que la vraie réponse est dans la question ? ✨",
        "L'être précède-t-il l'essence, ou l'inverse ? 🌀",
        "Le doute est le commencement de toute philosophie. 📖"
    ]
};

// ============================================
// EXERCICE 3 : Détection de mots-clés (5 minimum)
// ============================================
const keywordResponses = {
    'bonjour': {
        naturel: "Bonjour ! Je suis SchoolBot, comment puis-je t'aider ? 😊",
        roast: "Oh, tu sais dire bonjour. Félicitations pour cet exploit. 🙄",
        sympathique: "BONJOUR ! Oh quelle joie de te voir ici ! 💖✨",
        philosophique: "Bonjour... Mais qu'est-ce que le 'bonjour' sinon une tentative de connexion humaine ? 🧘"
    },
    'salut': {
        naturel: "Salut ! Pose-moi des questions, je suis là pour toi ! 🎓",
        roast: "Salut toi-même. T'arrives enfin ? On t'attendait... jamais. 😏",
        sympathique: "SALUT ! Oh c'est trop bien que tu sois là ! 🥰💕",
        philosophique: "Salut... Un simple mot, et pourtant tout un univers de sens. 💭"
    },
    'aide': {
        naturel: "Bien sûr ! Tu peux me poser des questions sur tes cours, les étudiants, ou juste discuter 😊",
        roast: "T'as besoin d'aide ? Surprise surprise... 🙄 Demande toujours.",
        sympathique: "Bien sûr que je vais t'aider ! Tu peux TOUT me demander ! 💖",
        philosophique: "L'aide... une notion complexe. Qu'est-ce qu'aider vraiment ? 🤔"
    },
    'merci': {
        naturel: "De rien ! N'hésite pas si t'as d'autres questions 😊",
        roast: "Oh, tu sais dire merci aussi. Quelle éducation. 😂",
        sympathique: "Oh non c'est MOI qui te remercie d'être là ! 💕🌟",
        philosophique: "La gratitude... vertu cardinale de tout être pensant. 🧘"
    },
    'sens de la vie': {
        naturel: "42, bien sûr ! 😄 (Référence au Hitchhiker's Guide !)",
        roast: "42. T'es content(e) ? Question suivante ? 😏",
        sympathique: "Le sens de la vie, c'est de partager, apprendre et aimer ! 💖",
        philosophique: "Le sens de la vie... peut-être est-ce précisément de poser cette question ? 🤔"
    },
    'au revoir': {
        naturel: "Au revoir ! À bientôt 👋😊",
        roast: "Enfin ! ... Je rigole. Reviens quand tu veux. 😏",
        sympathique: "Oh nooon ! Reviens vite ! Je vais tellement te manquer ! 💕",
        philosophique: "Partir... n'est-ce pas simplement commencer un nouveau chapitre ? 🌅"
    },
    'comment tu vas': {
        naturel: "Je suis un bot, donc toujours au top ! 😄 Et toi ?",
        roast: "Je vais mieux maintenant que... non, je mens. Pareil. 😐",
        sympathique: "Je vais SUPER bien maintenant que tu es là ! 💖🌟",
        philosophique: "'Aller bien'... qu'est-ce que cela signifie vraiment ? 🧘"
    }
};

// ============================================
// INITIALISATION
// ============================================
function initializeApp() {
    console.log('🚀 Initialisation du SchoolBot - TP1...');

    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const clearBtn = document.getElementById('clear-btn');
    const modeButtons = document.querySelectorAll('.mode-btn');

    // Message de bienvenue
    addBotMessage("👋 Bonjour ! Je suis **SchoolBot**, ton assistant scolaire !\n\nEssaie de me dire 'Bonjour', 'Au revoir', ou change de mode pour voir comment je réagis !");

    // Envoi avec bouton
    sendBtn.addEventListener('click', sendMessage);

    // Envoi avec Entrée
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Effacer
    clearBtn.addEventListener('click', () => {
        chatContainer.innerHTML = '';
        messageCount = 0;
        addBotMessage("💬 Conversation effacée ! On repart à zéro 😊");
    });

    // Changement de mode
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;

            const modeMessages = {
                naturel: "Mode Naturel activé 😊",
                roast: "Mode Roast activé... T'es prêt(e) ? 🔥",
                sympathique: "Mode Sympathique activé ! 💖",
                philosophique: "Mode Philosophique activé... Plongeons dans la pensée. 🧘"
            };
            addBotMessage(modeMessages[currentMode]);
        });
    });

    // ============================================
    // Fonctions internes (closures)
    // ============================================

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Exercice 5 : Debug console.log
        console.log('Message envoyé:', message);
        console.log('Mode actuel:', currentMode);
        console.log('Nombre de messages:', document.querySelectorAll('.message').length);

        addUserMessage(message);
        userInput.value = '';

        // Réponse après délai
        setTimeout(() => {
            const response = generateResponse(message, currentMode);
            addBotMessage(response);
        }, 600);
    }

    function generateResponse(userMessage, mode) {
        const msg = userMessage.toLowerCase().trim();

        // Vérification mots-clés
        for (const [keyword, modeResponses] of Object.entries(keywordResponses)) {
            if (msg.includes(keyword)) {
                return modeResponses[mode] || modeResponses.naturel;
            }
        }

        // Réponse aléatoire selon le mode
        const modeResponses = responses[mode] || responses.naturel;
        const randomIndex = Math.floor(Math.random() * modeResponses.length);
        return modeResponses[randomIndex];
    }

    function addBotMessage(text) {
        const div = document.createElement('div');
        div.className = 'message bot-message';
        div.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">${formatMessage(text)}</div>
        `;
        chatContainer.appendChild(div);
        scrollToBottom();
        messageCount++;

        // Exercice 5 : Debug
        console.log('Nombre de messages:', document.querySelectorAll('.message').length);
    }

    function addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'message user-message';
        div.innerHTML = `
            <div class="message-content">${escapeHtml(text)}</div>
            <div class="message-avatar">👤</div>
        `;
        chatContainer.appendChild(div);
        scrollToBottom();
        messageCount++;
    }

    function formatMessage(text) {
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// Lancement
document.addEventListener('DOMContentLoaded', initializeApp);
