const questionCategories = {
    ICEBREAKER: "Icebreaker",
    ACTION: "Action",
    CULTURE: "Culture Générale",
    VERITE: "Vérité"
};

const questions = [
    {
        category: questionCategories.ICEBREAKER,
        question: "Note de 1 à 10 les gens autour de toi",
        author: "Marie D.",
        id: 1
    },
    {
        category: questionCategories.ACTION,
        question: "Imite ton animal préféré pendant 10 secondes",
        author: "Thomas B.",
        id: 2
    },
    {
        category: questionCategories.CULTURE,
        question: "Cite 3 variétés de piments",
        author: "Sophie L.",
        id: 3
    },
    {
        category: questionCategories.VERITE,
        question: "Quel est le plat le plus épicé que tu aies mangé ?",
        author: "Lucas M.",
        id: 4
    },
    {
        category: questionCategories.ICEBREAKER,
        question: "Donne un surnom épicé à la personne à ta droite",
        author: "Emma P.",
        id: 5
    },
    {
        category: questionCategories.ACTION,
        question: "Fais semblant de manger le piment le plus fort du monde",
        author: "Alex R.",
        id: 6
    },
    {
        category: questionCategories.CULTURE,
        question: "Sur l'échelle de Scoville, combien de points fait le Jalapeño ?",
        author: "Julie C.",
        id: 7
    },
    {
        category: questionCategories.VERITE,
        question: "As-tu déjà fait pleurer quelqu'un avec ta cuisine épicée ?",
        author: "Marc V.",
        id: 8
    },
    {
        category: questionCategories.ICEBREAKER,
        question: "Classe les personnes présentes du plus sensible au plus résistant aux épices",
        author: "Claire D.",
        id: 9
    },
    {
        category: questionCategories.ACTION,
        question: "Mime une personne qui mange un plat trop épicé",
        author: "Paul M.",
        id: 10
    },
    {
        category: questionCategories.CULTURE,
        question: "Dans quel pays le piment Carolina Reaper a-t-il été créé ?",
        author: "Sarah B.",
        id: 11
    },
    {
        category: questionCategories.VERITE,
        question: "Quelle est ta sauce piquante préférée ?",
        author: "Hugo L.",
        id: 12
    },
    {
        category: questionCategories.ICEBREAKER,
        question: "Si tu étais un piment, lequel serais-tu et pourquoi ?",
        author: "Nina K.",
        id: 13
    },
    {
        category: questionCategories.ACTION,
        question: "Fais une pub TV pour une sauce Tabasse de ton choix",
        author: "Leo F.",
        id: 14
    },
    {
        category: questionCategories.CULTURE,
        question: "Cite 3 pays connus pour leur cuisine épicée",
        author: "Anna M.",
        id: 15
    },
    {
        category: questionCategories.VERITE,
        question: "Raconte ta pire expérience avec un plat épicé",
        author: "Tom D.",
        id: 16
    },
    {
        category: questionCategories.ICEBREAKER,
        question: "Invente un slogan pour la marque Tabasse",
        author: "Lisa R.",
        id: 17
    },
    {
        category: questionCategories.ACTION,
        question: "Dessine un piment sans lever le crayon de la feuille",
        author: "Max P.",
        id: 18
    },
    {
        category: questionCategories.CULTURE,
        question: "Quel est l'ingrédient qui rend les piments piquants ?",
        author: "Eva S.",
        id: 19
    },
    {
        category: questionCategories.VERITE,
        question: "Quel est ton plat épicé signature ?",
        author: "David M.",
        id: 20
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

// Function to get questions by category
function getQuestionsByCategory(category) {
    return questions.filter(q => q.category === category);
}

// Export for use in other files
export { questions, questionCategories, shuffleQuestions, getQuestionsByCategory }; 