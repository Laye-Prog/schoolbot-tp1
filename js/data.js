/* =================================================================
   SCHOOLBOT - MODULE 3 : GESTION DES DONNÉES
   Fichier: js/data.js
   ================================================================= */

let studentsData = null;

// ============================================
// CHARGEMENT DES DONNÉES
// ============================================

async function chargerDonneesEtudiants() {
    try {
        console.log('📥 Chargement des données étudiants...');
        const response = await fetch('data/students.json');
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();
        if (!data.etudiants || !Array.isArray(data.etudiants)) throw new Error('Format invalide');
        studentsData = data;
        console.log(`✅ ${data.etudiants.length} étudiants chargés`);
        return data;
    } catch (error) {
        console.error('❌ Erreur de chargement:', error);
        return null;
    }
}

function donneesChargees() {
    return studentsData !== null && studentsData.etudiants.length > 0;
}

// ============================================
// FONCTIONS DE RECHERCHE
// ============================================

function rechercherEtudiant(nom) {
    if (!donneesChargees()) return [];
    const nomLower = nom.toLowerCase().trim();
    return studentsData.etudiants.filter(etudiant => {
        const prenomMatch = etudiant.prenom.toLowerCase().includes(nomLower);
        const nomMatch = etudiant.nom.toLowerCase().includes(nomLower);
        const nomComplet = `${etudiant.prenom} ${etudiant.nom}`.toLowerCase();
        const nomCompletInverse = `${etudiant.nom} ${etudiant.prenom}`.toLowerCase();
        return prenomMatch || nomMatch || nomComplet.includes(nomLower) || nomCompletInverse.includes(nomLower);
    });
}

function trouverParId(id) {
    if (!donneesChargees()) return null;
    return studentsData.etudiants.find(e => e.id === id);
}

function filtrerParFiliere(filiere) {
    if (!donneesChargees()) return [];
    const filiereLower = filiere.toLowerCase();
    return studentsData.etudiants.filter(e => e.filiere.toLowerCase().includes(filiereLower));
}

function filtrerParInteret(interet) {
    if (!donneesChargees()) return [];
    const interetLower = interet.toLowerCase();
    return studentsData.etudiants.filter(e =>
        e.interets.some(i => i.toLowerCase().includes(interetLower))
    );
}

function funFactAleatoire(etudiant) {
    if (!etudiant || !etudiant.funFacts || etudiant.funFacts.length === 0) return "Pas de fun fact disponible";
    const index = Math.floor(Math.random() * etudiant.funFacts.length);
    return etudiant.funFacts[index];
}

function etudiantAleatoire() {
    if (!donneesChargees()) return null;
    const index = Math.floor(Math.random() * studentsData.etudiants.length);
    return studentsData.etudiants[index];
}

// ============================================
// GÉNÉRATION DE RÉPONSES
// ============================================

function presenterEtudiant(etudiant, mode = 'naturel') {
    switch(mode) {
        case 'roast': return genererPresentationRoast(etudiant);
        case 'sympathique': return genererPresentationSympathique(etudiant);
        case 'philosophique': return genererPresentationPhilosophique(etudiant);
        case 'motivateur': return genererPresentationMotivateur(etudiant);
        default: return genererPresentationNaturelle(etudiant);
    }
}

function genererPresentationNaturelle(e) {
    return `📋 **${e.prenom} ${e.nom}** (${e.age} ans) ${e.photo}

🎓 **Formation :** ${e.filiere} — ${e.niveau}

👤 **Personnalité :** ${e.personnalite.traits.join(', ')}
💪 **Force :** ${e.personnalite.force}
😅 **Faiblesse :** ${e.personnalite.faiblesse}

✨ **Fun Facts :**
${e.funFacts.map(f => `• ${f}`).join('\n')}

🎯 **Intérêts :** ${e.interets.join(', ')}

💬 **Citation :** "${e.citation}"

📊 **Stats :** ${e.statistiques.projetsRealises} projets | ${e.statistiques.cafeParJour} ☕/jour | ${e.statistiques.lignesDeCode.toLocaleString()} lignes de code`;
}

function genererPresentationRoast(e) {
    return `🔥 Ah, **${e.prenom} ${e.nom}** ! Parlons-en...

"${e.personnalite.traits[0]}" ? Si tu le dis... 🙄

En **${e.filiere}**, classique. Et cette faiblesse "${e.personnalite.faiblesse}" ? On avait remarqué depuis longtemps ! 💀

${e.statistiques.cafeParJour} cafés par jour ? C'est pas du sang qui coule dans tes veines, c'est de la **caféine pure** ! ☕😂

Fun fact ? "${e.funFacts[0]}". Cool story bro, on s'en souviendra... probablement pas. 👻

Et cette citation : "${e.citation}". Profond. T'as trouvé ça sur Google en 30 secondes ? 😏

Mais bon, ${e.statistiques.projetsRealises} projets c'est pas mal pour quelqu'un qui procrastine autant ! 🫡`;
}

function genererPresentationSympathique(e) {
    return `💖 Oh, **${e.prenom}** ! Quelle personne absolument formidable !

${e.prenom} est tellement ${e.personnalite.traits[0]}, ${e.personnalite.traits[1]} et ${e.personnalite.traits[2]} ! 🌟 Le monde a BESOIN de plus de personnes comme ça !

**Fun fact adorable :** ${e.funFacts[0]} 🥰 N'est-ce pas incroyable ?!

En **${e.filiere}**, ${e.prenom} brille vraiment ! Avec ${e.statistiques.projetsRealises} projets à son actif, c'est juste ÉPOUSTOUFLANT ! 👏✨

Sa force en "${e.personnalite.force}" est un vrai don, et même sa "faiblesse" "${e.personnalite.faiblesse}" est en réalité une qualité déguisée ! 💕

Sa citation : "${e.citation}" 🌈 Magnifique !`;
}

function genererPresentationPhilosophique(e) {
    return `🧘 Contemplons **${e.prenom} ${e.nom}**...

Dans ce monde numérique en perpétuelle mutation, que signifie vraiment être "${e.personnalite.traits[0]}" ? 🤔

${e.prenom} étudie **${e.filiere}**... Mais la connaissance est-elle une destination ou un voyage sans fin ?

"${e.citation}" — Ces mots résonnent-ils avec une vérité universelle, ou ne sont-ils que le reflet d'une époque particulière ? 💭

${e.statistiques.lignesDeCode.toLocaleString()} lignes de code... Chaque ligne est-elle une pensée matérialisée, une trace de conscience dans la machine ?

La frontière entre "${e.personnalite.force}" et "${e.personnalite.faiblesse}" n'est-elle pas qu'une question de perspective et de contexte ? 🌅

Socrate disait : "Je sais que je ne sais rien." ${e.prenom} sait-il/elle vraiment ce qu'il/elle sait ? 🔮`;
}

function genererPresentationMotivateur(e) {
    return `🚀 **${e.prenom} ${e.nom}** — UNE MACHINE DE GUERRE ! ${e.photo}

TU VEUX SAVOIR POURQUOI ${e.prenom.toUpperCase()} VA RÉUSSIR ? PARCE QUE :

💪 ${e.statistiques.projetsRealises} projets réalisés ! LA BÊTE NE S'ARRÊTE PAS !
⚡ "${e.personnalite.force}" — C'est son SUPERPOUVOIR !
☕ ${e.statistiques.cafeParJour} cafés/jour = ${e.statistiques.cafeParJour} fois plus d'ÉNERGIE que les autres !

"${e.citation}" — Ces mots ne sont pas juste une citation, c'est un MODE DE VIE ! 🔥

${e.funFacts[0]} — INCROYABLE mais VRAI !

${e.statistiques.lignesDeCode.toLocaleString()} lignes de code et on n'est même pas au maximum ! LA SUITE SERA ENCORE PLUS GRANDE ! 💯🏆`;
}

// ============================================
// INTERPRÉTATION DES QUESTIONS
// ============================================

function interpreterQuestion(question) {
    const q = question.toLowerCase().trim();

    if (q.includes('qui est') || q.includes('parle') || q.includes('connais') || q.includes('présente')) {
        const nom = extraireNom(question);
        return { type: 'presentation', nom };
    }
    if (q.includes('fun fact') || q.includes('anecdote') || q.includes('raconte')) {
        const nom = extraireNom(question);
        return { type: 'funfact', nom };
    }
    if (q.includes('combien')) {
        return { type: 'statistiques' };
    }
    if (q.includes('liste') || q.includes('tous les') || q.includes('tout le monde') || q.includes('étudiants')) {
        return { type: 'liste' };
    }
    if (q.includes('qui aime') || q.includes('qui adore') || q.includes('intéresse') || q.includes('s\'intéresse')) {
        const interet = extraireInteret(question);
        return { type: 'recherche-interet', interet };
    }
    if (q.includes('hasard') || q.includes('aléatoire') || q.includes('surprise') || q.includes('quelqu\'un')) {
        return { type: 'aleatoire' };
    }

    const filieres = ['informatique', 'cyber', 'réseau', 'web', 'data', 'mobile', 'ia', 'devops', 'télécoms', 'design'];
    for (const filiere of filieres) {
        if (q.includes(filiere)) {
            return { type: 'filiere', filiere };
        }
    }

    return { type: 'inconnu' };
}

function extraireNom(question) {
    const patterns = [
        /qui est (.+?)[\?\.!]/i,
        /parle.*?de (.+?)[\?\.!]/i,
        /à propos de (.+?)[\?\.!]/i,
        /connais(.+?)[\?\.!]/i,
        /fun fact.*?sur (.+?)[\?\.!]/i,
        /présente.*?(.+?)[\?\.!]/i
    ];
    for (const pattern of patterns) {
        const match = question.match(pattern);
        if (match && match[1]) return match[1].trim();
    }
    const mots = question.toLowerCase().split(' ');
    const indexDe = mots.indexOf('de');
    const indexEst = mots.indexOf('est');
    if (indexEst > -1) return mots.slice(indexEst + 1).join(' ').replace(/[?\.!]/g, '').trim();
    if (indexDe > -1) return mots.slice(indexDe + 1).join(' ').replace(/[?\.!]/g, '').trim();
    return '';
}

function extraireInteret(question) {
    const patterns = [
        /qui aime (.+?)[\?\.!]/i,
        /qui adore (.+?)[\?\.!]/i,
        /s'intéresse.*?à (.+?)[\?\.!]/i,
        /intéresse.*?(.+?)[\?\.!]/i
    ];
    for (const pattern of patterns) {
        const match = question.match(pattern);
        if (match && match[1]) return match[1].trim();
    }
    return '';
}
