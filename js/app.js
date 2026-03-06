/* =================================================================
   SCHOOLBOT — TP2 : js/app.js
   Partie 1 : Toggle thème + localStorage
   Partie 3 : Typing indicator
   Partie 5 : Micro-interactions bouton envoi
   ================================================================= */

let currentMode = 'naturel';
let messageCount = 0;

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
        "Vraiment ? C'est tout ce que t'as trouvé ? 😏",
        "Oh wow, quelle originalité... 🙄",
        "T'as cherché longtemps pour sortir ça ? 💀",
        "Classique. Prévisible. Décevant. 😂",
        "C'est mignon. Pour un enfant de 5 ans. 🔥",
        "Je peux pas croire que t'aies osé taper ça 😭",
        "Sérieusement ? On va travailler là-dessus.",
        "Bold move, on verra... Spoiler : non. 👀",
        "Tu veux un trophée ? 🏆 Non.",
        "J'ai vu des IA plus intelligentes en jeux vidéo. 😬"
    ],
    sympathique: [
        "Oh c'est TELLEMENT une bonne question ! 💖",
        "Tu es vraiment brillant(e) ! 🌟",
        "Quelle curiosité magnifique ! 🥰",
        "J'adore que tu poses cette question ! ✨",
        "Tu sais quoi ? T'es incroyable ! 💕",
        "Oh wow, tu réfléchis vraiment bien ! 🌈",
        "Ta question me touche vraiment ! 💓",
        "Quelle belle façon de voir les choses ! 🌸",
        "Tu es une source d'inspiration ! 🦋",
        "Je suis tellement content(e) que tu demandes ça ! 💗"
    ],
    philosophique: [
        "Hmm... La connaissance est-elle vraiment accessible ? 🤔",
        "Comme disait Socrate : 'Je sais que je ne sais rien'... 📚",
        "Mais qu'est-ce qu'une question, sinon une quête de sens ? 🧘",
        "Dans quel monde veux-tu que je réponde ? 🌅",
        "Tout n'est-il pas relatif, finalement ? 💭",
        "La réponse existe-t-elle avant qu'on la cherche ? 🔮",
        "Ton questionnement révèle une sagesse profonde... 🌙",
        "La vraie réponse est peut-être dans la question ? ✨",
        "L'être précède-t-il l'essence, ou l'inverse ? 🌀",
        "Le doute est le commencement de toute philosophie. 📖"
    ],
    motivateur: [
        "OUAIS ! EXCELLENTE QUESTION ! TU GÈRES ! 🚀",
        "C'EST ÇA L'ESPRIT ! CONTINUE COMME ÇA ! 💪",
        "BOOM ! T'as le feu en toi ! 🔥",
        "ON LÂCHE RIEN ! LA QUESTION QU'IL FALLAIT ! ⚡",
        "TU VAS TOUT DÉCHIRER ! J'EN SUIS SÛR ! 🏆",
        "CHAQUE QUESTION TE REND PLUS FORT(E) ! 💯",
        "INCROYABLE ! T'ES UNE MACHINE ! 🎯",
        "LE SUCCÈS C'EST POUR TOI ! FONCE ! 🌟",
        "RIEN NE T'ARRÊTE ! ENCORE ! 🦁",
        "CHAMPION(NE) ! C'EST ÇA QU'ON VEUT ! 🥇"
    ]
};

const keywordResponses = {
    'bonjour': {
        naturel: "Bonjour ! Je suis SchoolBot, comment puis-je t'aider ? 😊",
        roast: "Oh, tu sais dire bonjour. Félicitations. 🙄",
        sympathique: "BONJOUR ! Oh quelle joie ! 💖✨",
        philosophique: "Bonjour... Qu'est-ce que le 'bonjour' sinon une tentative de connexion ? 🧘",
        motivateur: "BONJOUR CHAMPION(NE) ! CETTE JOURNÉE VA ÊTRE INCROYABLE ! 🚀🔥"
    },
    'salut': {
        naturel: "Salut ! Pose-moi des questions ! 🎓",
        roast: "Salut toi-même. T'arrives enfin ? 😏",
        sympathique: "SALUT ! Oh c'est trop bien ! 🥰💕",
        philosophique: "Salut... Un mot, et pourtant tout un univers de sens. 💭",
        motivateur: "SALUT WARRIOR ! PRÊT(E) À TOUT DÉPASSER ? 💪⚡"
    },
    'aide': {
        naturel: "Bien sûr ! Tu peux me parler de tout 😊",
        roast: "T'as besoin d'aide ? Surprise... 🙄",
        sympathique: "Bien sûr que je vais t'aider ! 💖",
        philosophique: "L'aide... qu'est-ce qu'aider vraiment ? 🤔",
        motivateur: "T'AS PAS BESOIN D'AIDE, T'AS BESOIN D'ACTION ! 🔥"
    },
    'merci': {
        naturel: "De rien ! N'hésite pas 😊",
        roast: "Oh, tu sais dire merci. Quelle éducation. 😂",
        sympathique: "Oh non c'est MOI qui te remercie ! 💕🌟",
        philosophique: "La gratitude... vertu cardinale de tout être pensant. 🧘",
        motivateur: "PAS DE MERCI, ON EST UNE ÉQUIPE ! 💪"
    },
    'sens de la vie': {
        naturel: "42, bien sûr ! 😄",
        roast: "42. Prochaine question ? 😏",
        sympathique: "Le sens de la vie c'est de partager et d'aimer ! 💖",
        philosophique: "Le sens de la vie... peut-être est-ce de poser cette question ? 🤔",
        motivateur: "LE SENS DE LA VIE C'EST DE TOUT DONNER CHAQUE JOUR ! 🔥"
    }
};

function initializeApp() {
    console.log('🚀 Initialisation SchoolBot - TP2...');

    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const clearBtn = document.getElementById('clear-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const modeButtons = document.querySelectorAll('.mode-btn');

    // PARTIE 1 : Thème sauvegardé
    const savedTheme = localStorage.getItem('schoolbot-theme') || 'dark';
    if (savedTheme === 'light') document.body.classList.add('light-theme');

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('schoolbot-theme', currentTheme);
            console.log(`🎨 Thème changé : ${currentTheme}`);
        });
    }

    addBotMessage("👋 Bonjour ! Je suis **SchoolBot TP2** avec des animations !\n\nEssaie le bouton ☀️/🌙 pour changer de thème, et regarde les animations !");

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    clearBtn.addEventListener('click', () => {
        chatContainer.innerHTML = '';
        messageCount = 0;
        addBotMessage("💬 Conversation effacée !");
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

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        addUserMessage(message);
        userInput.value = '';

        // PARTIE 5 : Animation bouton
        sendBtn.classList.add('sending');
        setTimeout(() => sendBtn.classList.remove('sending'), 500);

        // PARTIE 3 : Typing indicator + délai aléatoire
        showTypingIndicator();
        const delay = Math.random() * 1500 + 800;
        setTimeout(() => {
            hideTypingIndicator();
            addBotMessage(generateResponse(message, currentMode));
        }, delay);
    }

    function generateResponse(userMessage, mode) {
        const msg = userMessage.toLowerCase().trim();
        for (const [keyword, modeResponses] of Object.entries(keywordResponses)) {
            if (msg.includes(keyword)) return modeResponses[mode] || modeResponses.naturel;
        }
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
