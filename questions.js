const questions = [
    {
        "category": "ice breaker",
        "question": "Note entre 1 à 10 à quel point les personnes actuellement autour de toi sont hot 🥵.",
        "author": "Chau Must Go On"
    },
    {
        "category": "action",
        "question": "Appelle un·e proche à qui tu penses et proposes lui un repas pimenté prochainement.",
        "author": "Chau Must Go On"
    },
    {
        "category": "culture générale",
        "question": "À quel niveau se situe le piment tabasco sur l'échelle de Scoville ?",
        "author": "Tabasse"
    },
    {
        "category": "vérité",
        "question": "Combien de temps a duré ta dernière relation en couple ?",
        "author": "Hanonymous"
    },
    {
        "category": "ice breaker",
        "question": "Si tu pouvais exaucer un souhait, ça serait quoi ?",
        "author": "Flo Chau"
    },
    {
        "category": "ice breaker",
        "question": "Si on pouvait lire dans tes pensées pendant tes moments les plus torrides, quel serait le titre du livre qu'on écrirait sur toi ? 😏📖",
        "author": "Flo GPT"
    },
    {
        "category": "ice breaker",
        "question": "Si tu pouvais avoir un supper pouvoir, mais complètement inutile, ce serait quoi ?",
        "author": "Mild Chili"
    },
    {
        "category": "vérité",
        "question": "Quelle est la dernière chose qui t'a fait rougir ?",
        "author": "Hot Chili"
    },
    {
        "category": "vérité",
        "question": "Si tu pouvais connaître une seule vérité absolue sur ta vie future, tu voudrais savoir quoi ?",
        "author": "Deep Chili"
    },
    {
        "category": "vérité",
        "question": "Tu dois révéler une chose honteuse sur toi, mais en échange tu peux poser n'importe quelle question à quelqu'un ici. Tu dis quoi ?",
        "author": "Deep Chili"
    },
    {
        "category": "vérité",
        "question": "Si tu devais choisir un de tes ex pour repartir ensemble, qui ce serait ?",
        "author": "Burning Pepper"
    },
    {
        "category": "vérité",
        "question": "Raconte une fois où tu as ghosté quelqu'un (ou où tu t'es fait ghoster).",
        "author": "Burning Pepper"
    },
    {
        "category": "vérité",
        "question": "Quel est le secret que tu n'as jamais avoué à personne ici ?",
        "author": "Burning Pepper"
    },
    {
        "category": "ice breaker",
        "question": "Si on fouillait ton historique de recherche Google, qu'est-ce qu'on y trouverait de bizarre ?",
        "author": "Inspector Pepper"
    },
    {
        "category": "vérité",
        "question": "Quelle est la dernière chose complètement débile que tu as faite sous l'effet de la fatigue ou de l'alcool ?",
        "author": "Drunken Pepper"
    },
    {
        "category": "ice breaker",
        "question": "Si un jour on te voit en une des journaux, ce sera pour quelle raison scandaleuse ?",
        "author": "Mimi Pepper"
    },
    {
        "category": "vérité",
        "question": "Si ton patron ou tes parents lisaient TOUS tes messages privés, qu'est-ce qui te mettrait le plus dans la merde ?",
        "author": "Inspector Pepper"
    },
    {
        "category": "action",
        "question": "Fais une pub de 30 secondes pour vendre un objet au hasard sur la table.",
        "author": "SalesRep Pepper"
    },
    {
        "category": "vérité",
        "question": "Ton dernier Guilty Pleasure / Plaisir Coupable ?",
        "author": "Chaud Evan"
    },
    {
        "category": "vérité",
        "question": "Quelle est la première personne à qui tu penses quand tu te lèves le matin ?",
        "author": "Martin Matin"
    },
    {
        "category": "action",
        "question": "Offre un verre à la première personne à qui tu penses qui est dans le restaurant.",
        "author": "Have you met me?"
    },
    {
        "category": "vérité",
        "question": "Jusqu'où tu irais pour l'argent ?",
        "author": "Sacha"
    },
    {
        "category": "vérité",
        "question": "Quel est ton meilleur fou rire?",
        "author": "Juju"
    },
    {
        "category": "culture générale",
        "question": "Quel âge a Brat Pitt ?\n\n- Né en 1963, soit 61 ans en 2025.",
        "author": "Juju"
    },
    {
        "category": "vérité",
        "question": "Quel est ton job de rêve ?",
        "author": "Juju"
    },
    {
        "category": "vérité",
        "question": "Quel est le job le plus sexy à ton sens ?",
        "author": "Juju"
    },
    {
        "category": "culture générale",
        "question": "Quel est le plus HOT endroit sur terre ? (t'es un.e beauf si tu réponds \"mon lit\"...)\n———\n La Vallée de la Mort, Californie (93,9°C le 15/07/72) ",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "Qui est la tête d'affiche du film \"Some Like It Hot\" ?\n———\n Marilyn Monroe",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "De quel film avec Tom Cruise s'inspire la parodie américaine \"Hot Shots 1\" ?\n——\n Top Gun",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "Dans le hit de 2004 \"Drop It Like It's Hot\", avec qui Snoop Dogg fait-il un duo ?\n———\n Pharrell Williams",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "De quelle année date le tout premier épisode de Hot Ones (version originale) ?\n———\n  2015",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "Que désigne le mot \"Calorifère\" au Québec ?\n———\n Radiateur (Ra-dzia-taeur)",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "Qui chante \"Hot Stuff\" ?\n———\n Donna Summer",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "Que fait Brassens quand il pense à Fernande ?\n———\n Il bande !",
        "author": "Tabasse"
    }
];

// Function to shuffle questions array
function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
}

// Export for use in other files
export { questions, shuffleQuestions }; 